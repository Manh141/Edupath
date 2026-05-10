"use client";

import { Suspense } from "react";
import { CourseWizardLayout } from "@/components/instructor/wizard/CourseWizardLayout";

export default function InstructorCourseEditorPage({
  courseId,
}: {
  courseId: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full px-4 py-10 text-sm text-muted-foreground sm:px-6 xl:px-8">
          Loading course studio...
        </div>
      }
    >
      <CourseWizardLayout courseId={courseId} />
    </Suspense>
  );
}
