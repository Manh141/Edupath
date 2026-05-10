"use client";

import AuthFlowNoticePage from "@/components/pages/AuthFlowNoticePage";

export default function VerifyEmailPage() {
  return (
    <AuthFlowNoticePage
      title="Email verification now happens with OTP"
      description="Registration is completed by entering the OTP sent to your email. If you still need an account, start a new sign-up flow and verify the code there."
      primaryHref="/auth?tab=signup"
      primaryLabel="Go to sign up"
      secondaryHref="/auth"
      secondaryLabel="Go to sign in"
    />
  );
}
