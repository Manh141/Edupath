import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EnvService } from '../../common/config/env.service';
import { AuthModule } from '../auth/auth.module';
import { ProxyAuthMiddleware } from '../../common/middleware/proxy-auth.middleware';
import { RequestIdMiddleware } from '../../common/middleware/request-id.middleware';
import { GatewayController } from './gateway.controller';
import { buildServiceProxy } from './proxy.factory';
import { ProxyRegistryService } from './proxy-registry.service';

@Module({
  imports: [AuthModule],
  controllers: [GatewayController],
  providers: [ProxyRegistryService, ProxyAuthMiddleware, RequestIdMiddleware],
  exports: [ProxyRegistryService],
})
export class GatewayModule implements NestModule {
  constructor(
    private readonly envService: EnvService,
    private readonly proxyRegistryService: ProxyRegistryService,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    const enabledServices = this.proxyRegistryService.getEnabledServices();

    for (const service of enabledServices) {
      const proxyHandler = buildServiceProxy({
        serviceName: service.name,
        target: service.target!,
        proxyTimeoutMs: this.envService.proxyTimeoutMs,
        authHeaderForwarding: this.envService.authHeaderForwarding,
      });

      consumer
        .apply(RequestIdMiddleware, ProxyAuthMiddleware, proxyHandler)
        .forRoutes(
          { path: service.routePrefix, method: RequestMethod.ALL },
          { path: `${service.routePrefix}/*`, method: RequestMethod.ALL },
        );
    }
  }
}
