import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

function resolvePort(): number {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--port" || arg === "-p") {
      const next = Number(args[i + 1]);
      if (Number.isInteger(next) && next > 0) return next;
    } else if (arg.startsWith("--port=")) {
      const val = Number(arg.slice("--port=".length));
      if (Number.isInteger(val) && val > 0) return val;
    }
  }
  const envPort = Number(process.env.PORT);
  return Number.isInteger(envPort) && envPort > 0 ? envPort : 3000;
}

const app = express();
const PORT = resolvePort();

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

app.disable("x-powered-by");
if (process.env.TRUST_PROXY !== "false") {
  app.set("trust proxy", 1);
}

function computeSpaInlineScriptHashes(distDir: string): string[] {
  const indexHtmlPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexHtmlPath)) return [];
  try {
    const html = fs.readFileSync(indexHtmlPath, "utf8");
    const hashes: string[] = [];
    const scriptRegex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = scriptRegex.exec(html)) !== null) {
      const body = match[1];
      if (body && body.trim().length > 0) {
        const digest = crypto.createHash("sha256").update(body, "utf8").digest("base64");
        hashes.push(`'sha256-${digest}'`);
      }
    }
    return hashes;
  } catch {
    return [];
  }
}

const mountPrefixForCsp = resolveMountPrefix();
const docsPathPrefix = `${mountPrefixForCsp}/docs`;
let cachedSpaScriptHashes: string[] | null = null;

app.use((req, res, next) => {
  const isProdEnv = process.env.NODE_ENV === "production";
  const reqPath = req.path || "/";
  const isDocsRoute = reqPath === docsPathPrefix || reqPath.startsWith(`${docsPathPrefix}/`);

  if (isProdEnv && cachedSpaScriptHashes === null) {
    cachedSpaScriptHashes = computeSpaInlineScriptHashes(resolveDistDir());
  }

  const scriptSrcTokens = [
    "'self'",
    ...(isProdEnv && !isDocsRoute
      ? (cachedSpaScriptHashes && cachedSpaScriptHashes.length > 0 ? cachedSpaScriptHashes : [])
      : ["'unsafe-inline'"]),
    "https://translate.google.com",
    "https://translate.googleapis.com",
    "https://translate-pa.googleapis.com",
    "https://www.gstatic.com",
    ...(isProdEnv ? [] : ["'unsafe-eval'"]),
  ];

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com",
      "worker-src 'self' blob:",
      `script-src ${scriptSrcTokens.join(" ")}`,
      `connect-src 'self' https:${isProdEnv ? "" : " ws: wss:"}`,
    ].join("; ")
  );
  next();
});

app.use(express.json({ limit: "16kb" }));

const MAX_CONNECTOR_PROBE_BYTES = 1024 * 1024; // 1 MB upstream probe read cap
const MAX_RATE_LIMIT_BUCKETS = 5000;

function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }): express.RequestHandler {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > 1000) {
      for (const [key, bucket] of buckets.entries()) {
        if (now >= bucket.resetAt) {
          buckets.delete(key);
        }
      }
    }
    while (buckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (!oldestKey) break;
      buckets.delete(oldestKey);
    }

    const clientIp = req.ip || req.socket?.remoteAddress || "unknown";
    const existing = buckets.get(clientIp);

    if (!existing || now >= existing.resetAt) {
      if (existing) buckets.delete(clientIp);
      buckets.set(clientIp, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: "Rate limit exceeded. Please retry shortly.",
        retryAfterSeconds: retryAfterSec
      });
    }

    existing.count += 1;
    return next();
  };
}

const connectorProbeLimiter = createRateLimiter({ windowMs: 60_000, max: 60 });
const ttsLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });

async function readUpstreamBytesCapped(
  response: globalThis.Response,
  maxBytes: number
): Promise<{ buffer: Buffer; byteLength: number; truncated: boolean }> {
  const declaredLen = Number(response.headers.get("content-length"));
  if (!response.body) {
    return { buffer: Buffer.alloc(0), byteLength: 0, truncated: false };
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  let truncated = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;

      const remaining = maxBytes - totalBytes;
      if (remaining <= 0) {
        truncated = true;
        await reader.cancel().catch(() => {});
        break;
      }

      if (value.byteLength > remaining) {
        chunks.push(Buffer.from(value.subarray(0, remaining)));
        totalBytes += remaining;
        truncated = true;
        await reader.cancel().catch(() => {});
        break;
      }

      chunks.push(Buffer.from(value));
      totalBytes += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }

  return {
    buffer: Buffer.concat(chunks),
    byteLength: Number.isFinite(declaredLen) && declaredLen > totalBytes ? declaredLen : totalBytes,
    truncated
  };
}

async function readUpstreamTextCapped(response: globalThis.Response, maxBytes: number): Promise<{ text: string; byteLength: number }> {
  const { buffer, byteLength } = await readUpstreamBytesCapped(response, maxBytes);
  return {
    text: buffer.toString("utf8"),
    byteLength
  };
}

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
import akpRegistryPayload from "./src/data/akpRegistry241.json";
import { INITIAL_PIPELINE_STEPS } from "./src/data/atlas-pipeline";
import { getInitialEntities } from "./src/data/atlas-raw-data";

const EXTERNAL_API_CONNECTORS = externalApisPayload.connectors;
const AKP_DATASETS_COUNT = akpRegistryPayload.pillarsMeta.reduce((sum, pillar) => sum + pillar.count, 0);
const PIPELINE_STAGES_COUNT = INITIAL_PIPELINE_STEPS.length;
const CANONICAL_ENTITIES_COUNT = getInitialEntities().length;

const apiRouter = express.Router();

/**
 * Health check endpoint
 */
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    ingestionEngine: "operational",
    timestamp: new Date().toISOString()
  });
});

/**
 * Ingestion Engine Status & Telemetry
 */
apiRouter.get("/ingest/status", (req, res) => {
  const uniqueOrganizations = new Set(
    EXTERNAL_API_CONNECTORS.map((connector: { organization?: string }) => connector.organization).filter(Boolean)
  ).size;
  res.json({
    status: "operational",
    engineVersion: "2.4.0",
    connectorsCount: EXTERNAL_API_CONNECTORS.length,
    institutionalSourcesCount: uniqueOrganizations,
    akpDatasetsCount: AKP_DATASETS_COUNT,
    pipelineStagesCount: PIPELINE_STAGES_COUNT,
    canonicalEntitiesCount: CANONICAL_ENTITIES_COUNT,
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

apiRouter.get("/research/dataset-raw", async (req, res) => {
  const fileScope = String(req.query.file || "");
  if (!ALLOWED_TRACKED_DATASETS.has(fileScope)) {
    return res.status(400).json({ error: "Invalid dataset scope" });
  }
  const baseDir = path.resolve(process.cwd());
  const fullPath = path.resolve(baseDir, fileScope);
  if (!fullPath.startsWith(baseDir + path.sep)) {
    return res.status(400).json({ error: "Invalid dataset path" });
  }
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
apiRouter.post("/ingest/test-connector", connectorProbeLimiter, async (req, res) => {
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
    const parsedUrl = new URL(targetUrl);
    const host = parsedUrl.hostname.toLowerCase();
    const isBlockedHost =
      parsedUrl.protocol !== "https:" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.startsWith("169.254.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      host.endsWith(".local");
    if (isBlockedHost) {
      return res.status(400).json({ error: "Connector target URL is not permitted" });
    }

    const upstreamRes = await fetch(parsedUrl.toString(), {
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      headers: { "User-Agent": "Afriata-Data-Atlas/2.4 (Open Knowledge Research)" }
    });
    const latency = Math.round(performance.now() - startTime);

    if (upstreamRes.ok) {
      const { text: rawText, byteLength } = await readUpstreamTextCapped(upstreamRes, MAX_CONNECTOR_PROBE_BYTES);
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
        payloadSize: byteLength,
        sampleRecord: Array.isArray(data) ? (data[1] || data[0] || data) : data,
        retrievedAt: new Date().toISOString()
      });
    }

    const { byteLength: errBytes } = await readUpstreamTextCapped(upstreamRes, 16 * 1024).catch(() => ({ text: "", byteLength: 0 }));
    return res.json({
      connectorId,
      url: targetUrl,
      status: "UPSTREAM_ERROR",
      latencyMs: latency,
      statusCode: upstreamRes.status,
      payloadSize: errBytes,
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
apiRouter.post("/tts", ttsLimiter, async (req, res) => {
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

    // 1. Priority: Gemini Generative TTS (gemini-3.8-flash-lite-tts)
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

// Return structured JSON 404 for unknown API endpoints instead of falling through to SPA HTML
apiRouter.all("*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Production static file serving or development Vite handling
async function startServer() {
  const mountPrefix = resolveMountPrefix();
  const distPath = resolveDistDir();
  const docsPath = path.join(distPath, "docs");

  app.use("/api", apiRouter);
  if (mountPrefix) {
    app.use(`${mountPrefix}/api`, apiRouter);
  }

  const createStaticCacheHeaders = (rootDir: string) => {
    const resolvedRoot = path.resolve(rootDir);
    return (res: express.Response, filePath: string) => {
      const rel = path.relative(resolvedRoot, path.resolve(filePath)).replace(/\\/g, "/");
      const baseName = path.posix.basename(rel);
      if (baseName === "index.html" || baseName === "sw.js" || baseName === "manifest.webmanifest") {
        res.setHeader("Cache-Control", "no-cache");
        return;
      }
      if (rel.startsWith("assets/") && /[-.][A-Za-z0-9_-]{8}\.[^./]+$/.test(baseName)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    };
  };

  const docsMount = `${mountPrefix}/docs`;
  if (fs.existsSync(path.join(docsPath, "index.html"))) {
    app.use(docsMount, (req, res, next) => {
      if (req.originalUrl.split("?")[0] === docsMount) {
        return res.redirect(301, `${docsMount}/`);
      }
      next();
    }, express.static(docsPath, { setHeaders: createStaticCacheHeaders(docsPath) }));
  }

  if (process.env.NODE_ENV !== "production") {
    let viteInstance: any = null;
    const viteReady = import("vite")
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: {
            middlewareMode: true,
            allowedHosts: true,
          },
          appType: "spa",
        })
      )
      .then((vite) => {
        viteInstance = vite;
        return vite;
      })
      .catch((err) => {
        console.error("Failed to initialize Vite dev middleware:", err);
        throw err;
      });

    app.use(async (req, res, next) => {
      if (viteInstance) {
        return viteInstance.middlewares(req, res, next);
      }
      try {
        const vite = await viteReady;
        return vite.middlewares(req, res, next);
      } catch (err) {
        return next(err);
      }
    });
  } else {
    const mountStaticAt = mountPrefix || "/";
    app.use(mountStaticAt, express.static(distPath, { setHeaders: createStaticCacheHeaders(distPath) }));
    if (mountPrefix) {
      app.get(mountPrefix, (req, res, next) => {
        if (req.originalUrl.split("?")[0] === mountPrefix) {
          return res.redirect(301, `${mountPrefix}/`);
        }
        next();
      });
    }
    const spaFallbackRoute = mountPrefix ? `${mountPrefix}/*` : "*";
    app.get(spaFallbackRoute, (_req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Afriata server running on http://0.0.0.0:${PORT}${mountPrefix || "/"}`);
  });
}

startServer();
