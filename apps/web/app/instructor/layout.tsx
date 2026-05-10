import type { ReactNode } from "react";
import InstructorGuard from "@/components/InstructorGuard";
import InstructorShell from "@/components/layout/InstructorShell";

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <InstructorGuard>
      <InstructorShell>{children}</InstructorShell>
    </InstructorGuard>
  );
}
