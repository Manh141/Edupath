import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { internalFetch } from './http.util';

export interface AccountRoleSummary {
  userId: string;
  roles: string[];
  primaryRole: string;
  authStatus: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
}

@Injectable()
export class AuthClient {
  private readonly logger = new Logger(AuthClient.name);
  private readonly baseUrl: string;
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('AUTH_SERVICE_URL') ?? '').replace(
      /\/$/,
      '',
    );
    this.secret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.timeoutMs = Number(
      config.get<string>('EXTERNAL_SERVICE_TIMEOUT_MS') ?? 5000,
    );
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.secret);
  }

  async getRolesByUserIds(
    userIds: string[],
  ): Promise<Map<string, AccountRoleSummary>> {
    const map = new Map<string, AccountRoleSummary>();
    if (!this.isConfigured() || userIds.length === 0) {
      return map;
    }

    try {
      const result = await internalFetch<AccountRoleSummary[]>({
        baseUrl: this.baseUrl,
        path: `/api/internal/auth/accounts/roles-batch`,
        method: 'POST',
        body: { userIds },
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });

      const rows = Array.isArray(result) ? result : [];
      for (const row of rows) {
        if (row?.userId) {
          map.set(row.userId, row);
        }
      }
    } catch (error) {
      this.logger.warn(
        `getRolesByUserIds failed: ${(error as Error).message}`,
      );
    }

    return map;
  }
}
