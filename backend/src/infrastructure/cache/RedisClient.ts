import Redis, { RedisOptions } from "ioredis";

class RedisClientSingleton {
  private static instance: Redis | null = null;
  private static isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClientSingleton.instance) {
      const config: RedisOptions = {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || "0", 10),
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
        showFriendlyErrorStack: process.env.NODE_ENV === "development",
        connectTimeout: 10000,
        keepAlive: 30000,
      };

      RedisClientSingleton.instance = new Redis(config);

      RedisClientSingleton.instance.on("connect", () => {
        RedisClientSingleton.isConnected = true;
        console.log("[Redis] Connected successfully");
      });

      RedisClientSingleton.instance.on("ready", () => {
        console.log("[Redis] Ready to accept commands");
      });

      RedisClientSingleton.instance.on("error", (error: Error) => {
        RedisClientSingleton.isConnected = false;
        console.error("[Redis] Connection error:", error.message);
      });

      RedisClientSingleton.instance.on("close", () => {
        RedisClientSingleton.isConnected = false;
        console.log("[Redis] Connection closed");
      });

      RedisClientSingleton.instance.on("reconnecting", (delay: number) => {
        console.log(`[Redis] Reconnecting in ${delay}ms...`);
      });

      RedisClientSingleton.instance.on("end", () => {
        RedisClientSingleton.isConnected = false;
        console.log("[Redis] Connection ended");
      });
    }

    return RedisClientSingleton.instance;
  }

  public static async testConnection(): Promise<boolean> {
    try {
      const redis = RedisClientSingleton.getInstance();
      await redis.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async closeConnection(): Promise<void> {
    if (RedisClientSingleton.instance) {
      await RedisClientSingleton.instance.quit();
      RedisClientSingleton.instance = null;
      RedisClientSingleton.isConnected = false;
    }
  }

  public static getConnectionStatus(): boolean {
    return RedisClientSingleton.isConnected;
  }

  public static async flushAll(): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      const redis = RedisClientSingleton.getInstance();
      await redis.flushall();
    } else {
      throw new Error("flushAll is disabled in production environment");
    }
  }
}

export const redisClient = RedisClientSingleton.getInstance();
export const testRedisConnection = RedisClientSingleton.testConnection;
export const closeRedisConnection = RedisClientSingleton.closeConnection;
export const getRedisConnectionStatus =
  RedisClientSingleton.getConnectionStatus;
export const flushRedis = RedisClientSingleton.flushAll;
