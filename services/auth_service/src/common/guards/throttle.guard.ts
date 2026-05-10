import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RedisService } from '../redis/redis.service';
import { CACHE_KEYS } from '../constants/cache.constants';

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const ttl = this.configService.get<number>('THROTTLE_TTL', 60);
    const limit = this.configService.get<number>('THROTTLE_LIMIT', 10);

    const ip = request.ip || 'unknown';
    const route = (request as unknown as { route?: { path?: string } }).route;
    const routePath =
      typeof route?.path === 'string' ? route.path : request.url;
    const key = `${CACHE_KEYS.RATE_LIMIT}:${ip}:${routePath}`;

    const count = await this.redisService.increment(key, ttl);

    if (count > limit) {
      throw new HttpException(
        {
          message: 'Too many requests',
          error: 'Rate Limit Exceeded',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
