import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'enrollment-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  @Get('ready')
  getReadiness() {
    return {
      status: 'ready',
      service: 'enrollment-service',
      timestamp: new Date().toISOString(),
    };
  }
}
