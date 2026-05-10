import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppEnv } from './env.validation';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<AppEnv, true>) {}

  get appName(): string {
    return this.configService.get('APP_NAME', { infer: true });
  }

  get nodeEnv(): AppEnv['NODE_ENV'] {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get webOrigin(): string {
    return this.configService.get('WEB_ORIGIN', { infer: true });
  }

  get logLevel(): AppEnv['LOG_LEVEL'] {
    return this.configService.get('LOG_LEVEL', { infer: true });
  }

  get swaggerEnabled(): boolean {
    return this.configService.get('SWAGGER_ENABLED', { infer: true });
  }

  get swaggerPath(): string {
    return this.configService.get('SWAGGER_PATH', { infer: true });
  }

  get proxyTimeoutMs(): number {
    return this.configService.get('PROXY_TIMEOUT_MS', { infer: true });
  }

  get authHeaderForwarding(): boolean {
    return this.configService.get('AUTH_HEADER_FORWARDING', { infer: true });
  }

  get jwtAccessSecret(): string {
    return this.configService.get('JWT_ACCESS_SECRET', { infer: true });
  }

  get jwtAccessAudience(): string | undefined {
    return this.configService.get('JWT_ACCESS_AUDIENCE', { infer: true });
  }

  get jwtAccessIssuer(): string | undefined {
    return this.configService.get('JWT_ACCESS_ISSUER', { infer: true });
  }

  get throttleTtlMs(): number {
    return this.configService.get('THROTTLE_TTL_MS', { infer: true });
  }

  get throttleLimit(): number {
    return this.configService.get('THROTTLE_LIMIT', { infer: true });
  }

  get readinessTimeoutMs(): number {
    return this.configService.get('READINESS_TIMEOUT_MS', { infer: true });
  }

  get authServiceUrl(): string {
    return this.configService.get('AUTH_SERVICE_URL', { infer: true });
  }

  get userServiceUrl(): string | undefined {
    return this.configService.get('USER_SERVICE_URL', { infer: true });
  }

  get courseServiceUrl(): string | undefined {
    return this.configService.get('COURSE_SERVICE_URL', { infer: true });
  }

  get enrollmentServiceUrl(): string | undefined {
    return this.configService.get('ENROLLMENT_SERVICE_URL', { infer: true });
  }

  get paymentServiceUrl(): string | undefined {
    return this.configService.get('PAYMENT_SERVICE_URL', { infer: true });
  }

  get communicationServiceUrl(): string | undefined {
    return this.configService.get('COMMUNICATION_SERVICE_URL', { infer: true });
  }
}
