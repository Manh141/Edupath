import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EnvService } from '../../common/config/env.service';
import { ProxyRegistryService } from '../gateway/proxy-registry.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
    private readonly proxyRegistryService: ProxyRegistryService,
  ) {}

  getHealth() {
    return {
      success: true,
      data: {
        service: this.envService.appName,
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: this.envService.nodeEnv,
      },
    };
  }

  async getReadiness() {
    const dependencies = await Promise.all(
      this.proxyRegistryService.getUniqueUpstreams().map(async (service) => {
        if (!service.target) {
          return {
            name: service.name,
            url: 'disabled',
            status: 'disabled' as const,
          };
        }

        const startedAt = Date.now();

        try {
          await firstValueFrom(
            this.httpService.get(`${service.target}/api/health`, {
              timeout: this.envService.readinessTimeoutMs,
            }),
          );

          return {
            name: service.name,
            url: service.target,
            status: 'up' as const,
            latencyMs: Date.now() - startedAt,
          };
        } catch (error) {
          return {
            name: service.name,
            url: service.target,
            status: 'down' as const,
            latencyMs: Date.now() - startedAt,
            message: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }),
    );

    const status = dependencies.some((dependency) => dependency.status === 'down')
      ? 'degraded'
      : 'ok';

    return {
      success: status === 'ok',
      data: {
        service: this.envService.appName,
        status,
        timestamp: new Date().toISOString(),
        dependencies,
      },
    };
  }
}
