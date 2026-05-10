"use client";

import { Badge } from "@/components/ui/badge";
import type { CourseStatus } from "@/types/course";

const STATUS_STYLES: Record<CourseStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  in_progress: "bg-sky-100 text-sky-700",
  pending_review: "bg-amber-100 text-amber-700",
  changes_requested: "bg-orange-100 text-orange-700",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-500",
};

export function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function CourseStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style = STATUS_STYLES[status as CourseStatus] ?? "bg-secondary text-muted-foreground";
  return (
    <Badge variant="secondary" className={`${style} ${className ?? ""}`.trim()}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
