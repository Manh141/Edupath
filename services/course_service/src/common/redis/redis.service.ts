import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client?: Redis;

  getClient(): Redis | null {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return null;
    }

    if (!this.client) {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });

      this.client.on('error', (error) => {
        this.logger.warn(`Redis error: ${error.message}`);
      });
    }

    return this.client;
  }

  async ping(): Promise<boolean> {
    const client = this.getClient();
    if (!client) {
      return false;
    }

    try {
      const result = await client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  getBullMQConnection(): Redis | null {
    return this.getClient();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}
