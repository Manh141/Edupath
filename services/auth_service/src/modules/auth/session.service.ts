import { Injectable } from '@nestjs/common';
import {
  AuthSession,
  Prisma,
  SessionStatus,
} from '../../common/prisma/prisma-client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { TokenService } from './token.service';

type SessionWithAuthAccountAndRoles = Prisma.AuthSessionGetPayload<{
  include: {
    authAccount: {
      include: {
        role: true;
        accountRoles: {
          include: {
            role: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  createSession(params: {
    authAccountId: string;
    refreshToken: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    expiresAt: Date;
  }): Promise<AuthSession> {
    const refreshTokenHash = this.tokenService.hashToken(params.refreshToken);

    return this.prisma.authSession.create({
      data: {
        authAccountId: params.authAccountId,
        refreshTokenHash,
        userAgent: params.userAgent ?? null,
        ipAddress: params.ipAddress ?? null,
        expiresAt: params.expiresAt,
        status: SessionStatus.active,
      },
    });
  }

  findActiveSessionByRefreshToken(
    refreshToken: string,
  ): Promise<SessionWithAuthAccountAndRoles | null> {
    const refreshTokenHash = this.tokenService.hashToken(refreshToken);

    return this.prisma.authSession.findFirst({
      where: {
        refreshTokenHash,
        status: SessionStatus.active,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
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
  }

  async revokeSessionByRefreshToken(refreshToken: string): Promise<void> {
    const refreshTokenHash = this.tokenService.hashToken(refreshToken);

    await this.prisma.authSession.updateMany({
      where: {
        refreshTokenHash,
        status: SessionStatus.active,
      },
      data: {
        status: SessionStatus.revoked,
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllSessionsByAccountId(authAccountId: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: {
        authAccountId,
        status: SessionStatus.active,
      },
      data: {
        status: SessionStatus.revoked,
        revokedAt: new Date(),
      },
    });
  }

  async rotateSession(params: {
    oldRefreshToken: string;
    newRefreshToken: string;
    expiresAt: Date;
    userAgent?: string | null;
    ipAddress?: string | null;
  }): Promise<{
    session: AuthSession;
    authAccount: SessionWithAuthAccountAndRoles['authAccount'];
  } | null> {
    const session = await this.findActiveSessionByRefreshToken(
      params.oldRefreshToken,
    );

    if (!session) {
      return null;
    }

    await this.revokeSessionByRefreshToken(params.oldRefreshToken);

    const newSession = await this.createSession({
      authAccountId: session.authAccountId,
      refreshToken: params.newRefreshToken,
      expiresAt: params.expiresAt,
      userAgent: params.userAgent,
      ipAddress: params.ipAddress,
    });

    return {
      session: newSession,
      authAccount: session.authAccount,
    };
  }
}
