import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { internalFetch } from './http.util';

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  roles?: string[];
}

@Injectable()
export class UserClient {
  private readonly logger = new Logger(UserClient.name);
  private readonly baseUrl: string;
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('USER_SERVICE_INTERNAL_URL') ?? '').replace(/\/$/, '');
    this.secret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.timeoutMs = Number(config.get<string>('EXTERNAL_SERVICE_TIMEOUT_MS') ?? 5000);
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  async findById(userId: string): Promise<UserProfile | null> {
    if (!this.isConfigured()) {
      return null;
    }
    try {
      return await internalFetch<UserProfile>({
        baseUrl: this.baseUrl,
        path: `/api/internal/users/${encodeURIComponent(userId)}`,
        method: 'GET',
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
    } catch (error) {
      this.logger.warn(`findById(${userId}) failed: ${(error as Error).message}`);
      return null;
    }
  }

  async findManyByIds(userIds: string[]): Promise<UserProfile[]> {
    if (!this.isConfigured() || userIds.length === 0) {
      return [];
    }
    try {
      const result = await internalFetch<UserProfile[]>({
        baseUrl: this.baseUrl,
        path: `/api/internal/users/batch`,
        method: 'POST',
        body: { userIds },
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
      return Array.isArray(result) ? result : [];
    } catch (error) {
      this.logger.warn(`findManyByIds failed: ${(error as Error).message}`);
      return [];
    }
  }
}
