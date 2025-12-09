// src/server.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config"; // Importar la configuración centralizada
import { Pool } from "pg"; // Importar el Pool de node-postgres

const app: Application = express();
const PORT = config.server.port;

// --- Lógica de Conexión a la Base de Datos con Reintentos ---
const dbPool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

const connectWithRetry = async (retries = 5) => {
  while (retries > 0) {
    try {
      await dbPool.connect();
      console.log("✅ Conexión a la base de datos establecida exitosamente.");
      return; // Salir de la función si la conexión es exitosa
    } catch (err) {
      console.error(
        "❌ No se pudo conectar a la base de datos. Reintentando...",
        err
      );
      retries -= 1;
      if (retries === 0) {
        console.error(
          "❌ No se pudo establecer conexión con la base de datos después de varios intentos. Saliendo."
        );
        process.exit(1); // Salir de la aplicación si no se puede conectar
      }
      // Esperar 5 segundos antes de reintentar
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

// --- Middleware ---
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

const startServer = async () => {
  // 1. Intentar conectar a la base de datos
  await connectWithRetry();

  // 2. Si la conexión es exitosa, iniciar el servidor Express
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `✅ Servidor corriendo en el puerto ${PORT} en modo ${config.server.nodeEnv}`
    );
  });
};

startServer();
