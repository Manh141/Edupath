import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [HttpModule, GatewayModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
