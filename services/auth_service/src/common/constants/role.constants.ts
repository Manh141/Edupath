export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

// Instructor retains learner capabilities, but admin stays admin-only.
export const ROLE_HIERARCHY: Record<RoleName, RoleName[]> = {
  admin: ['admin'],
  instructor: ['instructor', 'student'],
  student: ['student'],
};

const ROLE_PRIORITY: readonly RoleName[] = [
  ROLES.ADMIN,
  ROLES.INSTRUCTOR,
  ROLES.STUDENT,
];

const ROLE_NAME_SET = new Set<RoleName>(Object.values(ROLES));

export function isRoleName(value: string): value is RoleName {
  return ROLE_NAME_SET.has(value as RoleName);
}

export function expandRoleNames(roleNames: Iterable<string>): RoleName[] {
  const expanded = new Set<RoleName>();

  const visit = (roleName: string) => {
    if (!isRoleName(roleName) || expanded.has(roleName)) {
      return;
    }

    expanded.add(roleName);
    (ROLE_HIERARCHY[roleName] ?? []).forEach((inheritedRole) =>
      visit(inheritedRole),
    );
  };

  for (const roleName of roleNames) {
    visit(roleName);
  }

  return Array.from(expanded);
}

export function resolveSessionRoleNames(
  roleNames: Iterable<string>,
): RoleName[] {
  const expanded = new Set<RoleName>(expandRoleNames(roleNames));

  for (const roleName of ROLE_PRIORITY) {
    if (!expanded.has(roleName)) {
      continue;
    }

    switch (roleName) {
      case ROLES.ADMIN:
        return [ROLES.ADMIN];
      case ROLES.INSTRUCTOR:
        return [ROLES.INSTRUCTOR, ROLES.STUDENT];
      case ROLES.STUDENT:
        return [ROLES.STUDENT];
    }
  }

  return [];
}

export function resolveSessionPrimaryRole(
  roleNames: Iterable<string>,
  fallback: string = ROLES.STUDENT,
): RoleName {
  const [primaryRole] = resolveSessionRoleNames(roleNames);

  if (primaryRole) {
    return primaryRole;
  }

  return isRoleName(fallback) ? fallback : ROLES.STUDENT;
}
