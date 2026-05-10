import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client?: Redis;
  private subscriber?: Redis;
  private publisher?: Redis;

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

  getPubSubClients(): { publisher: Redis; subscriber: Redis } | null {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return null;
    }

    if (!this.publisher) {
      this.publisher = new Redis(redisUrl, { maxRetriesPerRequest: null });
      this.publisher.on('error', (error) => {
        this.logger.warn(`Redis publisher error: ${error.message}`);
      });
    }

    if (!this.subscriber) {
      this.subscriber = new Redis(redisUrl, { maxRetriesPerRequest: null });
      this.subscriber.on('error', (error) => {
        this.logger.warn(`Redis subscriber error: ${error.message}`);
      });
    }

    return { publisher: this.publisher, subscriber: this.subscriber };
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

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
    if (this.publisher) {
      await this.publisher.quit();
    }
    if (this.subscriber) {
      await this.subscriber.quit();
    }
  }
}
