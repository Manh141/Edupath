export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
