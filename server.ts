import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory speech audio cache keyed by phrase text + language
const audioCache = new Map<string, { base64Audio: string; mimeType: string; timestamp: number }>();

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

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY || "sk_385cacd988ad2108f273ae546bbc6641f1fd4688283011a9";
  res.json({
    status: "ok",
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    elevenLabsEnabled: !!elevenLabsKey,
  });
});

/**
 * High-Fidelity Voice Synthesis Endpoint
 * Generates or retrieves natural, warm, expressive African female speech
 */
app.post("/api/tts", async (req, res) => {
  try {
    const { text, langTag = "en-NG", languageName = "African English", voiceGender = "female" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text parameter is required" });
    }

    const cacheKey = `${langTag}:${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return res.json({
        success: true,
        source: "cache",
        audioBase64: cached.base64Audio,
        mimeType: cached.mimeType,
      });
    }

    // 1. First priority: ElevenLabs if key is configured
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY || "sk_385cacd988ad2108f273ae546bbc6641f1fd4688283011a9";
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
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsKey.trim(),
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: voiceSettings,
          }),
        });

        if (elResponse.ok) {
          const arrayBuffer = await elResponse.arrayBuffer();
          const base64Audio = Buffer.from(arrayBuffer).toString("base64");
          const mimeType = "audio/mpeg";

          audioCache.set(cacheKey, {
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

    // 2. Second priority: Gemini Generative TTS (gemini-3.1-flash-tts-preview)
    const now = Date.now();
    const isRateLimited = now < geminiTtsRateLimitedUntil;
    const ai = isRateLimited ? null : getGenAI();

    if (ai) {
      try {
        const speechPrompt = `Speak in a warm, welcoming, natural African female voice (mid 30's, friendly, smooth conversational cadence, with a gentle smile and inviting tone): ${text}`;
        
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
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
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || "audio/wav";

        if (audioData) {
          audioCache.set(cacheKey, {
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
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Africalia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
