import { Injectable } from '@nestjs/common';
import { EnvService } from '../../common/config/env.service';
import type { ProxyServiceDefinition } from './proxy.types';

@Injectable()
export class ProxyRegistryService {
  constructor(private readonly envService: EnvService) {}

  getServices(): ProxyServiceDefinition[] {
    return [
      {
        name: 'auth-service',
        target: this.envService.authServiceUrl,
        routePrefix: 'api/auth',
      },
      {
        name: 'user-service',
        target: this.envService.userServiceUrl,
        routePrefix: 'api/users',
      },
      {
        name: 'user-service',
        target: this.envService.userServiceUrl,
        routePrefix: 'api/admin/users',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/categories',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/courses',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/instructor/monetization',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/instructor/performance',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/instructor/communication',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/instructor',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/admin/courses',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/admin/reviews',
      },
      {
        name: 'course-service',
        target: this.envService.courseServiceUrl,
        routePrefix: 'api/internal/courses',
      },
      {
        name: 'enrollment-service',
        target: this.envService.enrollmentServiceUrl,
        routePrefix: 'api/my/enrollments',
      },
      {
        name: 'enrollment-service',
        target: this.envService.enrollmentServiceUrl,
        routePrefix: 'api/my/wishlist',
      },
      {
        name: 'enrollment-service',
        target: this.envService.enrollmentServiceUrl,
        routePrefix: 'api/admin/enrollments',
      },
      {
        name: 'enrollment-service',
        target: this.envService.enrollmentServiceUrl,
        routePrefix: 'api/internal/enrollments',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/carts',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/orders',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/admin/monetization',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/admin/orders',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/payments',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/coupons',
      },
      {
        name: 'payment-service',
        target: this.envService.paymentServiceUrl,
        routePrefix: 'api/internal/payments',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'socket.io',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/conversations',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/discussions',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/reviews',
      },
      {
        name: 'communication-service',
        target: this.envService.communicationServiceUrl,
        routePrefix: 'api/admin/communication',
      },
    ];
  }

  getEnabledServices(): ProxyServiceDefinition[] {
    return this.getServices().filter((service) => Boolean(service.target));
  }

  getUniqueUpstreams(): ProxyServiceDefinition[] {
    const seen = new Set<string>();
    return this.getEnabledServices().filter((service) => {
      const key = `${service.name}:${service.target}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
