"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { ApiError, authApi } from "@/lib/auth-api";
import { resolveAuthenticatedPath } from "@/lib/auth-session";
import { useAuth } from "@/contexts/AuthContext";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function normalizeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completeLogin } = useAuth();
  const hasStarted = useRef(false);

  const code = searchParams.get("code");
  const requestedNext =
    searchParams.get("next") || searchParams.get("redirect");
  const nextPath = normalizeNextPath(
    requestedNext,
  );
  const initialError = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(
    Boolean(code) && !Boolean(initialError),
  );
  const [message, setMessage] = useState(
    initialError ||
      (code
        ? "Completing your social sign-in..."
        : "Missing OAuth exchange code."),
  );

  useEffect(() => {
    if (initialError || !code || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const run = async () => {
      try {
        const response = await authApi.exchangeOAuthCode({ code });
        await completeLogin(response);
        toast.success(response.message || "Signed in successfully.");
        const destination = resolveAuthenticatedPath(
          response.user,
          requestedNext,
          nextPath,
        );
        router.replace(destination);
      } catch (error) {
        const nextMessage = getErrorMessage(
          error,
          "Unable to complete social sign-in.",
        );
        setMessage(nextMessage);
        setIsLoading(false);
        toast.error(nextMessage);
      }
    };

    void run();
  }, [code, completeLogin, initialError, nextPath, requestedNext, router]);

  return (
    <div className="px-4 py-12">
      <div className="container mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-border bg-card p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
            {isLoading ? (
              <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
            ) : (
              <AlertCircle className="h-7 w-7 text-primary" />
            )}
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
            Social sign-in
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>

          {!isLoading ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
              >
                Back to auth
              </Link>
              <Link
                href={nextPath}
                className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Go to destination
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
