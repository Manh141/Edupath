"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import type { CourseStatusValue } from "@/types/course";
import { CourseStatusBadge } from "../CourseStatusBadge";
import { ChecklistOverview } from "./checklist-ui";

export function ReviewChecklistStep({
  courseId,
  status,
  onPrev,
  onNext,
}: {
  courseId: string;
  status: CourseStatusValue;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { accessToken } = useAuth();

  const checklistQuery = useQuery({
    queryKey: ["course-checklist", courseId],
    queryFn: () => instructorApi.getChecklist(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-black text-brand">
              Review checklist
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              This is the same business validation the backend uses before
              creating a review submission. Fix blocking issues before
              submitting.
            </p>
          </div>
          <CourseStatusBadge status={status} />
        </div>
      </div>

      {checklistQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          Loading readiness report...
        </div>
      ) : checklistQuery.data ? (
        <ChecklistOverview report={checklistQuery.data} />
      ) : (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Checklist is unavailable. Please try refreshing.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void checklistQuery.refetch()}
            disabled={checklistQuery.isFetching}
          >
            <RefreshCw
              className={
                checklistQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Refresh checklist
          </Button>
          <Button
            type="button"
            variant="hero"
            onClick={onNext}
            disabled={!checklistQuery.data?.canSubmit}
          >
            Continue to submit
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
