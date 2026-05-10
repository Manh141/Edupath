import type { ActiveRole } from "@/lib/auth-session";

const ACCESS_TOKEN_KEY = "edupath.accessToken";
const REFRESH_TOKEN_KEY = "edupath.refreshToken";
const ACTIVE_ROLE_KEY = "edupath.activeRole";

function hasWindow() {
  return typeof window !== "undefined";
}

export function readAccessToken(): string | null {
  if (!hasWindow()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function readRefreshToken(): string | null {
  if (!hasWindow()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function writeTokens(accessToken: string, refreshToken: string): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function readActiveRole(): ActiveRole | null {
  if (!hasWindow()) return null;
  const value = window.localStorage.getItem(ACTIVE_ROLE_KEY);
  return value === "student" || value === "instructor" || value === "admin"
    ? value
    : null;
}

export function writeActiveRole(role: ActiveRole): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(ACTIVE_ROLE_KEY, role);
}

export function clearActiveRole(): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(ACTIVE_ROLE_KEY);
}
