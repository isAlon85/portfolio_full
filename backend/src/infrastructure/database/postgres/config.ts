import { Dialect } from "sequelize";

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: Dialect;
  logging: boolean | ((sql: string, timing?: number) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  define: {
    timestamps: boolean;
    underscored: boolean;
    freezeTableName: boolean;
    paranoid: boolean;
  };
  dialectOptions: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  timezone: string;
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "portfolio_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || "10", 10),
    min: parseInt(process.env.DB_POOL_MIN || "2", 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
    idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  },
  dialectOptions: {
    ssl:
      process.env.DB_SSL === "true"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
  },
  timezone: "+00:00",
};
