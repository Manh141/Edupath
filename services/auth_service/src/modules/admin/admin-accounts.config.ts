import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ROLES } from '../../common/constants/role.constants';

export type BootstrapAdminRole = typeof ROLES.ADMIN;

export interface BootstrapAdminAccount {
  email: string;
  normalizedEmail: string;
  password: string;
  role: BootstrapAdminRole;
  forcePasswordChange: boolean;
}

type RawBootstrapAdminAccount = {
  email?: unknown;
  password?: unknown;
  role?: unknown;
  forcePasswordChange?: unknown;
};

@Injectable()
export class AdminAccountsConfig {
  constructor(private readonly configService: ConfigService) {}

  getAccounts(): BootstrapAdminAccount[] {
    const raw = this.configService
      .get<string>('ADMIN_ACCOUNTS_JSON', '')
      .trim();

    if (!raw) {
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON is not valid JSON: ${
          error instanceof Error ? error.message : 'unknown parse error'
        }`,
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error('ADMIN_ACCOUNTS_JSON must be a JSON array.');
    }

    const seen = new Set<string>();

    return parsed.map((item, index) => {
      const account = this.normalizeAccount(item, index);

      if (seen.has(account.normalizedEmail)) {
        throw new Error(
          `ADMIN_ACCOUNTS_JSON contains duplicate email: ${account.email}`,
        );
      }

      seen.add(account.normalizedEmail);
      return account;
    });
  }

  private normalizeAccount(
    rawAccount: unknown,
    index: number,
  ): BootstrapAdminAccount {
    if (!rawAccount || typeof rawAccount !== 'object') {
      throw new Error(`ADMIN_ACCOUNTS_JSON[${index}] must be an object.`);
    }

    const account = rawAccount as RawBootstrapAdminAccount;
    const email = this.normalizeEmail(account.email, index);
    const password = this.normalizePassword(account.password, index);
    const role = this.normalizeRole(account.role, index);

    return {
      email,
      normalizedEmail: email,
      password,
      role,
      forcePasswordChange:
        typeof account.forcePasswordChange === 'boolean'
          ? account.forcePasswordChange
          : true,
    };
  }

  private normalizeEmail(value: unknown, index: number): string {
    if (typeof value !== 'string') {
      throw new Error(`ADMIN_ACCOUNTS_JSON[${index}].email must be a string.`);
    }

    const email = value.trim().toLowerCase();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmail) {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON[${index}].email must be a valid email address.`,
      );
    }

    if (!email.endsWith('@gmail.com')) {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON[${index}].email must be a Gmail address.`,
      );
    }

    return email;
  }

  private normalizePassword(value: unknown, index: number): string {
    if (typeof value !== 'string') {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON[${index}].password must be a string.`,
      );
    }

    if (value.length < 8 || value.length > 128) {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON[${index}].password must be 8-128 characters.`,
      );
    }

    return value;
  }

  private normalizeRole(value: unknown, index: number): BootstrapAdminRole {
    const role = typeof value === 'string' ? value.trim() : ROLES.ADMIN;

    if (role !== ROLES.ADMIN) {
      throw new Error(
        `ADMIN_ACCOUNTS_JSON[${index}].role must be "${ROLES.ADMIN}".`,
      );
    }

    return role as BootstrapAdminRole;
  }
}
