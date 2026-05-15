"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ApiError, authApi } from "@/lib/auth-api";
import { resolveAuthenticatedPath } from "@/lib/auth-session";
import { enableFacebookLogin } from "@/lib/feature-flags";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  LoginChallengeResponse,
  RegisterResponse,
  RegisterVerificationResponse,
  SocialAuthProvider,
} from "@/types/auth";

type AuthTab = "login" | "signup";
export type AuthPageRole = "student" | "instructor";

interface AuthPageProps {
  role?: AuthPageRole;
}

const ROLE_COPY: Record<
  AuthPageRole,
  {
    heading: string;
    subtitle: string;
    requestedRole: "student" | "instructor";
    fallbackNext: string;
    loginTabUrl: string;
  }
> = {
  student: {
    heading: "Become a student",
    subtitle:
      "Log in or create a student account to start learning on EduPath.",
    requestedRole: "student",
    fallbackNext: "/dashboard",
    loginTabUrl: "/auth?tab=login",
  },
  instructor: {
    heading: "Become an instructor",
    subtitle:
      "Log in or create an instructor account to share your knowledge on EduPath.",
    requestedRole: "instructor",
    fallbackNext: "/become-instructor",
    loginTabUrl: "/auth/instructor?tab=login",
  },
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function isSignupTab(value: string | null): boolean {
  return value === "signup" || value === "register";
}

function normalizeNextPath(value: string | null, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function ChallengeCard({
  challenge,
  title,
}: {
  challenge: LoginChallengeResponse | RegisterResponse;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-muted-foreground">{challenge.message}</p>
      {challenge.email ? (
        <p className="mt-2 text-muted-foreground">Email: {challenge.email}</p>
      ) : null}
      <p className="text-muted-foreground">
        Expires in {challenge.expiresInMinutes} minutes.
      </p>
      {challenge.requestedRole ? (
        <p className="text-muted-foreground">
          Requested role: {challenge.requestedRole}
        </p>
      ) : null}
      {challenge._devCode ? (
        <div className="mt-3 rounded-xl border border-dashed border-border bg-background/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Development OTP
          </p>
          <p className="mt-2 font-mono text-lg font-semibold tracking-[0.35em] text-foreground">
            {challenge._devCode}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SocialButton({
  provider,
  onClick,
}: {
  provider: SocialAuthProvider;
  onClick: (provider: SocialAuthProvider) => void;
}) {
  const label =
    provider === "google" ? "Continue with Google" : "Continue with Facebook";

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-between"
      onClick={() => onClick(provider)}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}

export default function AuthPage({ role = "student" }: AuthPageProps) {
  const copy = ROLE_COPY[role];
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completeLogin } = useAuth();
  const requestedNext =
    searchParams.get("next") || searchParams.get("redirect");
  const nextPath = normalizeNextPath(requestedNext, copy.fallbackNext);

  const [tab, setTab] = useState<AuthTab>(
    isSignupTab(searchParams.get("tab")) ? "signup" : "login",
  );

  useEffect(() => {
    setTab(isSignupTab(searchParams.get("tab")) ? "signup" : "login");
  }, [searchParams]);

  const googleAuthorizeUrl = useMemo(
    () => authApi.getSocialAuthorizeUrl("google", nextPath),
    [nextPath],
  );
  const facebookAuthorizeUrl = useMemo(() => {
    if (!enableFacebookLogin) {
      return "";
    }

    return authApi.getSocialAuthorizeUrl("facebook", nextPath);
  }, [nextPath]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [loginChallenge, setLoginChallenge] =
    useState<LoginChallengeResponse | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginVerifyLoading, setLoginVerifyLoading] = useState(false);
  const [loginResendLoading, setLoginResendLoading] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [signupChallenge, setSignupChallenge] =
    useState<RegisterResponse | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupVerifyLoading, setSignupVerifyLoading] = useState(false);
  const [signupResendLoading, setSignupResendLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);

    try {
      const response = await authApi.login({
        email: loginEmail,
        password: loginPassword,
      });
      setLoginChallenge(response);
      setLoginCode("");
      toast.success(
        response.message || "A verification code has been sent to your email.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to send the sign-in code."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!loginChallenge) {
      return;
    }

    setLoginVerifyLoading(true);

    try {
      const response = await authApi.verifyLogin({
        challengeId: loginChallenge.challengeId,
        code: loginCode,
      });
      await completeLogin(response);
      toast.success(response.message || "Signed in successfully.");
      const destination = resolveAuthenticatedPath(
        response.user,
        requestedNext,
        nextPath,
      );
      router.replace(destination);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to verify the sign-in code."));
    } finally {
      setLoginVerifyLoading(false);
    }
  };

  const handleResendLogin = async () => {
    if (!loginChallenge) {
      return;
    }

    setLoginResendLoading(true);

    try {
      const response = await authApi.resendAuthCode({
        challengeId: loginChallenge.challengeId,
      });
      setLoginChallenge((current) =>
        current ? { ...current, ...response } : current,
      );
      setLoginCode("");
      toast.success(
        response.message || "A new verification code has been sent.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to resend the sign-in code."));
    } finally {
      setLoginResendLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setSignupLoading(true);

    try {
      const response = await authApi.register({
        fullName: signupFullName,
        email: signupEmail,
        password: signupPassword,
        requestedRole: copy.requestedRole,
      });
      setSignupChallenge(response);
      setSignupCode("");
      toast.success(
        response.message || "A verification code has been sent to your email.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to start sign-up."));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifySignup = async (event: FormEvent) => {
    event.preventDefault();

    if (!signupChallenge) {
      return;
    }

    setSignupVerifyLoading(true);

    try {
      const response: RegisterVerificationResponse =
        await authApi.verifyRegister({
          challengeId: signupChallenge.challengeId,
          code: signupCode,
        });

      toast.success(
        response.message ||
          "Account created successfully! Please sign in to continue.",
      );
      router.replace(copy.loginTabUrl);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to verify the sign-up code."));
    } finally {
      setSignupVerifyLoading(false);
    }
  };

  const handleResendSignup = async () => {
    if (!signupChallenge) {
      return;
    }

    setSignupResendLoading(true);

    try {
      const response = await authApi.resendAuthCode({
        challengeId: signupChallenge.challengeId,
      });
      setSignupChallenge((current) =>
        current ? { ...current, ...response } : current,
      );
      setSignupCode("");
      toast.success(
        response.message || "A new verification code has been sent.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to resend the sign-up code."));
    } finally {
      setSignupResendLoading(false);
    }
  };

  const handleSocialLogin = (provider: SocialAuthProvider) => {
    window.location.href =
      provider === "google" ? googleAuthorizeUrl : facebookAuthorizeUrl;
  };

  const switchTabTo = (target: AuthTab) => {
    setTab(target);
    if (target === "login") {
      setSignupChallenge(null);
      setSignupCode("");
    } else {
      setLoginChallenge(null);
      setLoginCode("");
    }
  };

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto max-w-2xl">
        <section className="rounded-[1.75rem] border border-border bg-card p-4 shadow-card sm:rounded-[2rem] sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {copy.heading}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>

          <div className="flex rounded-2xl bg-muted p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => switchTabTo("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => switchTabTo("signup")}
            >
              Signup
            </button>
          </div>

          <div
            className={`mt-6 grid gap-3 ${
              enableFacebookLogin ? "sm:grid-cols-2" : ""
            }`}
          >
            <SocialButton provider="google" onClick={handleSocialLogin} />
            {enableFacebookLogin ? (
              <SocialButton provider="facebook" onClick={handleSocialLogin} />
            ) : null}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>or use email OTP</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {tab === "login" ? (
            loginChallenge ? (
              <form onSubmit={handleVerifyLogin} className="space-y-4">
                <ChallengeCard
                  challenge={loginChallenge}
                  title="Sign-in code sent"
                />
                <div className="space-y-2">
                  <Label htmlFor="loginCode">Verification code</Label>
                  <Input
                    id="loginCode"
                    inputMode="numeric"
                    placeholder="123456"
                    value={loginCode}
                    onChange={(event) => setLoginCode(event.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setLoginChallenge(null);
                      setLoginCode("");
                    }}
                  >
                    Change email
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={loginResendLoading}
                    onClick={handleResendLogin}
                  >
                    {loginResendLoading ? "Resending..." : "Resend code"}
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginVerifyLoading}
                >
                  {loginVerifyLoading ? "Verifying..." : "Verify and sign in"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="Your password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    required
                  />
                </div>
                <p className="rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  After verifying your password, we will email you a 6-digit
                  code to finish signing in.
                </p>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Sending code..." : "Continue"}
                </Button>
                <p className="pt-1 text-center text-sm text-muted-foreground">
                  Need an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTabTo("signup")}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )
          ) : signupChallenge ? (
            <form onSubmit={handleVerifySignup} className="space-y-4">
              <ChallengeCard
                challenge={signupChallenge}
                title="Sign-up code sent"
              />
              <div className="space-y-2">
                <Label htmlFor="signupCode">Verification code</Label>
                <Input
                  id="signupCode"
                  inputMode="numeric"
                  placeholder="123456"
                  value={signupCode}
                  onChange={(event) => setSignupCode(event.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSignupChallenge(null);
                    setSignupCode("");
                  }}
                >
                  Edit details
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={signupResendLoading}
                  onClick={handleResendSignup}
                >
                  {signupResendLoading ? "Resending..." : "Resend code"}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={signupVerifyLoading}
              >
                {signupVerifyLoading
                  ? "Creating account..."
                  : "Verify and create account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signupFullName">Full name</Label>
                <Input
                  id="signupFullName"
                  type="text"
                  placeholder="Alex Johnson"
                  value={signupFullName}
                  onChange={(event) => setSignupFullName(event.target.value)}
                  minLength={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  minLength={8}
                  maxLength={128}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupConfirmPassword">Confirm password</Label>
                <Input
                  id="signupConfirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={signupConfirmPassword}
                  onChange={(event) =>
                    setSignupConfirmPassword(event.target.value)
                  }
                  minLength={8}
                  maxLength={128}
                  required
                />
              </div>
              <p className="rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                We verify your email with OTP before creating the account.
              </p>
              <Button type="submit" className="w-full" disabled={signupLoading}>
                {signupLoading ? "Sending code..." : "Send sign-up code"}
              </Button>
              <p className="pt-1 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTabTo("login")}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
