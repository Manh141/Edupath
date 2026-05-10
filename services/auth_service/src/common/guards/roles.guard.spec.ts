import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../constants/role.constants';
import { RolesGuard } from './roles.guard';

function createExecutionContext(user?: { role?: string; roles?: string[] }) {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as never;
}

describe('RolesGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('allows admin to access an admin route', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.ADMIN]);

    const allowed = guard.canActivate(
      createExecutionContext({ role: ROLES.ADMIN, roles: [ROLES.ADMIN] }),
    );

    expect(allowed).toBe(true);
  });

  it('allows instructor to access an instructor route', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.INSTRUCTOR]);

    const allowed = guard.canActivate(
      createExecutionContext({
        role: ROLES.INSTRUCTOR,
        roles: [ROLES.INSTRUCTOR, ROLES.STUDENT],
      }),
    );

    expect(allowed).toBe(true);
  });

  it('denies a student from accessing an admin route', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.ADMIN]);

    expect(() =>
      guard.canActivate(
        createExecutionContext({ role: ROLES.STUDENT, roles: [ROLES.STUDENT] }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('handles users with multiple roles correctly', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.INSTRUCTOR]);

    const allowed = guard.canActivate(
      createExecutionContext({
        role: ROLES.STUDENT,
        roles: [ROLES.STUDENT, ROLES.INSTRUCTOR],
      }),
    );

    expect(allowed).toBe(true);
  });

  it('denies access when the request has no user', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.ADMIN]);

    expect(() => guard.canActivate(createExecutionContext())).toThrow(
      ForbiddenException,
    );
  });

  it('denies access when the user does not have a required role', () => {
    reflector.getAllAndOverride.mockReturnValue([ROLES.INSTRUCTOR]);

    expect(() =>
      guard.canActivate(
        createExecutionContext({ role: ROLES.STUDENT, roles: [ROLES.STUDENT] }),
      ),
    ).toThrow(ForbiddenException);
  });
});
