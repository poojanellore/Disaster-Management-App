import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely with lazy checks
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

// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "DisasterGuard Emergency Core Engine",
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Incident Commander / NDMA Advisory Generation Route
app.post("/api/gemini/advisor", async (req: Request, res: Response) => {
  try {
    const { disasterType, severity, threatLevel, leadTimeMinutes, affectedPopulation, currentReadings } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback structured analysis if key is not provided in demo
      return res.json({
        success: true,
        source: 'local_ml_ensemble',
        advisory: `NDMA PRIORITY ADVISORY: Imminent ${disasterType?.toUpperCase()} (${severity}) detected. Threat Level: ${threatLevel}. Immediate 5km evacuation (Zone Alpha) enacted. Staged holding corridor active for Zone Beta. Estimated lead window: ${leadTimeMinutes} min for ~${affectedPopulation?.toLocaleString()} residents.`,
        criticalActions: [
          `Activate Level-1 Emergency Siren Broadcast on Cell-Broadcast Channel 4370.`,
          `Clear Arterial Corridor Alpha-1 for priority outbound traffic.`,
          `Pre-position search & rescue tactical units at perimeter staging stations.`,
          `Direct Zone Beta residents to shelter in place and await departure green signal.`,
        ],
      });
    }

    const prompt = `You are DisasterGuard's AI Incident Commander for national disaster management authorities (NDMA/FEMA).
Disaster Type: ${disasterType}
Magnitude / Severity: ${severity}
Threat Level: ${threatLevel}
Lead Time to Impact: ${leadTimeMinutes} minutes
Estimated Affected Population: ${affectedPopulation}
Real-time Sensor Readings: ${JSON.stringify(currentReadings || {})}

Provide a tactical 3-sentence situation briefing and 4 high-priority emergency directives for emergency response coordinators.
Keep language calm, decisive, concise, and operational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    const responseText = response.text || "";

    res.json({
      success: true,
      source: 'gemini_3.7_flash',
      advisory: responseText,
    });
  } catch (error: unknown) {
    console.error("Gemini advisor error:", error);
    const msg = error instanceof Error ? error.message : "Failed to generate AI advisory";
    res.status(500).json({ success: false, error: msg });
  }
});

// 3. Multi-Channel Alert Dispatch Endpoint
app.post("/api/alerts/broadcast", (req: Request, res: Response) => {
  const { zone, disasterType, message, channels } = req.body;
  console.log(`[ALERT BROADCAST] Zone ${zone} | ${disasterType} | Channels: ${channels?.join(', ')}`);
  res.json({
    success: true,
    broadcastId: `BC-${Date.now()}`,
    deliveredCount: zone === 'ALPHA' ? 14200 : 38400,
    channels: channels || ['APP_PUSH', 'SMS_GATEWAY', 'CELL_BROADCAST', 'SIREN_SYSTEM'],
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DisasterGuard server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
