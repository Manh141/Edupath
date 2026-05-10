"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CircleAlert,
  Loader2,
  PlayCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CoursePricingPanel } from "@/components/instructor/CoursePricingPanel";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import {
  isEditableStatus,
  type Course,
  type CourseChecklistReport,
  type CourseStatusValue,
} from "@/types/course";
import { CourseStatusBadge } from "./CourseStatusBadge";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { IntendedLearnersStep } from "./steps/IntendedLearnersStep";
import { CurriculumStep } from "./steps/CurriculumStep";
import { MediaStep } from "./steps/MediaStep";
import { ReviewChecklistStep } from "./steps/ReviewChecklistStep";
import { SubmitStep } from "./steps/SubmitStep";
import {
  WIZARD_STEPS,
  getDefaultStep,
  isValidStep,
  type WizardStepId,
} from "./wizardSteps";

const STEP_QUERY_KEY = "step";

export function CourseWizardLayout({ courseId }: { courseId: string }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedStep = searchParams.get(STEP_QUERY_KEY);
  const activeStep: WizardStepId = isValidStep(requestedStep)
    ? requestedStep
    : getDefaultStep();

  const courseQuery = useQuery({
    queryKey: ["instructor-course", courseId],
    queryFn: () => instructorApi.getCourse(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  const checklistQuery = useQuery<CourseChecklistReport>({
    queryKey: ["course-checklist", courseId],
    queryFn: () => instructorApi.getChecklist(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  const setStep = (step: WizardStepId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(STEP_QUERY_KEY, step);
    startTransition(() => {
      router.replace(`/instructor/courses/${courseId}?${params.toString()}`);
    });
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: ["instructor-course", courseId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["course-checklist", courseId],
    });
  };

  const completionPercent = checklistQuery.data?.completionPercent ?? 0;
  const isLoading = courseQuery.isLoading;
  const course = courseQuery.data;

  if (isLoading) {
    return <WizardLoading />;
  }

  if (!course) {
    return <WizardNotFound />;
  }

  const editable = isEditableStatus(course.status);

  return (
    <div className="w-full px-4 py-8 sm:px-6 xl:px-8">
      <Link
        href="/instructor/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to my courses
      </Link>

      <CourseHeader
        course={course}
        completionPercent={completionPercent}
        canSubmit={Boolean(checklistQuery.data?.canSubmit)}
      />

      <ModerationNotice course={course} />

      <Separator className="my-6" />

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <WizardSidebar
          activeStep={activeStep}
          onSelect={setStep}
          checklist={checklistQuery.data}
        />

        <div className="min-w-0">
          {activeStep === "basic" && (
            <BasicInfoStep
              course={course}
              editable={editable}
              onChanged={invalidate}
              onNext={() => setStep("learners")}
            />
          )}
          {activeStep === "learners" && (
            <IntendedLearnersStep
              course={course}
              editable={editable}
              onChanged={invalidate}
              onPrev={() => setStep("basic")}
              onNext={() => setStep("curriculum")}
            />
          )}
          {activeStep === "curriculum" && (
            <CurriculumStep
              course={course}
              editable={editable}
              onChanged={invalidate}
              onPrev={() => setStep("learners")}
              onNext={() => setStep("media")}
            />
          )}
          {activeStep === "media" && (
            <MediaStep
              course={course}
              editable={editable}
              onChanged={invalidate}
              onPrev={() => setStep("curriculum")}
              onNext={() => setStep("pricing")}
            />
          )}
          {activeStep === "pricing" && (
            <PricingStep
              courseId={courseId}
              onPrev={() => setStep("media")}
              onNext={() => setStep("review")}
            />
          )}
          {activeStep === "review" && (
            <ReviewChecklistStep
              courseId={courseId}
              status={(course.status ?? "draft") as CourseStatusValue}
              onPrev={() => setStep("pricing")}
              onNext={() => setStep("submit")}
            />
          )}
          {activeStep === "submit" && (
            <SubmitStep
              courseId={courseId}
              course={course}
              checklist={checklistQuery.data}
              onChanged={invalidate}
              onPrev={() => setStep("review")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CourseHeader({
  course,
  completionPercent,
  canSubmit,
}: {
  course: Course;
  completionPercent: number;
  canSubmit: boolean;
}) {
  const status = course.status ?? "draft";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Course draft
          </p>
          <h1 className="mt-1 truncate font-display text-2xl font-bold text-foreground">
            {course.title || "Untitled course"}
          </h1>
        </div>
        <CourseStatusBadge status={status} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-muted-foreground">
            Course completion
          </span>
          <span className="font-semibold text-foreground">
            {completionPercent}%
          </span>
        </div>
        <Progress value={completionPercent} className="mt-3" />
        <p className="mt-2 text-xs text-muted-foreground">
          {canSubmit
            ? "All required checks passed — you can submit for review."
            : "Complete every required item below to enable Submit for review."}
        </p>
      </div>
    </div>
  );
}

function ModerationNotice({ course }: { course: Course }) {
  const status = (course.status ?? "draft").toLowerCase();

  if (status === "published") {
    return (
      <NoticeCard
        icon={<PlayCircle className="h-5 w-5 text-emerald-700" />}
        title="Course is live on EduPath"
        tone="emerald"
      >
        {`Your course has been approved and published${
          course.publishedAt ? ` on ${formatDateTime(course.publishedAt)}` : ""
        }.`}
      </NoticeCard>
    );
  }

  if (status === "approved") {
    return (
      <NoticeCard
        icon={<ShieldCheck className="h-5 w-5 text-sky-700" />}
        title="Course approved"
        tone="sky"
      >
        {`Your course has been approved by admin${
          course.approvedAt ? ` on ${formatDateTime(course.approvedAt)}` : ""
        }.`}
      </NoticeCard>
    );
  }

  if (status === "pending_review") {
    return (
      <NoticeCard
        icon={<CircleAlert className="h-5 w-5 text-amber-700" />}
        title="Course is under review"
        tone="amber"
      >
        {`Your latest submission is waiting for admin moderation${
          course.submittedAt ? ` since ${formatDateTime(course.submittedAt)}` : ""
        }.`}
      </NoticeCard>
    );
  }

  if (status === "changes_requested") {
    return (
      <NoticeCard
        icon={<CircleAlert className="h-5 w-5 text-orange-700" />}
        title="Changes requested"
        tone="orange"
      >
        {course.changesRequested ||
          "Admin requested updates before the course can move forward."}
      </NoticeCard>
    );
  }

  if (status === "rejected") {
    return (
      <NoticeCard
        icon={<XCircle className="h-5 w-5 text-rose-700" />}
        title="Course rejected"
        tone="rose"
      >
        {course.rejectedReason ||
          "Admin rejected this course without a detailed note."}
      </NoticeCard>
    );
  }

  return null;
}

function NoticeCard({
  icon,
  title,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "amber" | "emerald" | "orange" | "rose" | "sky";
  children: React.ReactNode;
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
          <p className="mt-1 whitespace-pre-line text-sm leading-6">{children}</p>
        </div>
      </div>
    </div>
  );
}

function WizardSidebar({
  activeStep,
  onSelect,
  checklist,
}: {
  activeStep: WizardStepId;
  onSelect: (step: WizardStepId) => void;
  checklist: CourseChecklistReport | undefined;
}) {
  const groupSummary = useMemo(() => {
    const map = new Map<string, { passed: number; total: number }>();
    if (checklist) {
      for (const group of checklist.groups) {
        map.set(group.group, { passed: group.passed, total: group.total });
      }
    }
    return map;
  }, [checklist]);

  const groupForStep: Partial<Record<WizardStepId, string>> = {
    basic: "basicInfo",
    learners: "intendedLearners",
    curriculum: "curriculum",
    media: "media",
    pricing: "pricing",
  };

  return (
    <aside className="space-y-1 self-start rounded-xl border border-border bg-card p-2 lg:sticky lg:top-20">
      {WIZARD_STEPS.map((step) => {
        const groupKey = groupForStep[step.id];
        const summary = groupKey ? groupSummary.get(groupKey) : undefined;
        const isActive = step.id === activeStep;
        const Icon = step.icon;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(step.id)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
              isActive
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block truncate font-medium">{step.label}</span>
              {summary && (
                <span className="block text-[11px] text-muted-foreground">
                  {summary.passed}/{summary.total} required
                </span>
              )}
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-50" />
          </button>
        );
      })}
    </aside>
  );
}

function PricingStep({
  courseId,
  onPrev,
  onNext,
}: {
  courseId: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div>
          <h2 className="font-heading text-xl font-black text-brand">
            Pricing and pre-instructor registration
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Complete seller onboarding, add payout details and save pricing
            before submitting the course for review.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <CoursePricingPanel courseId={courseId} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to media
        </Button>
        <Button type="button" variant="outline" onClick={onNext}>
          Continue to checklist
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function WizardLoading() {
  return (
    <div className="w-full px-4 py-16 sm:px-6 xl:px-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading course draft…
      </div>
    </div>
  );
}

function WizardNotFound() {
  return (
    <div className="w-full px-4 py-16 text-center sm:px-6 xl:px-8">
      <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 font-display text-lg font-semibold">
        Course not found
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The course you are trying to edit no longer exists or you do not have
        access.
      </p>
      <Link href="/instructor/courses" className="mt-4 inline-block">
        <Button variant="outline">Back to my courses</Button>
      </Link>
    </div>
  );
}

function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy HH:mm");
}
