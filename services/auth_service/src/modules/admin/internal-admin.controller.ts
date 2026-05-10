import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { PrismaService } from '../../common/prisma/prisma.service';
import { resolveSessionRoleNames } from '../../common/constants/role.constants';

interface RolesBatchBody {
  userIds?: unknown;
}

interface AccountRoleSummary {
  userId: string;
  roles: string[];
  primaryRole: string;
  authStatus: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
}

@ApiTags('Internal Admin')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/auth/accounts')
export class InternalAdminController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({
    summary:
      'Batch fetch role and account metadata for given user ids (internal)',
  })
  @Post('roles-batch')
  async getRolesBatch(
    @Body() body: RolesBatchBody,
  ): Promise<AccountRoleSummary[]> {
    const userIds = Array.isArray(body?.userIds)
      ? body.userIds.filter(
          (id): id is string => typeof id === 'string' && id.length > 0,
        )
      : [];

    if (userIds.length === 0) {
      return [];
    }

    const accounts = await this.prisma.authAccount.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        status: true,
        isEmailVerified: true,
        lastLoginAt: true,
        role: { select: { name: true } },
        accountRoles: { select: { role: { select: { name: true } } } },
      },
    });

    return accounts.map((account) => {
      const allRoleNames = new Set<string>();
      if (account.role?.name) {
        allRoleNames.add(account.role.name);
      }
      for (const accountRole of account.accountRoles) {
        if (accountRole.role?.name) {
          allRoleNames.add(accountRole.role.name);
        }
      }

      const expanded = resolveSessionRoleNames(allRoleNames);
      const primaryRole = expanded[0] ?? account.role?.name ?? 'student';

      return {
        userId: account.id,
        roles: expanded.length > 0 ? expanded : ['student'],
        primaryRole,
        authStatus: account.status,
        isEmailVerified: account.isEmailVerified,
        lastLoginAt: account.lastLoginAt
          ? account.lastLoginAt.toISOString()
          : null,
      };
    });
  }
}
