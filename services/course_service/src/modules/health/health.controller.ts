import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { MinioService } from '../../common/storage/minio.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly storageService: MinioService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @Get('health')
  getHealth() {
    return {
      service: process.env.APP_NAME ?? 'course-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  @Get('ready')
  async getReadiness() {
    await this.prisma.$queryRawUnsafe('SELECT 1');
    const redis = await this.redisService.ping();

    return {
      service: process.env.APP_NAME ?? 'course-service',
      status: 'ready',
      checks: {
        database: true,
        redisConfigured: Boolean(process.env.REDIS_URL),
        redisReachable: redis,
        objectStorageConfigured: this.storageService.isConfigured(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
