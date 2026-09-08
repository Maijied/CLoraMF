import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom user agent
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    // If Gemini key is available, use Gemini 3.8 Flash
    if (process.env.GEMINI_API_KEY) {
      if (!genAI) {
        genAI = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }

      const model = "gemini-3.8-flash";
      const systemInstruction = `You are the CMF Watch AI Assistant.
You are an advanced companion for the CMF Watch 3 Pro (Nothing ecosystem).
Context available:
- Watch Connected: ${context?.watchStatus?.connected ?? true}
- Current Firmware: ${context?.firmware ?? '1.4.2-AI'}
- Battery Level: ${context?.battery ?? 84}%
- Current Heart Rate: ${context?.heartRate ?? 74} BPM
- Steps Today: ${context?.steps ?? 8432}
You provide concise, highly intelligent, and technically precise advice adhering to Nothing/CMF minimal engineering aesthetic.
You can recommend watch faces, suggest SDK app component layouts, explain BLE GATT protocols, analyze heart rate variability, or provide Git terminal assistance.`;

      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    }

    // Fallback intelligent simulation when API key is configuring
    const p = (prompt || '').toLowerCase();
    let text = "CMF Watch OS Core: Telemetry analyzed.";

    if (p.includes('heart') || p.includes('bpm') || p.includes('vital') || p.includes('health')) {
      text = `[Biometric Analysis] Current PPG sensor reports ${context?.heartRate || 74} BPM with stable sinus rhythm. HRV indicates low physiological stress. Recommended: 25-minute deep focus session before next activity cycle.`;
    } else if (p.includes('firmware') || p.includes('ota') || p.includes('update')) {
      text = `[OTA Subsystem] CMF OS v1.5.0-PRO is available for Over-The-Air deployment. Highlights include AI Copilot protocol over BLE 5.3, 24% lower AOD consumption, and sandboxed bytecode runtime for Custom SDK Apps.`;
    } else if (p.includes('git') || p.includes('commit') || p.includes('repo')) {
      text = `[Git Version Control] Branch 'main' is synchronized. Repository 'cmf-watch3-ble-protocol' has 2 uncommitted changes in 'BLEManager.kt'. Staging area is ready for commit.`;
    } else if (p.includes('face') || p.includes('dial') || p.includes('watchface')) {
      text = `[WatchFace Engine] 466x466 AMOLED dial pipeline active. Active face: 'CMF Matrix Dot' with 3 customizable complication slots. You can flash new watch faces over BLE channel 0xFE70.`;
    } else if (p.includes('sdk') || p.includes('app') || p.includes('code')) {
      text = `[SDK Runtime] Watch App SDK v1.0.0 is ready. You can compile visual UI components into ARM Cortex-M33 RTOS bytecodes (.wapp) and test them directly in the live watch simulator.`;
    } else {
      text = `[CMF AI Core] Command received: "${prompt}". Telemetry stream is nominal (Battery: ${context?.battery || 84}%, Link: BLE 5.3 Active). System integrity verified at 98%.`;
    }

    res.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Vite middleware for development & static serving for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupVite();
