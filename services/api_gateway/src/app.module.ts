import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { EnvModule } from './common/config/env.module';
import { EnvService } from './common/config/env.service';
import { createPinoConfig } from './common/logger/pino.config';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';

@Module({
  imports: [
    EnvModule,
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        createPinoConfig(envService.isProduction, envService.logLevel),
    }),
    ThrottlerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => [
        {
          ttl: envService.throttleTtlMs,
          limit: envService.throttleLimit,
        },
      ],
    }),
    AuthModule,
    GatewayModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
