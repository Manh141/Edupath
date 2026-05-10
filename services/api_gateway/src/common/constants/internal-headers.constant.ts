export const INTERNAL_HEADERS = {
  gatewayService: 'x-gateway-service',
  requestId: 'x-request-id',
  authVerified: 'x-auth-verified',
  authUserId: 'x-auth-user-id',
  authEmail: 'x-auth-user-email',
  authRole: 'x-auth-user-role',
  authRoles: 'x-auth-user-roles',
  authSessionId: 'x-auth-session-id',
} as const;

export const SPOOFABLE_AUTH_HEADERS = [
  INTERNAL_HEADERS.authVerified,
  INTERNAL_HEADERS.authUserId,
  INTERNAL_HEADERS.authEmail,
  INTERNAL_HEADERS.authRole,
  INTERNAL_HEADERS.authRoles,
  INTERNAL_HEADERS.authSessionId,
] as const;
