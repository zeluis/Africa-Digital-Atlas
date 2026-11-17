import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

function resolveDistDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "dist"),
    ...(typeof __dirname !== "undefined" ? [path.resolve(__dirname)] : []),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) {
      return dir;
    }
  }
  return candidates[0];
}

function resolveMountPrefix(): string {
  const raw = process.env.BASE_PATH || process.env.BASE_URL || process.env.VITE_BASE_PATH || "";
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "/" || trimmed === "." || trimmed === "./") return "";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, "");
}

app.use(express.json());

// In-memory speech audio cache keyed by phrase text + language (bounded LRU + TTL)
const MAX_AUDIO_CACHE_ENTRIES = 100;
const AUDIO_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const TTS_MAX_CHARS = 800;
const audioCache = new Map<string, { base64Audio: string; mimeType: string; timestamp: number }>();

function getCachedAudio(key: string) {
  const entry = audioCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > AUDIO_CACHE_TTL_MS) {
    audioCache.delete(key);
    return null;
  }
  // Refresh LRU order
  audioCache.delete(key);
  audioCache.set(key, entry);
  return entry;
}

function setCachedAudio(key: string, entry: { base64Audio: string; mimeType: string; timestamp: number }) {
  const now = Date.now();
  for (const [k, v] of audioCache.entries()) {
    if (now - v.timestamp > AUDIO_CACHE_TTL_MS) {
      audioCache.delete(k);
    }
  }
  if (audioCache.has(key)) {
    audioCache.delete(key);
  }
  while (audioCache.size >= MAX_AUDIO_CACHE_ENTRIES) {
    const oldestKey = audioCache.keys().next().value;
    if (!oldestKey) break;
    audioCache.delete(oldestKey);
  }
  audioCache.set(key, entry);
}

// Rate-limit backoff tracker to prevent hammering API during quota exhaustion
let geminiTtsRateLimitedUntil = 0;

// Lazy-initialized Gemini AI client with telemetry user-agent header
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

import externalApisPayload from "./src/data/externalApisIngestion.json";
const EXTERNAL_API_CONNECTORS = externalApisPayload.connectors;

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY || "";
  res.json({
    status: "ok",
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    elevenLabsEnabled: !!elevenLabsKey,
    ingestionEngine: "operational",
    timestamp: new Date().toISOString()
  });
});

/**
 * Ingestion Engine Status & Telemetry
 */
app.get("/api/ingest/status", (req, res) => {
  res.json({
    status: "operational",
    engineVersion: "2.4.0",
    connectorsCount: EXTERNAL_API_CONNECTORS.length,
    institutionalSourcesCount: 11,
    akpDatasetsCount: 241,
    pipelineStagesCount: 7,
    canonicalEntitiesCount: 58,
    offlineCacheActive: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * Raw Tracked Dataset Endpoint for Browser Web Crypto SHA-256 Verification
 */
const ALLOWED_TRACKED_DATASETS = new Set([
  "public/africa-final.svg",
  "src/data/africaFinalGeometry.ts",
  "src/data/authenticEthnicTreeSvg.ts",
  "src/data/afriataMasterTreeData.ts",
  "src/data/slaveVoyagesData.ts",
  "src/data/records-with-descriptions.json",
  "src/data/wikipediaTableEntries.json",
  "src/data/atlas-observations-seed.ts"
]);

app.get("/api/research/dataset-raw", async (req, res) => {
  const fileScope = String(req.query.file || "");
  if (!ALLOWED_TRACKED_DATASETS.has(fileScope)) {
    return res.status(400).json({ error: "Invalid dataset scope" });
  }
  const fullPath = path.join(process.cwd(), fileScope);
  try {
    const stat = await fs.promises.stat(fullPath);
    if (!stat.isFile()) {
      return res.status(404).json({ error: "Dataset file not found" });
    }
    const etag = `"${stat.size}-${Math.trunc(stat.mtimeMs)}"`;
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=3600");
    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", String(stat.size));
    const stream = fs.createReadStream(fullPath);
    stream.on("error", () => {
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream dataset" });
      } else {
        res.end();
      }
    });
    stream.pipe(res);
  } catch {
    return res.status(404).json({ error: "Dataset file not found" });
  }
});

/**
 * Server-Side Connector Handshake & Live Probe
 * Bypasses client-side browser CORS restrictions for multilateral data feeds
 */
app.post("/api/ingest/test-connector", async (req, res) => {
  const { connectorId, countryIso3 = "GHA" } = req.body || {};
  const safeIso3 = String(countryIso3 || "GHA").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3) || "GHA";
  const connector = EXTERNAL_API_CONNECTORS.find(c => c.id === connectorId);
  const startTime = performance.now();

  if (!connector) {
    return res.status(404).json({
      connectorId: String(connectorId || ""),
      url: "",
      status: "UNAVAILABLE",
      latencyMs: 0,
      statusCode: 404,
      payloadSize: 0,
      errorMessage: `Unknown connector ID: ${String(connectorId || "")}`,
      sampleRecord: { error: "Connector not registered in externalApisIngestion.json" },
      retrievedAt: new Date().toISOString()
    });
  }

  const targetUrl = connector.sampleEndpoint.replace(/\{iso3\}/g, encodeURIComponent(safeIso3));

  try {
    const upstreamRes = await fetch(targetUrl, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Afriata-Data-Atlas/2.4 (Open Knowledge Research)" }
    });
    const latency = Math.round(performance.now() - startTime);

    if (upstreamRes.ok) {
      const rawText = await upstreamRes.text();
      let data: any = rawText;
      try {
        data = JSON.parse(rawText);
      } catch {
        // Non-JSON upstream response (e.g. HTML portal page)
      }
      return res.json({
        connectorId,
        url: targetUrl,
        status: "SUCCESS",
        latencyMs: latency,
        statusCode: upstreamRes.status,
        payloadSize: Buffer.byteLength(rawText, "utf8"),
        sampleRecord: Array.isArray(data) ? (data[1] || data[0] || data) : data,
        retrievedAt: new Date().toISOString()
      });
    }

    const errText = await upstreamRes.text().catch(() => "");
    return res.json({
      connectorId,
      url: targetUrl,
      status: "UPSTREAM_ERROR",
      latencyMs: latency,
      statusCode: upstreamRes.status,
      payloadSize: Buffer.byteLength(errText, "utf8"),
      errorMessage: `Upstream HTTP ${upstreamRes.status}`,
      sampleRecord: {
        error: `Upstream responded with HTTP ${upstreamRes.status}`,
        source: connector.name,
        country: safeIso3
      },
      retrievedAt: new Date().toISOString()
    });
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    const errMsg = isTimeout ? "Upstream probe timed out (5000ms)" : (err?.message || "Upstream network error");
    return res.json({
      connectorId,
      url: targetUrl,
      status: "UNAVAILABLE",
      latencyMs: Math.max(1, latency),
      statusCode: isTimeout ? 504 : 502,
      payloadSize: 0,
      errorMessage: errMsg,
      sampleRecord: {
        error: errMsg,
        source: connector.name,
        country: safeIso3
      },
      retrievedAt: new Date().toISOString()
    });
  }
});

/**
 * High-Fidelity Voice Synthesis Endpoint
 * Generates or retrieves natural, warm, expressive African female speech
 */
app.post("/api/tts", async (req, res) => {
  try {
    const { text, langTag = "en-NG", languageName = "African English", voiceGender = "female" } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required" });
    }

    const normalizedText = text.trim();
    if (normalizedText.length > TTS_MAX_CHARS) {
      return res.status(400).json({ error: `Text exceeds maximum allowed length of ${TTS_MAX_CHARS} characters` });
    }

    const cacheKey = `${langTag}:${normalizedText}`;
    const cached = getCachedAudio(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        source: "cache",
        audioBase64: cached.base64Audio,
        mimeType: cached.mimeType,
      });
    }

    // 1. First priority: ElevenLabs if key is configured
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY || "";
    if (elevenLabsKey) {
      try {
        const langLower = (langTag || "").toLowerCase();
        const isEuropean = langLower.startsWith("pt") || 
                           langLower.startsWith("es") || 
                           langLower.startsWith("it") || 
                           langLower.startsWith("nl") || 
                           langLower.startsWith("de") || 
                           (langLower.startsWith("fr") && !langLower.includes("sn") && !langLower.includes("ci") && !langLower.includes("mg"));

        // Voice profiles:
        // European languages use FGY2WhTYpPnrIDTdsKH5 (Laura - warm, friendly, casual European tone)
        // African languages use EXAVITQu4vr4xnSDxMaL (Bella - grounded, expressive, warm storyteller)
        let defaultVoice = isEuropean ? "FGY2WhTYpPnrIDTdsKH5" : "EXAVITQu4vr4xnSDxMaL";
        
        // Voice-specific settings
        // European voices: lighter stability, friendly style accentuation
        // African voices: higher similarity, grounded maternal resonance
        const voiceSettings = isEuropean ? {
          stability: 0.48,
          similarity_boost: 0.88,
          style: 0.32,
          use_speaker_boost: true,
        } : {
          stability: 0.55,
          similarity_boost: 0.85,
          style: 0.20,
          use_speaker_boost: true,
        };

        const voiceId = process.env.ELEVENLABS_VOICE_ID || defaultVoice;
        const elResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          signal: AbortSignal.timeout(10000),
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsKey.trim(),
          },
          body: JSON.stringify({
            text: normalizedText,
            model_id: "eleven_multilingual_v2",
            voice_settings: voiceSettings,
          }),
        });

        if (elResponse.ok) {
          const arrayBuffer = await elResponse.arrayBuffer();
          const base64Audio = Buffer.from(arrayBuffer).toString("base64");
          const mimeType = "audio/mpeg";

          setCachedAudio(cacheKey, {
            base64Audio,
            mimeType,
            timestamp: Date.now(),
          });

          return res.json({
            success: true,
            source: "elevenlabs",
            audioBase64: base64Audio,
            mimeType,
          });
        } else {
          const errDetail = await elResponse.text();
          console.warn("ElevenLabs TTS error status:", elResponse.status, errDetail);
        }
      } catch (elErr) {
        console.warn("ElevenLabs TTS request failed, falling back to Gemini:", elErr);
      }
    }

    // 2. Second priority: Gemini Generative TTS (gemini-3.8-flash-lite-tts)
    const now = Date.now();
    const isRateLimited = now < geminiTtsRateLimitedUntil;
    const ai = isRateLimited ? null : getGenAI();

    if (ai) {
      try {
        const speechPrompt = `Speak in a warm, welcoming, natural African female voice (mid 30's, friendly, smooth conversational cadence, with a gentle smile and inviting tone): ${normalizedText}`;

        let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
        const response = await Promise.race([
          ai.models.generateContent({
            model: "gemini-3.8-flash-lite-tts",
            contents: [{ parts: [{ text: speechPrompt }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  // Kore is a warm, articulate, natural voice with great emotional depth
                  prebuiltVoiceConfig: { voiceName: "Kore" },
                },
              },
            },
          }),
          new Promise<never>((_, reject) => {
            timeoutTimer = setTimeout(() => reject(new Error("Gemini TTS request timed out")), 10000);
          }),
        ]).finally(() => {
          if (timeoutTimer) clearTimeout(timeoutTimer);
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || "audio/wav";

        if (audioData) {
          setCachedAudio(cacheKey, {
            base64Audio: audioData,
            mimeType,
            timestamp: Date.now(),
          });

          return res.json({
            success: true,
            source: "gemini-tts",
            audioBase64: audioData,
            mimeType,
          });
        }
      } catch (geminiErr: any) {
        // Detect 429 quota exhaustion and trigger backoff without noisy exceptions
        const errMsg = String(geminiErr?.message || geminiErr || "");
        const isQuotaErr = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded");
        if (isQuotaErr) {
          geminiTtsRateLimitedUntil = Date.now() + 60000; // Back off for 60 seconds
        }
      }
    }

    // 3. If neither cloud API key is configured or both errored/quota-exhausted, notify client to use client-side neural synthesis
    return res.json({
      success: false,
      fallback: true,
      message: "Cloud speech unavailable or rate-limited; using browser enhanced acoustic synthesis.",
    });
  } catch (error: any) {
    console.error("TTS endpoint error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Production static file serving or development Vite handling
async function startServer() {
  const mountPrefix = resolveMountPrefix();
  const distPath = resolveDistDir();
  const docsPath = path.join(distPath, "docs");

  // Return structured JSON 404 for unknown API endpoints instead of falling through to SPA HTML
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  if (mountPrefix) {
    // Allow mounted reverse-proxy subpath calls like /atlas/api/* to reuse registered /api/* handlers
    app.use(`${mountPrefix}/api`, (req, res, next) => {
      req.url = `/api${req.url}`;
      app(req, res, next);
    });
  }

  const docsMount = `${mountPrefix}/docs`;
  if (fs.existsSync(path.join(docsPath, "index.html"))) {
    app.use(docsMount, (req, res, next) => {
      if (req.originalUrl.split("?")[0] === docsMount) {
        return res.redirect(301, `${docsMount}/`);
      }
      next();
    }, express.static(docsPath));
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const mountStaticAt = mountPrefix || "/";
    app.use(mountStaticAt, express.static(distPath));
    if (mountPrefix) {
      app.get(mountPrefix, (req, res, next) => {
        if (req.originalUrl.split("?")[0] === mountPrefix) {
          return res.redirect(301, `${mountPrefix}/`);
        }
        next();
      });
    }
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Afriata server running on http://0.0.0.0:${PORT}${mountPrefix || "/"}`);
  });
}

startServer();
