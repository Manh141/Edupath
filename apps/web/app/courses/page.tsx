import { Suspense } from "react";
import CoursesPage from "@/components/pages/CoursesPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CoursesPage />
    </Suspense>
  );
}
