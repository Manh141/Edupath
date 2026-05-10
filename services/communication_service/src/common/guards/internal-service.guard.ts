import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { INTERNAL_HEADERS } from '../constants/internal-headers.constant';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.configService.get<string>('INTERNAL_SERVICE_SECRET');
    if (!expected) {
      throw new ForbiddenException('Internal service guard is not configured.');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided =
      request.headers[INTERNAL_HEADERS.internalSecret] ??
      request.headers[INTERNAL_HEADERS.internalSecret.toUpperCase()];

    const value = Array.isArray(provided) ? provided[0] : provided;
    if (!value || value !== expected) {
      throw new ForbiddenException('Invalid internal service secret.');
    }

    return true;
  }
}
