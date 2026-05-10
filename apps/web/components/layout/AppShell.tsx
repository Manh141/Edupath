"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isStandalone =
    pathname?.startsWith("/admin") || pathname?.startsWith("/instructor");

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
