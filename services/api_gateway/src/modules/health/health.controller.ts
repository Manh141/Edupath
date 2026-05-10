import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ReadinessResponseDto } from '../../common/dto/readiness-response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Liveness endpoint for the gateway itself' })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness endpoint that pings enabled upstream services' })
  @ApiOkResponse({ type: ReadinessResponseDto })
  async getReadiness() {
    return this.healthService.getReadiness();
  }
}
