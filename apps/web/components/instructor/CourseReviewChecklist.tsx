"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ApiError, instructorApi } from "@/lib/course-api";
import { useAuth } from "@/contexts/AuthContext";
import type {
  CourseChecklistGroup,
  CourseChecklistItem,
  CourseChecklistReport,
  CourseStatusValue,
} from "@/types/course";

const GROUP_LABELS: Record<CourseChecklistGroup, string> = {
  basicInfo: "Basic information",
  intendedLearners: "Intended learners",
  curriculum: "Curriculum",
  media: "Media",
  pricing: "Pricing and onboarding",
  ownership: "Ownership",
};

const SUBMITTABLE_STATUSES: CourseStatusValue[] = [
  "draft",
  "in_progress",
  "changes_requested",
];

export function CourseReviewChecklist({
  courseId,
  status,
}: {
  courseId: string;
  status: CourseStatusValue;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const checklistQuery = useQuery({
    queryKey: ["course-checklist", courseId],
    queryFn: () => instructorApi.getChecklist(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      instructorApi.submitForReview(courseId, undefined, accessToken!),
    onSuccess: () => {
      toast.success("Course submitted for review.");
      void queryClient.invalidateQueries({
        queryKey: ["instructor-course", courseId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["course-checklist", courseId],
      });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.statusCode === 400) {
        toast.error(
          "Course is not ready for review. Resolve the listed issues first.",
        );
        void queryClient.invalidateQueries({
          queryKey: ["course-checklist", courseId],
        });
        return;
      }
      toast.error("Failed to submit for review.");
    },
  });

  const grouped = useMemo(
    () => groupItems(checklistQuery.data),
    [checklistQuery.data],
  );
  const canSubmit =
    Boolean(checklistQuery.data?.canSubmit) &&
    SUBMITTABLE_STATUSES.includes(status);

  if (checklistQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    );
  }

  if (!checklistQuery.data) {
    return (
      <p className="text-sm text-muted-foreground">
        Checklist is unavailable. Try again later.
      </p>
    );
  }

  const report = checklistQuery.data;

  return (
    <div className="space-y-6">
      <ChecklistHeader report={report} status={status} />

      <Separator />

      <div className="space-y-5">
        {(Object.keys(grouped) as CourseChecklistGroup[]).map((group) => (
          <ChecklistGroupCard
            key={group}
            group={group}
            items={grouped[group]}
          />
        ))}
      </div>

      <Separator />

      <SubmitPanel
        status={status}
        canSubmit={canSubmit}
        report={report}
        isPending={submitMutation.isPending}
        onSubmit={() => submitMutation.mutate()}
      />
    </div>
  );
}

function ChecklistHeader({
  report,
  status,
}: {
  report: CourseChecklistReport;
  status: CourseStatusValue;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Course readiness
          </p>
          <p className="mt-1 text-2xl font-bold">{report.completionPercent}%</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <Progress value={report.completionPercent} className="mt-4" />
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>
          {report.totals.passedRequiredItems}/{report.totals.requiredItems}{" "}
          required checks passed
        </span>
        {report.totals.errors > 0 && (
          <span className="text-destructive">
            {report.totals.errors} blocking issue(s)
          </span>
        )}
        {report.totals.warnings > 0 && (
          <span className="text-amber-600">
            {report.totals.warnings} warning(s)
          </span>
        )}
      </div>
    </div>
  );
}

function ChecklistGroupCard({
  group,
  items,
}: {
  group: CourseChecklistGroup;
  items: CourseChecklistItem[];
}) {
  if (items.length === 0) return null;
  const passed = items.filter((i) => i.passed).length;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{GROUP_LABELS[group]}</h3>
        <span className="text-xs text-muted-foreground">
          {passed}/{items.length}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.code} className="flex items-start gap-2 text-sm">
            <ItemIcon item={item} />
            <div className="flex-1">
              <p
                className={
                  item.passed ? "text-foreground" : "text-foreground/90"
                }
              >
                {item.label}
              </p>
              {item.hint && (
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              )}
            </div>
            {item.severity === "warning" && !item.passed && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700"
              >
                Optional
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItemIcon({ item }: { item: CourseChecklistItem }) {
  if (item.passed) {
    return <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />;
  }
  if (item.severity === "warning") {
    return <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />;
  }
  return <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />;
}

function SubmitPanel({
  status,
  canSubmit,
  report,
  isPending,
  onSubmit,
}: {
  status: CourseStatusValue;
  canSubmit: boolean;
  report: CourseChecklistReport;
  isPending: boolean;
  onSubmit: () => void;
}) {
  if (status === "pending_review") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        This course is awaiting admin review. Major edits are locked until a
        decision is made.
      </div>
    );
  }

  if (status === "approved" || status === "published") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        This course has been approved. Use the publish action to make it
        visible.
      </div>
    );
  }

  if (status === "rejected" || status === "archived") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        This course is in a terminal state and cannot be re-submitted.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        {canSubmit
          ? "All required checks passed. You can submit this course for review."
          : `Resolve the ${report.totals.errors} remaining blocking issue(s) to enable submit.`}
      </div>
      <Button
        size="lg"
        variant="hero"
        disabled={!canSubmit || isPending}
        onClick={onSubmit}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Submit for review
      </Button>
    </div>
  );
}

function StatusBadge({ status }: { status: CourseStatusValue }) {
  const map: Record<CourseStatusValue, string> = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-sky-100 text-sky-700",
    pending_review: "bg-amber-100 text-amber-700",
    changes_requested: "bg-orange-100 text-orange-700",
    approved: "bg-blue-100 text-blue-700",
    published: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    archived: "bg-gray-100 text-gray-500",
  };
  const label = status
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Badge variant="secondary" className={map[status]}>
      {label}
    </Badge>
  );
}

function groupItems(
  report: CourseChecklistReport | undefined,
): Record<CourseChecklistGroup, CourseChecklistItem[]> {
  const init: Record<CourseChecklistGroup, CourseChecklistItem[]> = {
    basicInfo: [],
    intendedLearners: [],
    curriculum: [],
    media: [],
    pricing: [],
    ownership: [],
  };
  if (!report) return init;
  for (const item of report.items) {
    init[item.group].push(item);
  }
  return init;
}
