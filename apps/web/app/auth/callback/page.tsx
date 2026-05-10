import { Suspense } from "react";
import AuthCallbackPage from "@/components/pages/AuthCallbackPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackPage />
    </Suspense>
  );
}
