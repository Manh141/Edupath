import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../../common/config/env.service';
import type { AuthContext } from '../../common/interfaces/auth-context.interface';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtAccessSecret,
      issuer: envService.jwtAccessIssuer,
      audience: envService.jwtAccessAudience,
    });
  }

  validate(payload: JwtPayload): AuthContext {
    const roles = Array.isArray(payload.roles)
      ? payload.roles
      : payload.role
        ? [payload.role]
        : [];

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      roles,
      sessionId: payload.sid,
      issuer: payload.iss,
      audience: payload.aud,
    };
  }
}
