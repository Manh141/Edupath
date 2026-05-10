"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminGuard({ children }: PropsWithChildren) {
  const { loading, isAuthenticated, currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const roles = currentUser?.roles ?? [];
  const isAdmin =
    roles.includes("admin") || currentUser?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(`/auth?next=${encodeURIComponent(pathname ?? "/admin")}`);
      return;
    }

    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground">Checking admin access...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
