"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Ban,
  BookOpen,
  ExternalLink,
  FileText,
  Layers3,
  Loader2,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, adminCourseApi } from "@/lib/course-api";
import type {
  Course,
  CourseLecture,
  CourseListItem,
  CourseReviewSubmissionEntry,
  CourseReviewSubmissionSnapshot,
  CourseStatusHistoryEntry,
} from "@/types/course";

type AdminCourseRow = CourseListItem & {
  status?: string;
  updatedAt?: string;
  instructorName?: string;
};

type CourseModerationBundle = {
  detail: Course;
  history: CourseStatusHistoryEntry[];
  submissions: CourseReviewSubmissionEntry[];
};

export function CourseModerationActions({ course }: { course: AdminCourseRow }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const detailQuery = useQuery({
    queryKey: ["admin-course", course.id, "bundle"],
    queryFn: async (): Promise<CourseModerationBundle> => {
      const [detail, history, submissions] = await Promise.all([
        adminCourseApi.getCourse(course.id, accessToken!),
        adminCourseApi.getStatusHistory(course.id, accessToken!),
        adminCourseApi.getReviewSubmissions(course.id, accessToken!),
      ]);

      return { detail, history, submissions };
    },
    enabled: isDrawerOpen && Boolean(accessToken),
  });

  const invalidateAdminData = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-course", course.id] });
  };

  const approveAndPublishMutation = useMutation({
    mutationFn: () => adminCourseApi.approveAndPublishCourse(course.id, accessToken!),
    onSuccess: () => {
      toast.success("Course approved and published to EduPath.");
      invalidateAdminData();
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to approve and publish course."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => adminCourseApi.rejectCourse(course.id, reason, accessToken!),
    onSuccess: () => {
      toast.success("Course rejected. Instructor can now see the rejection reason.");
      setRejectReason("");
      setIsRejectDialogOpen(false);
      invalidateAdminData();
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to reject course."));
    },
  });

  const liveCourse = detailQuery.data?.detail;
  const detailBundle = detailQuery.data;
  const latestSubmission = detailBundle?.submissions[0] ?? null;
  const submissionSnapshot = latestSubmission?.contentSnapshot ?? null;
  const instructorSubmissionNote = useMemo(
    () => getInstructorSubmissionNote(detailBundle?.history, latestSubmission),
    [detailBundle?.history, latestSubmission],
  );
  const displayTitle = submissionSnapshot?.title || liveCourse?.title || course.title;
  const status = (liveCourse?.status ?? course.status ?? "draft").toLowerCase();
  const isMutating =
    approveAndPublishMutation.isPending || rejectMutation.isPending;
  const canModeratePendingReview = status === "pending_review";

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            View details
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full border-l border-border bg-background p-0 sm:max-w-5xl"
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border px-6 py-5">
              <SheetHeader className="pr-8">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-2xl">{displayTitle}</SheetTitle>
                    <StatusBadge value={status} />
                  </div>
                  <SheetDescription className="max-w-3xl text-sm leading-6 text-body">
                    Review the submitted course package, then reject it or approve and
                    publish it directly from this detail view.
                  </SheetDescription>
                </div>
              </SheetHeader>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-6 px-6 py-6">
                {detailQuery.isLoading ? (
                  <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading course details...
                  </div>
                ) : detailQuery.isError ? (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
                    <p className="font-medium text-destructive">
                      Failed to load course details.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => detailQuery.refetch()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : liveCourse && detailBundle ? (
                  <>
                    <ModerationSummaryCard course={liveCourse} />
                    <SubmissionRequestSection
                      submission={latestSubmission}
                      snapshot={submissionSnapshot}
                      instructorSubmissionNote={instructorSubmissionNote}
                    />
                    <CourseOverviewSection
                      course={liveCourse}
                      latestSubmission={latestSubmission}
                      snapshot={submissionSnapshot}
                    />
                    <CourseContentSection
                      course={liveCourse}
                      snapshot={submissionSnapshot}
                    />
                    <ModerationTimelineSection
                      history={detailBundle.history}
                      submissions={detailBundle.submissions}
                    />
                  </>
                ) : null}
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-background px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  {canModeratePendingReview
                    ? "This course is waiting for admin moderation. Choose Reject or Approve & Publish."
                    : "Only courses in Pending review can be moderated from this screen."}
                </div>
                <ModerationButtons
                  canModerate={canModeratePendingReview}
                  isPending={isMutating}
                  onApproveAndPublish={() => approveAndPublishMutation.mutate()}
                  onReject={() => setIsRejectDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject course review</DialogTitle>
            <DialogDescription>
              The rejection reason will be saved and shown back to the instructor so
              they know exactly why this course was not approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor={`reject-reason-${course.id}`}>Rejection reason</Label>
            <Textarea
              id={`reject-reason-${course.id}`}
              value={rejectReason}
              maxLength={1000}
              placeholder="Explain clearly why this course is rejected and what the instructor should fix."
              className="min-h-32"
              onChange={(event) => setRejectReason(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {rejectReason.trim().length}/1000 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              onClick={() => rejectMutation.mutate(rejectReason.trim())}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Reject course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ModerationButtons({
  canModerate,
  isPending,
  onApproveAndPublish,
  onReject,
}: {
  canModerate: boolean;
  isPending: boolean;
  onApproveAndPublish: () => void;
  onReject: () => void;
}) {
  return (
    <>
      <Button
        size="sm"
        variant="hero"
        disabled={!canModerate || isPending}
        onClick={onApproveAndPublish}
        title={
          !canModerate
            ? "Available when the course enters Pending review."
            : undefined
        }
      >
        Approve & Publish
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={!canModerate || isPending}
        onClick={onReject}
        title={
          !canModerate
            ? "Available when the course enters Pending review."
            : undefined
        }
      >
        Reject
      </Button>
    </>
  );
}

function SubmissionRequestSection({
  submission,
  snapshot,
  instructorSubmissionNote,
}: {
  submission: CourseReviewSubmissionEntry | null;
  snapshot: CourseReviewSubmissionSnapshot | null;
  instructorSubmissionNote: string | null;
}) {
  if (!submission) {
    return null;
  }

  const report = submission.validationReport;
  const pricingText =
    snapshot?.pricing && typeof snapshot.pricing.price === "number"
      ? formatCurrency(snapshot.pricing.price, snapshot.pricing.currency)
      : "N/A";

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-bold text-brand">Instructor submission package</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <InfoCard label="Submission version" value={`v${submission.version}`} />
        <InfoCard label="Submitted at" value={formatDateTime(submission.submittedAt)} />
        <InfoCard
          label="Snapshot captured"
          value={snapshot?.capturedAt ? formatDateTime(snapshot.capturedAt) : "N/A"}
        />
        <InfoCard label="Submitted price" value={pricingText} />
        <InfoCard
          label="Validation score"
          value={
            report ? `${report.completionPercent}% (${report.totals.errors} blockers)` : "N/A"
          }
        />
      </div>

      {instructorSubmissionNote ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Instructor note to admin
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-body">
            {instructorSubmissionNote}
          </p>
        </div>
      ) : null}

      {report ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Review checklist snapshot
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <InfoCard
              label="Required passed"
              value={`${report.totals.passedRequiredItems}/${report.totals.requiredItems}`}
            />
            <InfoCard label="Errors" value={String(report.totals.errors)} />
            <InfoCard label="Warnings" value={String(report.totals.warnings)} />
            <InfoCard
              label="Sections / lectures"
              value={`${snapshot?.counts?.sections ?? 0} / ${snapshot?.counts?.lectures ?? 0}`}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ModerationSummaryCard({ course }: { course: Course }) {
  const status = (course.status ?? "draft").toLowerCase();

  if (status === "pending_review") {
    return (
      <HighlightCard
        icon={<ShieldCheck className="h-5 w-5 text-amber-700" />}
        title="Pending moderation"
        description={`Submitted ${
          course.submittedAt ? formatDateTime(course.submittedAt) : "recently"
        }. Admin can review details below and choose Approve & Publish or Reject.`}
        tone="amber"
      />
    );
  }

  if (status === "published") {
    return (
      <HighlightCard
        icon={<PlayCircle className="h-5 w-5 text-emerald-700" />}
        title="Live on EduPath"
        description={`Published ${
          course.publishedAt ? formatDateTime(course.publishedAt) : "successfully"
        } and visible on the platform.`}
        tone="emerald"
      />
    );
  }

  if (status === "rejected") {
    return (
      <HighlightCard
        icon={<Ban className="h-5 w-5 text-rose-700" />}
        title="Rejected by admin"
        description={course.rejectedReason || "No rejection reason was recorded."}
        tone="rose"
      />
    );
  }

  if (status === "approved") {
    return (
      <HighlightCard
        icon={<ShieldCheck className="h-5 w-5 text-sky-700" />}
        title="Approved and waiting to publish"
        description={`Approved ${
          course.approvedAt ? formatDateTime(course.approvedAt) : "recently"
        }.`}
        tone="sky"
      />
    );
  }

  if (status === "changes_requested") {
    return (
      <HighlightCard
        icon={<FileText className="h-5 w-5 text-orange-700" />}
        title="Changes requested"
        description={course.changesRequested || "Admin requested instructor updates."}
        tone="orange"
      />
    );
  }

  return null;
}

function HighlightCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "amber" | "emerald" | "orange" | "rose" | "sky";
}) {
  const toneStyles: Record<typeof tone, string> = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    orange: "border-orange-200 bg-orange-50 text-orange-900",
    rose: "border-rose-200 bg-rose-50 text-rose-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneStyles[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CourseOverviewSection({
  course,
  latestSubmission,
  snapshot,
}: {
  course: Course;
  latestSubmission: CourseReviewSubmissionEntry | null;
  snapshot: CourseReviewSubmissionSnapshot | null;
}) {
  const lectureCount = getLectureCount(course);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-bold text-brand">Course overview</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <InfoCard label="Course ID" value={course.id} />
        <InfoCard label="Slug" value={course.slug} />
        <InfoCard label="Instructor" value={course.instructorName ?? "N/A"} />
        <InfoCard label="Category" value={course.categoryName ?? "N/A"} />
        <InfoCard label="Subcategory" value={course.subcategoryName ?? "N/A"} />
        <InfoCard label="Level" value={String(snapshot?.level ?? course.level ?? "N/A")} />
        <InfoCard label="Language" value={String(snapshot?.language ?? course.language ?? "N/A")} />
        <InfoCard
          label="Price"
          value={formatCurrency(snapshot?.pricing?.price ?? course.price, snapshot?.pricing?.currency ?? course.currency)}
        />
        <InfoCard label="Lectures" value={String(lectureCount)} />
        <InfoCard
          label="Duration"
          value={formatDuration(course.totalDurationSec ?? course.totalDuration)}
        />
        <InfoCard
          label="Updated"
          value={course.updatedAt ? formatDateTime(course.updatedAt) : "N/A"}
        />
        <InfoCard
          label="Review version"
          value={latestSubmission ? `v${latestSubmission.version}` : "N/A"}
        />
        <InfoCard
          label="Submitted"
          value={course.submittedAt ? formatDateTime(course.submittedAt) : "N/A"}
        />
        <InfoCard
          label="Approved"
          value={course.approvedAt ? formatDateTime(course.approvedAt) : "N/A"}
        />
        <InfoCard
          label="Published"
          value={course.publishedAt ? formatDateTime(course.publishedAt) : "N/A"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Submitted description
          </div>
          <div className="mt-3 space-y-3 text-sm leading-7 text-body">
            {snapshot?.subtitle || course.subtitle ? (
              <p className="font-semibold text-brand">{snapshot?.subtitle ?? course.subtitle}</p>
            ) : null}
            {snapshot?.shortDescription || course.shortDescription ? (
              <p>{snapshot?.shortDescription ?? course.shortDescription}</p>
            ) : null}
            <p className="whitespace-pre-line">
              {snapshot?.description || course.description || "No full description provided yet."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <AssetPanel
            title="Thumbnail"
            url={snapshot?.thumbnailUrl || course.thumbnailUrl || undefined}
            emptyLabel="No thumbnail uploaded"
          />
          <AssetPanel
            title="Promo video"
            url={snapshot?.trailerUrl || course.trailerUrl || undefined}
            emptyLabel="No promo video uploaded"
          />
        </div>
      </div>
    </section>
  );
}

function CourseContentSection({
  course,
  snapshot,
}: {
  course: Course;
  snapshot: CourseReviewSubmissionSnapshot | null;
}) {
  const submittedSectionCount = snapshot?.counts?.sections;
  const submittedLectureCount = snapshot?.counts?.lectures;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-bold text-brand">Detailed course content</h3>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ListCard title="What students will learn" items={course.objectives ?? []} />
        <ListCard title="Requirements" items={course.requirements ?? []} />
        <ListCard title="Target audience" items={course.targetAudiences ?? []} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <FaqCard faqs={course.faqs ?? []} />
        <CourseMessageCard course={course} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Submitted curriculum
            </div>
            <div className="mt-1 text-lg font-bold text-brand">
              {(course.sections ?? []).length} current section(s)
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {submittedSectionCount ?? (course.sections ?? []).length} section(s) /{" "}
            {submittedLectureCount ?? getLectureCount(course)} lecture(s) in submitted package
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {(course.sections ?? []).length > 0 ? (
            course.sections?.map((section, sectionIndex) => (
              <div key={section.id} className="rounded-2xl border border-border/70 bg-secondary/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-brand">
                      Section {sectionIndex + 1}: {section.title}
                    </div>
                    {section.description ? (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {section.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {section.lectures.length} lecture(s)
                  </div>
                </div>

                {section.lectures.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {section.lectures.map((lecture, lectureIndex) => (
                      <LectureDetailCard
                        key={lecture.id}
                        lecture={lecture}
                        index={lectureIndex}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No lectures created in this section yet.
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No curriculum has been added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function LectureDetailCard({
  lecture,
  index,
}: {
  lecture: CourseLecture;
  index: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-medium text-foreground">
          {index + 1}. {lecture.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{lecture.type}</span>
          <span>{lecture.isPreview ? "Preview" : "Paid"}</span>
          <span>{lecture.isPublished ? "Published" : "Draft"}</span>
          <span>{formatDuration(lecture.durationSec)}</span>
        </div>
      </div>

      {lecture.description ? (
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-body">
          {lecture.description}
        </p>
      ) : null}

      {lecture.type === "article" && lecture.articleContent ? (
        <div className="mt-3 rounded-xl border border-border/70 bg-secondary/20 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Article content
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-body">
            {lecture.articleContent}
          </p>
        </div>
      ) : null}

      {lecture.videoUrl || (lecture.assets?.length ?? 0) > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {lecture.videoUrl ? (
            <a
              href={lecture.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium text-brand hover:underline"
            >
              Open lecture URL
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {(lecture.assets?.length ?? 0) > 0 ? (
            <span className="text-muted-foreground">
              {lecture.assets?.length ?? 0} attached resource(s)
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ModerationTimelineSection({
  history,
  submissions,
}: {
  history: CourseStatusHistoryEntry[];
  submissions: CourseReviewSubmissionEntry[];
}) {
  const latestDecision = useMemo(
    () => submissions.find((item) => item.status !== "pending" && item.status !== "in_review"),
    [submissions],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-bold text-brand">Moderation trail</h3>
      </div>

      {latestDecision?.decisionNote ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Latest admin decision note
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-body">
            {latestDecision.decisionNote}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-bold text-brand">Status history</div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {history.length} event(s)
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {history.length > 0 ? (
              history.map((entry) => (
                <div key={entry.id} className="relative pl-5">
                  <div className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-brand" />
                  <div className="text-sm font-semibold text-brand">
                    {formatModerationStatus(entry.fromStatus)} to{" "}
                    {formatModerationStatus(entry.toStatus)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </div>
                  {entry.reason ? (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-body">
                      {entry.reason}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No moderation history yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-bold text-brand">Review submissions</div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {submissions.length} submission(s)
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission.id} className="rounded-2xl border border-border/70 bg-secondary/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-semibold text-brand">Version {submission.version}</div>
                    <StatusBadge value={submission.status} />
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div>Submitted: {formatDateTime(submission.submittedAt)}</div>
                    <div>
                      Reviewed:{" "}
                      {submission.reviewedAt ? formatDateTime(submission.reviewedAt) : "N/A"}
                    </div>
                  </div>
                  {submission.decisionNote ? (
                    <>
                      <Separator className="my-3" />
                      <p className="whitespace-pre-line text-sm leading-6 text-body">
                        {submission.decisionNote}
                      </p>
                    </>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No submissions found for this course.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-medium text-brand">{value}</div>
    </div>
  );
}

function AssetPanel({
  title,
  url,
  emptyLabel,
}: {
  title: string;
  url?: string;
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          Open asset
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm font-semibold text-brand">{title}</div>
      {items.length > 0 ? (
        <div className="mt-3 space-y-2">
          {items.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="rounded-xl border border-border/70 bg-secondary/20 px-3 py-2 text-sm leading-6 text-body"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No information provided.</p>
      )}
    </div>
  );
}

function FaqCard({ faqs }: { faqs: NonNullable<Course["faqs"]> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm font-semibold text-brand">FAQs</div>
      {faqs.length > 0 ? (
        <div className="mt-3 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={`${faq.question}-${index}`}
              className="rounded-xl border border-border/70 bg-secondary/20 p-3"
            >
              <div className="font-medium text-foreground">{faq.question}</div>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-body">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No FAQs submitted.</p>
      )}
    </div>
  );
}

function CourseMessageCard({ course }: { course: Course }) {
  const welcomeMessage = course.message?.welcomeMessage?.trim();
  const congratulationsMessage = course.message?.congratulationsMessage?.trim();

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm font-semibold text-brand">Course messages</div>
      {welcomeMessage || congratulationsMessage ? (
        <div className="mt-3 space-y-3">
          <MessageBlock
            label="Welcome message"
            value={welcomeMessage || "No welcome message provided."}
          />
          <MessageBlock
            label="Congratulations message"
            value={congratulationsMessage || "No congratulations message provided."}
          />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No course messages configured.</p>
      )}
    </div>
  );
}

function MessageBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-secondary/20 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-body">{value}</p>
    </div>
  );
}

function getInstructorSubmissionNote(
  history: CourseStatusHistoryEntry[] | undefined,
  latestSubmission: CourseReviewSubmissionEntry | null,
) {
  const snapshotNote = latestSubmission?.contentSnapshot?.submissionNote?.trim();
  if (snapshotNote) {
    return snapshotNote;
  }

  const latestInstructorSubmission = history?.find(
    (entry) => entry.actorType === "instructor" && entry.toStatus === "pending_review",
  );

  return latestInstructorSubmission?.reason?.trim() || null;
}

function getLectureCount(course: Course): number {
  if (typeof course.totalLectures === "number" && course.totalLectures > 0) {
    return course.totalLectures;
  }

  return (course.sections ?? []).reduce(
    (sum, section) => sum + section.lectures.length,
    0,
  );
}

function formatCurrency(value: number | undefined, currency = "VND") {
  if (!value) return "Free";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDuration(totalDurationSec: number | undefined) {
  if (!totalDurationSec) return "N/A";

  const hours = Math.floor(totalDurationSec / 3600);
  const minutes = Math.round((totalDurationSec % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy HH:mm");
}

function formatModerationStatus(value: string | null | undefined) {
  if (!value) {
    return "new";
  }

  return value.replace(/_/g, " ");
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
