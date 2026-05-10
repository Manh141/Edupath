import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import {
  AuditAction,
  AuthProvider,
  AuthStatus,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditLogService } from '../../common/audit/audit-log.service';
import { ROLES } from '../../common/constants/role.constants';
import {
  AdminAccountsConfig,
  type BootstrapAdminAccount,
} from './admin-accounts.config';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly adminAccountsConfig: AdminAccountsConfig,
    private readonly configService: ConfigService,
  ) {}

  private async syncUserProfile(input: {
    id: string;
    email: string;
    fullName: string;
  }): Promise<void> {
    const userServiceUrl = this.configService
      .get<string>('USER_SERVICE_URL')
      ?.trim();
    const internalServiceSecret = this.configService
      .get<string>('INTERNAL_SERVICE_SECRET')
      ?.trim();

    if (!userServiceUrl || !internalServiceSecret) {
      return;
    }

    try {
      const response = await fetch(
        `${userServiceUrl.replace(/\/$/, '')}/api/users/internal/create-from-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-service-secret': internalServiceSecret,
            'x-internal-service-name': 'auth-service',
          },
          body: JSON.stringify(input),
        },
      );

      if (response.ok || response.status === 409) {
        return;
      }

      const text = await response.text();
      this.logger.warn(
        `Admin bootstrap profile sync failed for ${input.email}. status=${response.status} body=${text}`,
      );
    } catch (error) {
      this.logger.warn(
        `Admin bootstrap profile sync failed for ${input.email}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.bootstrapAdminAccounts();
  }

  async bootstrapAdminAccounts(): Promise<void> {
    const accounts = this.adminAccountsConfig.getAccounts();

    await this.ensureSystemRoles();

    if (accounts.length === 0) {
      this.logger.warn(
        'ADMIN_ACCOUNTS_JSON is empty - no fixed admin accounts were bootstrapped.',
      );
      return;
    }

    let created = 0;
    let updated = 0;
    let unchanged = 0;

    for (const account of accounts) {
      const result = await this.upsertAdminAccount(account);

      if (result === 'created') created++;
      if (result === 'updated') updated++;
      if (result === 'unchanged') unchanged++;
    }

    this.logger.log(
      `Admin bootstrap complete - created: ${created}, updated: ${updated}, unchanged: ${unchanged}`,
    );
  }

  private async ensureSystemRoles(): Promise<void> {
    const roles = [
      {
        name: ROLES.STUDENT,
        description: 'Default role for learners',
      },
      {
        name: ROLES.INSTRUCTOR,
        description: 'Role for course creators',
      },
      {
        name: ROLES.ADMIN,
        description: 'Platform administrator',
      },
    ];

    for (const role of roles) {
      await this.prisma.role.upsert({
        where: { name: role.name },
        create: role,
        update: { description: role.description },
      });
    }
  }

  private async upsertAdminAccount(
    seed: BootstrapAdminAccount,
  ): Promise<'created' | 'updated' | 'unchanged'> {
    const targetRole = await this.prisma.role.findUniqueOrThrow({
      where: { name: seed.role },
    });

    const existing = await this.prisma.authAccount.findUnique({
      where: { normalizedEmail: seed.normalizedEmail },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existing) {
      const passwordHash = await bcrypt.hash(seed.password, BCRYPT_ROUNDS);
      const account = await this.prisma.authAccount.create({
        data: {
          email: seed.email,
          normalizedEmail: seed.normalizedEmail,
          passwordHash,
          forcePasswordChange: seed.forcePasswordChange,
          roleId: targetRole.id,
          provider: AuthProvider.local,
          status: AuthStatus.active,
          isEmailVerified: true,
          accountRoles: {
            create: {
              roleId: targetRole.id,
              assignedByAuthAccountId: null,
            },
          },
        },
      });

      await this.auditLog.log({
        action: AuditAction.ADMIN_BOOTSTRAP,
        targetId: account.id,
        targetEmail: account.email,
        metadata: {
          source: 'env:ADMIN_ACCOUNTS_JSON',
          role: seed.role,
          created: true,
          forcePasswordChange: seed.forcePasswordChange,
        },
      });

      await this.syncUserProfile({
        id: account.id,
        email: account.email,
        fullName: account.email.split('@')[0] ?? account.email,
      });

      this.logger.log(`Bootstrap: created ${seed.role} ${seed.email}`);
      return 'created';
    }

    let changed = false;
    const updateData: {
      passwordHash?: string;
      roleId?: number;
      provider?: AuthProvider;
      status?: AuthStatus;
      isEmailVerified?: boolean;
      forcePasswordChange?: boolean;
    } = {};

    const passwordMatches =
      typeof existing.passwordHash === 'string' &&
      existing.passwordHash.length > 0
        ? await bcrypt.compare(seed.password, existing.passwordHash)
        : false;

    if (!passwordMatches) {
      updateData.passwordHash = await bcrypt.hash(seed.password, BCRYPT_ROUNDS);
      updateData.forcePasswordChange = true;
      changed = true;
    }

    if (existing.roleId !== targetRole.id) {
      updateData.roleId = targetRole.id;
      changed = true;
    }

    if (existing.provider !== AuthProvider.local) {
      updateData.provider = AuthProvider.local;
      changed = true;
    }

    if (existing.status !== AuthStatus.active) {
      updateData.status = AuthStatus.active;
      changed = true;
    }

    if (!existing.isEmailVerified) {
      updateData.isEmailVerified = true;
      changed = true;
    }

    const hasTargetRole = existing.accountRoles.some(
      (membership) => membership.role.name === seed.role,
    );

    if (!hasTargetRole) {
      await this.prisma.authAccountRole.create({
        data: {
          authAccountId: existing.id,
          roleId: targetRole.id,
          assignedByAuthAccountId: null,
        },
      });
      changed = true;
    }

    if (changed) {
      if (Object.keys(updateData).length > 0) {
        await this.prisma.authAccount.update({
          where: { id: existing.id },
          data: updateData,
        });
      }

      await this.auditLog.log({
        action: AuditAction.ADMIN_BOOTSTRAP,
        targetId: existing.id,
        targetEmail: existing.email,
        metadata: {
          source: 'env:ADMIN_ACCOUNTS_JSON',
          role: seed.role,
          created: false,
          passwordRotated: !passwordMatches,
        },
      });

      await this.syncUserProfile({
        id: existing.id,
        email: existing.email,
        fullName: existing.email.split('@')[0] ?? existing.email,
      });

      this.logger.log(`Bootstrap: updated ${seed.role} ${seed.email}`);
      return 'updated';
    }

    await this.syncUserProfile({
      id: existing.id,
      email: existing.email,
      fullName: existing.email.split('@')[0] ?? existing.email,
    });

    return 'unchanged';
  }
}
