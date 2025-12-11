import { Sequelize } from "sequelize";
import { databaseConfig } from "./config";

class DatabaseConnection {
  private static instance: Sequelize | null = null;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Sequelize({
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        username: databaseConfig.username,
        password: databaseConfig.password,
        dialect: databaseConfig.dialect,
        logging: databaseConfig.logging,
        pool: databaseConfig.pool,
        define: databaseConfig.define,
        dialectOptions: databaseConfig.dialectOptions,
        timezone: databaseConfig.timezone,
      });
    }

    return DatabaseConnection.instance;
  }

  public static async testConnection(): Promise<boolean> {
    try {
      const sequelize = DatabaseConnection.getInstance();
      await sequelize.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async closeConnection(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.close();
      DatabaseConnection.instance = null;
    }
  }

  public static async syncModels(options?: {
    force?: boolean;
    alter?: boolean;
  }): Promise<void> {
    const sequelize = DatabaseConnection.getInstance();
    await sequelize.sync({
      force: options?.force || false,
      alter:
        options?.alter ||
        (process.env.NODE_ENV === "development" && !options?.force),
    });
  }
}

export const sequelize = DatabaseConnection.getInstance();
export const testDatabaseConnection = DatabaseConnection.testConnection;
export const closeDatabaseConnection = DatabaseConnection.closeConnection;
export const syncModels = DatabaseConnection.syncModels;
