export const Roles = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export type RoleValue = (typeof Roles)[keyof typeof Roles];
