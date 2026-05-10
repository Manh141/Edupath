import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthStatus } from '../../common/prisma/prisma-client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { CACHE_KEYS } from '../../common/constants/cache.constants';
import {
  resolveSessionPrimaryRole,
  resolveSessionRoleNames,
} from '../../common/constants/role.constants';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
      issuer: configService.get<string>('JWT_ACCESS_ISSUER') || undefined,
      audience: configService.get<string>('JWT_ACCESS_AUDIENCE') || undefined,
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserData> {
    const isBlacklisted = await this.redisService.exists(
      `${CACHE_KEYS.ACCESS_BLACKLIST}:${payload.jti}`,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException('The access token has been revoked.');
    }

    const authAccount = await this.prisma.authAccount.findUnique({
      where: { id: payload.sub },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!authAccount) {
      throw new UnauthorizedException('The user account does not exist.');
    }

    if (
      authAccount.status === AuthStatus.suspended ||
      authAccount.status === AuthStatus.disabled
    ) {
      throw new UnauthorizedException('The user account is invalid.');
    }

    const assignedRoles = new Set<string>();

    if (authAccount.role?.name) {
      assignedRoles.add(authAccount.role.name);
    }

    authAccount.accountRoles.forEach((membership) =>
      assignedRoles.add(membership.role.name),
    );

    const sessionRoles = resolveSessionRoleNames(assignedRoles);
    const sessionRole = resolveSessionPrimaryRole(
      sessionRoles,
      authAccount.role.name,
    );

    return {
      userId: authAccount.id,
      email: authAccount.email,
      role: sessionRole,
      roles: sessionRoles,
      jti: payload.jti,
      sessionId: payload.sid,
    };
  }
}
