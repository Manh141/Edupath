import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const configuredSecret = this.configService
      .get<string>('INTERNAL_SERVICE_SECRET')
      ?.trim();
    const providedSecret = request.header('x-internal-service-secret')?.trim();

    if (!configuredSecret) {
      throw new UnauthorizedException(
        'Internal service secret is not configured',
      );
    }

    if (!providedSecret || providedSecret !== configuredSecret) {
      throw new UnauthorizedException('Invalid internal service credentials');
    }

    return true;
  }
}
