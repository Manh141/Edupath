"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Loader2, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, instructorApi } from "@/lib/course-api";
import {
  isEditableStatus,
  type Course,
  type CourseChecklistReport,
} from "@/types/course";
import { CourseStatusBadge } from "../CourseStatusBadge";
import { ChecklistOverview } from "./checklist-ui";

export function SubmitStep({
  courseId,
  course,
  checklist,
  onChanged,
  onPrev,
}: {
  courseId: string;
  course: Course;
  checklist: CourseChecklistReport | undefined;
  onChanged: () => void;
  onPrev: () => void;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [serverReport, setServerReport] = useState<CourseChecklistReport | undefined>();
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const effectiveStatus = statusOverride ?? course.status ?? "draft";
  const report = serverReport ?? checklist;
  const editableStatus = isEditableStatus(effectiveStatus);
  const canSubmit = Boolean(report?.canSubmit && editableStatus);

  const submitMutation = useMutation({
    mutationFn: () =>
      instructorApi.submitForReview(
        courseId,
        { note: note.trim() || undefined },
        accessToken!,
      ),
    onSuccess: (response) => {
      const nextStatus = response.course?.status ?? "pending_review";
      const submittedAt =
        response.course?.submittedAt ?? response.submission?.submittedAt ?? null;

      setServerReport(response.report);
      setStatusOverride(nextStatus);
      setSubmitFeedback({
        tone: "success",
        message:
          "The course was submitted successfully and is now waiting for admin review.",
      });

      queryClient.setQueryData<Course | undefined>(
        ["instructor-course", courseId],
        (current) =>
          current
            ? {
                ...current,
                status: nextStatus,
                submittedAt: submittedAt ?? current.submittedAt,
                rejectedReason: response.course?.rejectedReason ?? null,
                changesRequested: response.course?.changesRequested ?? null,
                approvedAt: response.course?.approvedAt ?? current.approvedAt,
                updatedAt: response.course?.updatedAt ?? current.updatedAt,
              }
            : current,
      );
      queryClient.setQueryData<CourseChecklistReport | undefined>(
        ["course-checklist", courseId],
        response.report,
      );

      toast.success("Course submitted for admin review.");
      void queryClient.invalidateQueries({ queryKey: ["instructor-course", courseId] });
      void queryClient.invalidateQueries({ queryKey: ["course-checklist", courseId] });
      void queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      onChanged();
    },
    onError: (error) => {
      const nextReport = extractValidationReport(error);
      if (nextReport) {
        setServerReport(nextReport);
        setSubmitFeedback({
          tone: "error",
          message:
            "The course is not ready for review yet. Check the updated checklist and resolve the blocking items.",
        });
        toast.error("Course is not ready. Review the updated checklist.");
        return;
      }
      setSubmitFeedback({
        tone: "error",
        message: getSubmitErrorMessage(error),
      });
      toast.error(getSubmitErrorMessage(error));
    },
  });

  if (effectiveStatus === "pending_review") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 h-5 w-5 shrink-0" />
            <div>
              <h2 className="font-heading text-xl font-black text-amber-950">
                Course is pending review
              </h2>
              <p className="mt-2 text-sm leading-6">
                Major edits are locked while admins review this submission. If they
                request changes, the course will move back to an editable status.
              </p>
              {submitFeedback?.tone === "success" ? (
                <p className="mt-3 text-sm font-medium text-amber-950">
                  {submitFeedback.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to checklist
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-black text-brand">
              Submit for review
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Submitting creates a review submission snapshot for admin moderation
              and moves the course into pending review.
            </p>
          </div>
          <CourseStatusBadge status={effectiveStatus} />
        </div>
      </div>

      {report ? (
        <ChecklistOverview report={report} compact />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Checklist is still loading. Go back to Review Checklist or refresh the page.
        </div>
      )}

      {submitFeedback ? (
        <div
          className={
            submitFeedback.tone === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900"
              : "rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-destructive"
          }
        >
          <p className="font-semibold">
            {submitFeedback.tone === "success"
              ? "Submission sent"
              : "Submission could not be completed"}
          </p>
          <p className="mt-1 text-sm leading-6">{submitFeedback.message}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={
              canSubmit
                ? "mt-1 h-5 w-5 shrink-0 text-emerald-600"
                : "mt-1 h-5 w-5 shrink-0 text-muted-foreground"
            }
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-brand">
              Final confirmation
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              After submission, the backend locks main authoring edits until an
              admin approves, rejects, or requests changes.
            </p>

            <Separator className="my-4" />

            <label className="text-sm font-semibold text-foreground" htmlFor="review-note">
              Optional note to admin
            </label>
            <Textarea
              id="review-note"
              value={note}
              maxLength={1000}
              placeholder="Mention anything reviewers should know about this draft."
              className="mt-2 min-h-28"
              onChange={(event) => setNote(event.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {note.length}/1000 characters
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to checklist
        </Button>
        <Button
          type="button"
          variant="hero"
          size="lg"
          disabled={!canSubmit || submitMutation.isPending}
          onClick={() => submitMutation.mutate()}
        >
          {submitMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Submit course for review
        </Button>
      </div>
    </div>
  );
}

function extractValidationReport(error: unknown): CourseChecklistReport | undefined {
  if (!(error instanceof ApiError)) return undefined;

  const payload = error.payload;
  if (!payload || typeof payload !== "object") return undefined;

  const details = (payload as { details?: unknown }).details;
  if (!details || typeof details !== "object") return undefined;

  const report = (details as { report?: unknown }).report;
  if (!report || typeof report !== "object") return undefined;

  return report as CourseChecklistReport;
}

function getSubmitErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "Failed to submit for review.";
  }

  const payload = error.payload;
  if (!payload || typeof payload !== "object") {
    return error.message || "Failed to submit for review.";
  }

  const rootCode =
    typeof (payload as { code?: unknown }).code === "string"
      ? (payload as { code: string }).code
      : null;
  const details =
    payload && typeof payload === "object"
      ? (payload as { details?: unknown }).details
      : undefined;
  const detailsCode =
    details && typeof details === "object" && typeof (details as { code?: unknown }).code === "string"
      ? (details as { code: string }).code
      : null;
  const code = detailsCode ?? rootCode;

  switch (code) {
    case "COURSE_VALIDATION_FAILED":
      return "The course is not ready for review yet. Complete the checklist before submitting.";
    case "INSTRUCTOR_ONBOARDING_REQUIRED":
      return "Complete pricing and pre-instructor onboarding before submitting for review.";
    case "INSTRUCTOR_IDENTITY_REQUIRED":
      return "Complete instructor identity verification before submitting for review.";
    case "SELLER_ONBOARDING_UNAVAILABLE":
      return "Instructor onboarding is temporarily unavailable. Please try again in a few minutes.";
    default:
      return error.message || "Failed to submit for review.";
  }
}
