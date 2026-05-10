import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @Get('health')
  getHealth() {
    return {
      service: process.env.APP_NAME ?? 'communication-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  @Get('ready')
  async getReadiness() {
    let databaseOk = false;
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      databaseOk = true;
    } catch {
      databaseOk = false;
    }
    const redis = await this.redisService.ping();

    return {
      service: process.env.APP_NAME ?? 'communication-service',
      status: databaseOk ? 'ready' : 'degraded',
      checks: {
        database: databaseOk,
        redisConfigured: Boolean(process.env.REDIS_URL),
        redisReachable: redis,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
