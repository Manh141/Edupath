import type { AuthUserSummary, CurrentUser } from "@/types/auth";

export type ActiveRole = "student" | "instructor" | "admin";

type RoleAwareUser =
  | Pick<AuthUserSummary, "role" | "roles">
  | Pick<CurrentUser, "role" | "roles">
  | null
  | undefined;

export const ADMIN_HOME = "/admin/overview";
export const INSTRUCTOR_HOME = "/instructor";
export const STUDENT_HOME = "/dashboard";

function normalizeRole(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}

export function getRoleSet(user: RoleAwareUser): Set<string> {
  const roles = new Set<string>();
  const primaryRole = normalizeRole(user?.role);

  if (primaryRole) {
    roles.add(primaryRole);
  }

  for (const role of user?.roles ?? []) {
    const normalizedRole = normalizeRole(role);
    if (normalizedRole) {
      roles.add(normalizedRole);
    }
  }

  return roles;
}

export function isAdminUser(user: RoleAwareUser): boolean {
  return getRoleSet(user).has("admin");
}

export function isInstructorUser(user: RoleAwareUser): boolean {
  return getRoleSet(user).has("instructor");
}

export function deriveActiveRole(
  user: RoleAwareUser,
  stored: ActiveRole | null,
): ActiveRole {
  if (isAdminUser(user)) {
    return "admin";
  }

  const roles = getRoleSet(user);

  if (stored && stored !== "admin" && roles.has(stored)) {
    return stored;
  }

  return roles.has("instructor") ? "instructor" : "student";
}

export function isSafeInternalPath(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export function getDefaultAuthenticatedPath(user: RoleAwareUser): string {
  if (isAdminUser(user)) {
    return ADMIN_HOME;
  }

  if (isInstructorUser(user)) {
    return INSTRUCTOR_HOME;
  }

  return STUDENT_HOME;
}

export function canAccessPostLoginPath(
  user: RoleAwareUser,
  path: string | null | undefined,
): boolean {
  if (!isSafeInternalPath(path)) {
    return false;
  }

  const isAdminPath = path === "/admin" || path.startsWith("/admin/");

  if (isAdminUser(user)) {
    return isAdminPath;
  }

  return !isAdminPath;
}

export function resolveAuthenticatedPath(
  user: RoleAwareUser,
  requestedNext: string | null | undefined,
  fallback?: string | null,
): string {
  if (canAccessPostLoginPath(user, requestedNext)) {
    return requestedNext!;
  }

  if (canAccessPostLoginPath(user, fallback)) {
    return fallback!;
  }

  return getDefaultAuthenticatedPath(user);
}
