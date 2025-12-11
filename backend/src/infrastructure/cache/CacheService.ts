import { redisClient } from "./RedisClient";

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

export class CacheService {
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL =
      options.ttl || parseInt(process.env.CACHE_DEFAULT_TTL || "300", 10);
    this.keyPrefix = options.prefix || "portfolio:";
  }

  private buildKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key);
      const data = await redisClient.get(fullKey);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`[CacheService] Error getting key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const serialized = JSON.stringify(value);
      const expiration = ttl || this.defaultTTL;

      if (expiration > 0) {
        await redisClient.setex(fullKey, expiration, serialized);
      } else {
        await redisClient.set(fullKey, serialized);
      }

      return true;
    } catch (error) {
      console.error(`[CacheService] Error setting key "${key}":`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const result = await redisClient.del(fullKey);
      return result > 0;
    } catch (error) {
      console.error(`[CacheService] Error deleting key "${key}":`, error);
      return false;
    }
  }

  async delPattern(pattern: string): Promise<number> {
    try {
      const fullPattern = this.buildKey(pattern);
      const keys = await redisClient.keys(fullPattern);

      if (keys.length === 0) {
        return 0;
      }

      return await redisClient.del(...keys);
    } catch (error) {
      console.error(
        `[CacheService] Error deleting pattern "${pattern}":`,
        error
      );
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const result = await redisClient.exists(fullKey);
      return result === 1;
    } catch (error) {
      console.error(
        `[CacheService] Error checking existence of key "${key}":`,
        error
      );
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await redisClient.ttl(fullKey);
    } catch (error) {
      console.error(`[CacheService] Error getting TTL of key "${key}":`, error);
      return -1;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const result = await redisClient.expire(fullKey, seconds);
      return result === 1;
    } catch (error) {
      console.error(
        `[CacheService] Error setting expiration for key "${key}":`,
        error
      );
      return false;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await redisClient.incrby(fullKey, amount);
    } catch (error) {
      console.error(`[CacheService] Error incrementing key "${key}":`, error);
      throw error;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await redisClient.decrby(fullKey, amount);
    } catch (error) {
      console.error(`[CacheService] Error decrementing key "${key}":`, error);
      throw error;
    }
  }

  async clear(): Promise<boolean> {
    try {
      const keys = await redisClient.keys(`${this.keyPrefix}*`);

      if (keys.length === 0) {
        return true;
      }

      await redisClient.del(...keys);
      return true;
    } catch (error) {
      console.error("[CacheService] Error clearing cache:", error);
      return false;
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const freshData = await fetchFunction();
    await this.set(key, freshData, ttl);

    return freshData;
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const fullKeys = keys.map((key) => this.buildKey(key));
      const values = await redisClient.mget(...fullKeys);

      return values.map((value) => {
        if (!value) return null;
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error("[CacheService] Error getting multiple keys:", error);
      return keys.map(() => null);
    }
  }

  async mset<T>(
    entries: Array<{ key: string; value: T; ttl?: number }>
  ): Promise<boolean> {
    try {
      const pipeline = redisClient.pipeline();

      for (const entry of entries) {
        const fullKey = this.buildKey(entry.key);
        const serialized = JSON.stringify(entry.value);
        const expiration = entry.ttl || this.defaultTTL;

        if (expiration > 0) {
          pipeline.setex(fullKey, expiration, serialized);
        } else {
          pipeline.set(fullKey, serialized);
        }
      }

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("[CacheService] Error setting multiple keys:", error);
      return false;
    }
  }

  async invalidateGroup(group: string): Promise<number> {
    return this.delPattern(`${group}:*`);
  }

  getKeyPrefix(): string {
    return this.keyPrefix;
  }

  getDefaultTTL(): number {
    return this.defaultTTL;
  }
}

export const cacheService = new CacheService({
  ttl: parseInt(process.env.CACHE_DEFAULT_TTL || "300", 10),
  prefix: process.env.CACHE_KEY_PREFIX || "portfolio:",
});
