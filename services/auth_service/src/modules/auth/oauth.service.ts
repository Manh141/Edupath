import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AuthProvider,
  AuthStatus,
  Prisma,
} from '../../common/prisma/prisma-client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { DEFAULT_STUDENT_ROLE } from '../../common/constants/auth.constants';

type AuthAccountWithRelations = Prisma.AuthAccountGetPayload<{
  include: {
    role: true;
    accountRoles: {
      include: {
        role: true;
      };
    };
  };
}>;

@Injectable()
export class OAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async loginWithProvider(params: {
    provider: typeof AuthProvider.google | typeof AuthProvider.facebook;
    email: string;
    providerUserId: string;
  }): Promise<{ account: AuthAccountWithRelations; isNewAccount: boolean }> {
    const normalizedEmail = params.email.trim().toLowerCase();

    const existingOAuth = await this.prisma.oAuthProviderAccount.findFirst({
      where: {
        provider: params.provider,
        providerUserId: params.providerUserId,
      },
      include: {
        authAccount: {
          include: {
            role: true,
            accountRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (existingOAuth) {
      return {
        account: existingOAuth.authAccount,
        isNewAccount: false,
      };
    }

    let isNewAccount = false;
    let account = await this.prisma.authAccount.findUnique({
      where: { normalizedEmail },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!account) {
      const role = await this.prisma.role.findUnique({
        where: { name: DEFAULT_STUDENT_ROLE },
      });

      if (!role) {
        throw new BadRequestException(
          'The default student role is missing. Please seed roles first.',
        );
      }

      account = await this.prisma.authAccount.create({
        data: {
          email: normalizedEmail,
          normalizedEmail,
          roleId: role.id,
          provider: params.provider,
          status: AuthStatus.active,
          isEmailVerified: true,
          accountRoles: {
            create: {
              roleId: role.id,
            },
          },
        },
        include: {
          role: true,
          accountRoles: {
            include: {
              role: true,
            },
          },
        },
      });
      isNewAccount = true;
    }

    await this.prisma.oAuthProviderAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: params.provider,
          providerUserId: params.providerUserId,
        },
      },
      update: {
        providerEmail: normalizedEmail,
      },
      create: {
        authAccountId: account.id,
        provider: params.provider,
        providerUserId: params.providerUserId,
        providerEmail: normalizedEmail,
      },
    });
    return {
      account,
      isNewAccount,
    };
  }
}
