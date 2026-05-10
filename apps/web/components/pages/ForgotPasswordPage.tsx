"use client";

import AuthFlowNoticePage from "@/components/pages/AuthFlowNoticePage";

export default function ForgotPasswordPage() {
  return (
    <AuthFlowNoticePage
      title="Password reset is no longer active"
      description="EduPath local auth now uses email OTP only. If you need access again, start a new sign-in flow and we will send a fresh code to your inbox."
      primaryHref="/auth"
      primaryLabel="Go to sign in"
      secondaryHref="/auth?tab=signup"
      secondaryLabel="Create account"
    />
  );
}
