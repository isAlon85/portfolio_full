// src/server.ts
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet()); // Ayuda a securizar la app estableciendo varias cabeceras HTTP
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json());

// Health check endpoint (REQUERIDO para Docker healthcheck)
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor con bind a 0.0.0.0 (IMPORTANTE para Docker)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
