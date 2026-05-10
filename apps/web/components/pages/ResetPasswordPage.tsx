"use client";

import AuthFlowNoticePage from "@/components/pages/AuthFlowNoticePage";

export default function ResetPasswordPage() {
  return (
    <AuthFlowNoticePage
      title="Password reset has been replaced"
      description="The current EduPath auth flow does not use passwords for local accounts. Return to the auth page to receive an email OTP and continue."
      primaryHref="/auth"
      primaryLabel="Go to sign in"
      secondaryHref="/auth?tab=signup"
      secondaryLabel="Create account"
    />
  );
}
