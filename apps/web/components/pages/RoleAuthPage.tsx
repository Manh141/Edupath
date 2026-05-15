"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ApiError, authApi } from "@/lib/auth-api";
import { useAuth } from "@/contexts/AuthContext";
import { enableFacebookLogin } from "@/lib/feature-flags";
import {
  resolveAuthenticatedPath,
  type ActiveRole as SessionActiveRole,
} from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  LoginChallengeResponse,
  RegisterResponse,
  SocialAuthProvider,
} from "@/types/auth";

type AuthTab = "login" | "signup";
type AuthPortalRole = Exclude<SessionActiveRole, "admin">;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function isSignupTab(value: string | null): boolean {
  return value === "signup" || value === "register";
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
      {challenge.email && (
        <p className="mt-2 text-muted-foreground">Email: {challenge.email}</p>
      )}
      <p className="text-muted-foreground">
        Expires in {challenge.expiresInMinutes} minutes.
      </p>
      {challenge._devCode && (
        <div className="mt-3 rounded-xl border border-dashed border-border bg-background/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Development OTP
          </p>
          <p className="mt-2 font-mono text-lg font-semibold tracking-[0.35em] text-foreground">
            {challenge._devCode}
          </p>
        </div>
      )}
    </div>
  );
}

const ROLE_CONFIG: Record<
  AuthPortalRole,
  {
    label: string;
    loginRedirect: string;
    registerRedirect: string;
    alternateLabel: string;
    alternateLink: string;
    alternateRole: AuthPortalRole;
  }
> = {
  student: {
    label: "Student",
    loginRedirect: "/dashboard",
    registerRedirect: "/auth/student",
    alternateLabel: "Want to teach instead?",
    alternateLink: "/auth/instructor?tab=signup",
    alternateRole: "instructor",
  },
  instructor: {
    label: "Instructor",
    loginRedirect: "/instructor",
    registerRedirect: "/auth/instructor",
    alternateLabel: "Here to learn instead?",
    alternateLink: "/auth/student",
    alternateRole: "student",
  },
};

export default function RoleAuthPage({ role }: { role: AuthPortalRole }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completeLogin, setActiveRole } = useAuth();
  const config = ROLE_CONFIG[role];

  const [tab, setTab] = useState<AuthTab>(
    isSignupTab(searchParams.get("tab")) ? "signup" : "login",
  );

  useEffect(() => {
    setTab(isSignupTab(searchParams.get("tab")) ? "signup" : "login");
  }, [searchParams]);

  const googleAuthorizeUrl = useMemo(
    () => authApi.getSocialAuthorizeUrl("google", config.loginRedirect),
    [config.loginRedirect],
  );
  const facebookAuthorizeUrl = useMemo(() => {
    if (!enableFacebookLogin) {
      return "";
    }

    return authApi.getSocialAuthorizeUrl("facebook", config.loginRedirect);
  }, [config.loginRedirect]);

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
    if (!loginChallenge) return;

    setLoginVerifyLoading(true);

    try {
      const response = await authApi.verifyLogin({
        challengeId: loginChallenge.challengeId,
        code: loginCode,
      });
      await completeLogin(response);
      setActiveRole(
        response.user.roles?.includes("admin") ||
          response.user.role?.toLowerCase() === "admin"
          ? "admin"
          : role,
      );
      toast.success(response.message || "Signed in successfully.");
      router.replace(
        resolveAuthenticatedPath(
          response.user,
          config.loginRedirect,
          config.loginRedirect,
        ),
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to verify the sign-in code."),
      );
    } finally {
      setLoginVerifyLoading(false);
    }
  };

  const handleResendLogin = async () => {
    if (!loginChallenge) return;

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
      toast.error(
        getErrorMessage(error, "Unable to resend the sign-in code."),
      );
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
        requestedRole: role,
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
    if (!signupChallenge) return;

    setSignupVerifyLoading(true);

    try {
      await authApi.verifyRegister({
        challengeId: signupChallenge.challengeId,
        code: signupCode,
      });
      toast.success("Account created successfully! Please sign in to continue.");
      router.replace(`${config.registerRedirect}?tab=login`);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to verify the sign-up code."),
      );
    } finally {
      setSignupVerifyLoading(false);
    }
  };

  const handleResendSignup = async () => {
    if (!signupChallenge) return;

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
      toast.error(
        getErrorMessage(error, "Unable to resend the sign-up code."),
      );
    } finally {
      setSignupResendLoading(false);
    }
  };

  const handleSocialLogin = (provider: SocialAuthProvider) => {
    window.location.href =
      provider === "google" ? googleAuthorizeUrl : facebookAuthorizeUrl;
  };

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto max-w-2xl">
        <section className="rounded-[1.75rem] border border-border bg-card p-4 shadow-card sm:rounded-[2rem] sm:p-6 lg:p-8">
          <div className="flex rounded-2xl bg-muted p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => setTab("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => setTab("signup")}
            >
              Create account
            </button>
          </div>

          <div
            className={`mt-6 grid gap-3 ${
              enableFacebookLogin ? "sm:grid-cols-2" : ""
            }`}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => handleSocialLogin("google")}
            >
              <span>Continue with Google</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            {enableFacebookLogin ? (
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleSocialLogin("facebook")}
              >
                <span>Continue with Facebook</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
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
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
                <p className="font-medium text-foreground">
                  Registering as:{" "}
                  <span className="text-primary">{config.label}</span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {config.alternateLabel}{" "}
                  <Link
                    href={config.alternateLink}
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Switch to {config.alternateRole} -&gt;
                  </Link>
                </p>
              </div>
              <p className="rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                We verify your email with OTP before creating the account.
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={signupLoading}
              >
                {signupLoading ? "Sending code..." : "Send sign-up code"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
