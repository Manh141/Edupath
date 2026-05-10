import { Suspense } from "react";
import AuthPage from "@/components/pages/AuthPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthPage role="student" />
    </Suspense>
  );
}
