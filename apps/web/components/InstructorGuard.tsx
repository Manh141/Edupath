"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser, isInstructorUser } from "@/lib/auth-session";

function tokenHasInstructorRole(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return false;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(window.atob(padded)) as {
      role?: string;
      roles?: string[];
    };
    const roleSet = new Set(
      [decoded.role, ...(decoded.roles ?? [])]
        .filter(Boolean)
        .map((role) => role!.trim().toLowerCase()),
    );

    return roleSet.has("instructor");
  } catch {
    return false;
  }
}

export default function InstructorGuard({ children }: PropsWithChildren) {
  const {
    loading,
    isAuthenticated,
    currentUser,
    accessToken,
    activeRole,
    setActiveRole,
    refreshSession,
  } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = isAdminUser(currentUser);
  const canTeach = isInstructorUser(currentUser);
  const shouldExitInstructorMode =
    !loading &&
    isAuthenticated &&
    !isAdmin &&
    canTeach &&
    activeRole === "student";
  const shouldSyncInstructorMode =
    !loading &&
    isAuthenticated &&
    !isAdmin &&
    canTeach &&
    activeRole !== "instructor" &&
    activeRole !== "student";
  const accessTokenHasInstructorRole = tokenHasInstructorRole(accessToken);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/auth?next=${encodeURIComponent(pathname ?? "/instructor")}`);
      return;
    }

    if (isAdmin) {
      router.replace("/admin/overview");
      return;
    }

    if (!canTeach) {
      router.replace("/become-instructor");
      return;
    }

    if (activeRole === "student") {
      router.replace("/");
      return;
    }

    if (activeRole === "instructor") {
      return;
    }

    let cancelled = false;

    void (async () => {
      const ok = accessTokenHasInstructorRole ? true : await refreshSession();

      if (cancelled) {
        return;
      }

      if (!ok) {
        router.replace(`/auth?next=${encodeURIComponent(pathname ?? "/instructor")}`);
        return;
      }

      setActiveRole("instructor");
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeRole,
    canTeach,
    isAdmin,
    isAuthenticated,
    loading,
    pathname,
    refreshSession,
    router,
    setActiveRole,
    accessTokenHasInstructorRole,
  ]);

  if (loading || shouldSyncInstructorMode) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-muted-foreground">
          {shouldSyncInstructorMode
            ? "Syncing instructor session..."
            : "Checking instructor access..."}
        </span>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    isAdmin ||
    !canTeach ||
    shouldExitInstructorMode ||
    activeRole !== "instructor"
  ) {
    return null;
  }

  return <>{children}</>;
}
