import { Suspense } from "react";
import CheckoutPage from "@/components/pages/CheckoutPage";

export const metadata = { title: "Checkout - EduPath" };

function CheckoutFallback() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl bg-secondary"
          />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPage />
    </Suspense>
  );
}
