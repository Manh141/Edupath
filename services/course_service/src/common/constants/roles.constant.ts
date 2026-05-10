export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];
