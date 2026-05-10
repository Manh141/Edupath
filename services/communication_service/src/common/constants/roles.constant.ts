export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];

export function hasRole(payload: { role?: string; roles?: string[] }, role: string): boolean {
  if (payload.role === role) return true;
  return Array.isArray(payload.roles) && payload.roles.includes(role);
}

export function hasAnyRole(
  payload: { role?: string; roles?: string[] },
  roles: string[],
): boolean {
  return roles.some((role) => hasRole(payload, role));
}
