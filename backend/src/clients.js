const mysql = require("mysql2/promise");
const { createClient } = require("redis");

// --- Cliente MySQL ---
// Usamos createPool para gestionar múltiples conexiones de forma eficiente.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql", // 'mysql' es el nombre del servicio en docker-compose
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- Cliente Redis ---
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || "redis", // 'redis' es el nombre del servicio en docker-compose
    port: 6379,
    reconnectStrategy: (retries) => {
      // Si se han intentado 10 reconexiones, se deja de intentar.
      if (retries > 10) {
        return new Error(
          "Se superó el número de intentos de reconexión a Redis."
        );
      }
      // Se espera un tiempo exponencialmente creciente, con un máximo de 500ms.
      return Math.min(retries * 50, 500);
    },
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = { pool, redisClient };
