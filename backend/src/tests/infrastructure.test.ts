import { Sequelize } from "sequelize";
import { createClient } from "redis";

// Mockeamos 'config' para evitar que falle por validaciones estrictas y para leer secrets correctamente en tests
jest.mock("../config", () => {
  const fs = require("fs");
  const path = require("path");
  require("dotenv").config();

  const getSecret = (key: string, defaultValue: string) => {
    // 1. Docker Secrets (Variable de entorno que apunta a un archivo, ej: POSTGRES_USER_FILE)
    const fileEnv = process.env[`${key}_FILE`];
    if (fileEnv && fs.existsSync(fileEnv)) {
      try {
        return fs.readFileSync(fileEnv, "utf-8").trim();
      } catch {}
    }

    // 2. Secretos Locales (Desarrollo: busca en ../secrets relativo a la raíz del backend)
    // process.cwd() suele ser '.../backend' al correr npm test
    const localSecretPath = path.resolve(process.cwd(), "../secrets", key);
    if (fs.existsSync(localSecretPath)) {
      try {
        return fs.readFileSync(localSecretPath, "utf-8").trim();
      } catch {}
    }

    // 3. Variable de entorno directa
    if (process.env[key]) {
      return process.env[key];
    }

    return defaultValue;
  };

  return {
    __esModule: true,
    default: {
      database: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        user: getSecret("POSTGRES_USER", "localhost"),
        password: getSecret("POSTGRES_PASSWORD", "postgres"),
        name: getSecret("POSTGRES_DB", "test_db"),
      },
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: getSecret("REDIS_PASSWORD", ""),
      },
    },
  };
});

import config from "../config";

describe("Infrastructure Integration Tests", () => {
  // --- Configuración PostgreSQL ---
  const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: "postgres",
      logging: false, // Desactivar logs de SQL para mantener limpia la consola
    }
  );

  test("should connect to PostgreSQL and execute a simple query", async () => {
    try {
      await sequelize.authenticate();
      // Ejecutamos una query simple para asegurar que la DB responde
      const [results] = await sequelize.query("SELECT 1 + 1 AS result");
      // @ts-ignore: Sequelize devuelve tipos complejos, pero sabemos que esto es un array
      expect(results[0].result).toBe(2);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  });
});
