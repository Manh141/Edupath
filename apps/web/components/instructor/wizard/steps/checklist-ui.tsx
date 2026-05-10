"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  CourseChecklistGroup,
  CourseChecklistItem,
  CourseChecklistReport,
} from "@/types/course";

export const CHECKLIST_GROUP_LABELS: Record<CourseChecklistGroup, string> = {
  basicInfo: "Basic information",
  intendedLearners: "Intended learners",
  curriculum: "Curriculum",
  media: "Media",
  pricing: "Pricing and onboarding",
  ownership: "Ownership",
};

export function groupChecklistItems(
  report: CourseChecklistReport | undefined,
): Record<CourseChecklistGroup, CourseChecklistItem[]> {
  const groups: Record<CourseChecklistGroup, CourseChecklistItem[]> = {
    basicInfo: [],
    intendedLearners: [],
    curriculum: [],
    media: [],
    pricing: [],
    ownership: [],
  };

  if (!report) return groups;

  for (const item of report.items) {
    groups[item.group].push(item);
  }

  return groups;
}

export function ChecklistOverview({
  report,
  compact = false,
}: {
  report: CourseChecklistReport;
  compact?: boolean;
}) {
  const grouped = groupChecklistItems(report);
  const groupOrder: CourseChecklistGroup[] = [
    "basicInfo",
    "intendedLearners",
    "curriculum",
    "media",
    "pricing",
    "ownership",
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Course readiness
            </p>
            <p className="mt-1 font-heading text-3xl font-black text-brand">
              {report.completionPercent}%
            </p>
          </div>
          <Badge
            variant="secondary"
            className={
              report.canSubmit
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }
          >
            {report.canSubmit ? "Ready to submit" : "Needs work"}
          </Badge>
        </div>

        <Progress value={report.completionPercent} className="mt-4" />

        <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="rounded-xl bg-secondary/70 p-3">
            <p className="font-semibold text-foreground">
              {report.totals.passedRequiredItems}/{report.totals.requiredItems}
            </p>
            <p>required checks passed</p>
          </div>
          <div className="rounded-xl bg-secondary/70 p-3">
            <p className="font-semibold text-destructive">
              {report.totals.errors}
            </p>
            <p>blocking issues</p>
          </div>
          <div className="rounded-xl bg-secondary/70 p-3">
            <p className="font-semibold text-amber-700">
              {report.totals.warnings}
            </p>
            <p>warnings</p>
          </div>
        </div>
      </div>

      <div className={cn("grid gap-4", compact ? "" : "lg:grid-cols-2")}>
        {groupOrder.map((group) => {
          const items = grouped[group];
          if (items.length === 0) return null;
          const passed = items.filter((item) => item.passed).length;

          return (
            <div
              key={group}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-heading text-sm font-bold text-brand">
                  {CHECKLIST_GROUP_LABELS[group]}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {passed}/{items.length}
                </span>
              </div>

              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.code} className="flex gap-2 text-sm">
                    <ChecklistIcon item={item} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          item.passed
                            ? "text-foreground"
                            : item.severity === "warning"
                              ? "text-amber-800"
                              : "text-foreground"
                        }
                      >
                        {item.label}
                      </p>
                      {item.hint && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.hint}
                        </p>
                      )}
                    </div>
                    {!item.passed && item.severity === "warning" && (
                      <Badge
                        variant="secondary"
                        className="h-6 bg-amber-100 text-amber-700"
                      >
                        Warning
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChecklistIcon({ item }: { item: CourseChecklistItem }) {
  if (item.passed) {
    return (
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
    );
  }

  if (item.severity === "warning") {
    return <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />;
  }

  if (!item.label) {
    return (
      <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    );
  }

  return <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />;
}
