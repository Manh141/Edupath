export const INTERNAL_HEADERS = {
  internalSecret: 'x-internal-service-secret',
  requestId: 'x-request-id',
  authVerified: 'x-auth-verified',
  authUserId: 'x-auth-user-id',
  authEmail: 'x-auth-email',
  authRole: 'x-auth-role',
  authRoles: 'x-auth-roles',
  authSessionId: 'x-auth-session-id',
} as const;
