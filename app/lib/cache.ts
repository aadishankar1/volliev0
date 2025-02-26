type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresIn: number;
};

class Cache {
  private storage: Map<string, CacheItem<any>>;
  private static instance: Cache;

  private constructor() {
    this.storage = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.expiresIn;
    if (isExpired) {
      this.storage.delete(key);
      return null;
    }

    return item.data;
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const cache = Cache.getInstance();

// Cache keys
export const CACHE_KEYS = {
  USER_ACHIEVEMENTS: (userId: string) => `user_achievements_${userId}`,
  USER_ACTIVITIES: (userId: string) => `user_activities_${userId}`,
  USER_STATS: (userId: string) => `user_stats_${userId}`,
} as const; 