import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async get<T>(key: string): Promise<T[]> {
    const value: T[] = await this.cacheManager.get(key);
    return value;
  }

  async set<T>(key: string, value: T[], ttl = 10): Promise<void> {
    await this.cacheManager.set(key, value, { ttl });
  }
}
