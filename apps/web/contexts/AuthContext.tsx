"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authApi } from "@/lib/auth-api";
import { deriveActiveRole, type ActiveRole } from "@/lib/auth-session";
import {
  clearActiveRole,
  clearTokens,
  readAccessToken,
  readActiveRole,
  readRefreshToken,
  writeActiveRole,
  writeTokens,
} from "@/lib/token-storage";
import type {
  AuthenticatedResponse,
  CurrentUser,
  RefreshResponse,
} from "@/types/auth";

export type { ActiveRole } from "@/lib/auth-session";

type LoginPayload = AuthenticatedResponse | RefreshResponse;

const ACCESS_TOKEN_EXPIRY_SKEW_SECONDS = 30;

interface AuthContextType {
  currentUser: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  activeRole: ActiveRole | null;
  setActiveRole: (role: ActiveRole) => void;
  completeLogin: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  isAuthenticated: false,
  activeRole: null,
  setActiveRole: () => {},
  completeLogin: async () => {},
  signOut: async () => {},
  refreshSession: async () => false,
});

export const useAuth = () => useContext(AuthContext);

function decodeJwtPayload(token: string): { exp?: unknown } | null {
  const [, payload] = token.split(".");

  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(window.atob(padded)) as { exp?: unknown };
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (typeof payload?.exp !== "number") {
    return false;
  }

  const expiresAtMs = payload.exp * 1000;
  const refreshBeforeMs = ACCESS_TOKEN_EXPIRY_SKEW_SECONDS * 1000;

  return expiresAtMs <= Date.now() + refreshBeforeMs;
}

function getAccessTokenRefreshDelayMs(token: string): number | null {
  const payload = decodeJwtPayload(token);

  if (typeof payload?.exp !== "number") {
    return null;
  }

  const expiresAtMs = payload.exp * 1000;
  const refreshBeforeMs = ACCESS_TOKEN_EXPIRY_SKEW_SECONDS * 1000;

  return Math.max(expiresAtMs - Date.now() - refreshBeforeMs, 0);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [activeRole, setActiveRoleState] = useState<ActiveRole | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  const clearSession = useCallback(() => {
    clearTokens();
    clearActiveRole();
    setAccessToken(null);
    setRefreshToken(null);
    setCurrentUser(null);
    setActiveRoleState(null);
  }, []);

  const syncUser = useCallback(async (token: string) => {
    const me = await authApi.getMe(token);
    setCurrentUser(me);
    return me;
  }, []);

  const setActiveRole = useCallback((role: ActiveRole) => {
    writeActiveRole(role);
    setActiveRoleState(role);
  }, []);

  const completeLogin = useCallback(
    async (payload: LoginPayload) => {
      writeTokens(payload.accessToken, payload.refreshToken);
      setAccessToken(payload.accessToken);
      setRefreshToken(payload.refreshToken);
      const me = await syncUser(payload.accessToken);
      const stored = readActiveRole();
      const resolved = deriveActiveRole(me, stored);
      writeActiveRole(resolved);
      setActiveRoleState(resolved);
    },
    [syncUser],
  );

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshAttempt = (async () => {
      const storedRefreshToken = readRefreshToken();

      if (!storedRefreshToken) {
        clearSession();
        return false;
      }

      try {
        const response = await authApi.refresh(storedRefreshToken);
        await completeLogin(response);
        return true;
      } catch {
        clearSession();
        return false;
      }
    })();

    refreshPromiseRef.current = refreshAttempt;

    try {
      return await refreshAttempt;
    } finally {
      if (refreshPromiseRef.current === refreshAttempt) {
        refreshPromiseRef.current = null;
      }
    }
  }, [clearSession, completeLogin]);

  const signOut = useCallback(async () => {
    const storedAccessToken = accessToken ?? readAccessToken();
    const storedRefreshToken = refreshToken ?? readRefreshToken();

    try {
      if (storedAccessToken && storedRefreshToken) {
        await authApi.logout(storedRefreshToken, storedAccessToken);
      }
    } catch {
      // Ignore logout API errors so the client can always clear the local session.
    } finally {
      clearSession();
    }
  }, [accessToken, clearSession, refreshToken]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);

      // Restore active role from storage early (before async work)
      const storedRole = readActiveRole();
      if (storedRole) setActiveRoleState(storedRole);

      const storedAccessToken = readAccessToken();
      const storedRefreshToken = readRefreshToken();

      if (!storedAccessToken && !storedRefreshToken) {
        clearSession();
        setLoading(false);
        return;
      }

      if (storedAccessToken && !isAccessTokenExpired(storedAccessToken)) {
        try {
          setAccessToken(storedAccessToken);
          if (storedRefreshToken) setRefreshToken(storedRefreshToken);
          const me = await syncUser(storedAccessToken);
          const resolved = deriveActiveRole(me, storedRole);
          writeActiveRole(resolved);
          setActiveRoleState(resolved);
          setLoading(false);
          return;
        } catch {
          // Fall through to refresh when the access token is no longer valid.
        }
      }

      await refreshSession();
      setLoading(false);
    };

    void bootstrap();
  }, [clearSession, refreshSession, syncUser]);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return;
    }

    const refreshDelayMs = getAccessTokenRefreshDelayMs(accessToken);

    if (refreshDelayMs === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void refreshSession();
    }, refreshDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [accessToken, refreshSession, refreshToken]);

  useEffect(() => {
    if (!refreshToken) {
      return;
    }

    const refreshIfNeeded = () => {
      const storedAccessToken = readAccessToken();

      if (!storedAccessToken) {
        void refreshSession();
        return;
      }

      if (isAccessTokenExpired(storedAccessToken)) {
        void refreshSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshIfNeeded();
      }
    };

    window.addEventListener("focus", refreshIfNeeded);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshIfNeeded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshSession, refreshToken]);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      accessToken,
      refreshToken,
      loading,
      isAuthenticated: Boolean(accessToken && currentUser),
      activeRole,
      setActiveRole,
      completeLogin,
      signOut,
      refreshSession,
    }),
    [
      accessToken,
      activeRole,
      completeLogin,
      currentUser,
      loading,
      refreshSession,
      refreshToken,
      setActiveRole,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
