import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLE_HIERARCHY, type RoleName } from '../constants/role.constants';

interface AuthenticatedRequest {
  user?: { role?: string; roles?: string[] };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const userRoles = new Set<RoleName>();

    if (user?.role) {
      userRoles.add(user.role as RoleName);
    }

    if (Array.isArray(user?.roles)) {
      (user.roles as RoleName[]).forEach((r) => userRoles.add(r));
    }

    if (userRoles.size === 0) {
      throw new ForbiddenException('You do not have access.');
    }

    // Check hierarchy: an admin satisfies an instructor-required route
    const hasAccess = requiredRoles.some((required) =>
      [...userRoles].some((userRole) =>
        ROLE_HIERARCHY[userRole]?.includes(required),
      ),
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access.');
    }

    return true;
  }
}
