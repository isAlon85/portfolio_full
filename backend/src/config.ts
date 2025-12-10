// src/config.ts
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/**
 * Lee un valor de configuración, priorizando un archivo de Docker Secret.
 * Si la variable _FILE existe, lee el archivo. De lo contrario, usa la variable de entorno.
 * Si el valor es obligatorio y no se encuentra, la aplicación se detendrá.
 * @param secretName El nombre base de la variable de entorno (ej. "DB_PASSWORD").
 * @param isRequired Indica si el valor es obligatorio.
 * @returns El valor del secreto.
 */
const getConfigValue = (secretName: string, isRequired = true): string => {
  const secretPath = process.env[`${secretName}_FILE`];
  let value: string | undefined;

  if (secretPath) {
    try {
      // Lee el contenido del archivo, elimina espacios/saltos de línea al inicio/final.
      value = fs.readFileSync(secretPath, "utf8").trim();
    } catch (error) {
      console.error(
        `[Config] Error al leer el secret desde el archivo: ${secretPath}`,
        error
      );
      process.exit(1);
    }
  } else {
    value = process.env[secretName];
  }

  if (isRequired && (value === undefined || value === "")) {
    console.error(
      `[Config] La variable de configuración obligatoria '${secretName}' no está definida.`
    );
    process.exit(1);
  }

  return value || "";
};

const config = {
  server: {
    port: Number(getConfigValue("PORT", false)) || 3000,
    nodeEnv: getConfigValue("NODE_ENV", false) || "development",
  },
  database: {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    user: getConfigValue("POSTGRES_USER"),
    password: getConfigValue("POSTGRES_PASSWORD"),
    name: getConfigValue("POSTGRES_DB"),
  },
  redis: {
    host: "localhost",
    port: 6379,
    password: getConfigValue("REDIS_PASSWORD"),
  },
  jwt: {
    secret: getConfigValue("JWT_SECRET"),
    refreshSecret: getConfigValue("JWT_REFRESH_SECRET"),
  },
};

export default config;
