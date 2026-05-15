"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Download,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { courseApi } from "@/lib/course-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import type { CourseLecture, CourseSection } from "@/types/course";
import type { Enrollment } from "@/types/enrollment";

const EMPTY_SECTIONS: CourseSection[] = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isCompleted(enrollment: Enrollment | undefined, lectureId: string) {
  return enrollment?.lectureProgresses?.some(
    (p) => p.lectureId === lectureId && p.isCompleted,
  ) ?? false;
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getLectureTypeLabel(type: CourseLecture["type"]) {
  switch (type) {
    case "article":
      return "Article";
    case "resource":
      return "Resource";
    case "video":
    default:
      return "Video";
  }
}

function getLectureDisplayType(lecture: CourseLecture): CourseLecture["type"] {
  if (lecture.type === "video" && lecture.videoUrl) {
    return "video";
  }

  if (lecture.type === "article" && lecture.articleContent?.trim()) {
    return "article";
  }

  if (lecture.type === "resource" && (lecture.assets?.length ?? 0) > 0) {
    return "resource";
  }

  if (lecture.videoUrl) {
    return "video";
  }

  if (lecture.articleContent?.trim()) {
    return "article";
  }

  if ((lecture.assets?.length ?? 0) > 0) {
    return "resource";
  }

  return lecture.type ?? "video";
}

// ─── Sidebar item ─────────────────────────────────────────────────────────────

function LectureItem({
  lecture,
  completed,
  active,
  locked,
  onClick,
}: {
  lecture: CourseLecture;
  completed: boolean;
  active: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors text-sm ${
        active
          ? "bg-brand/10 text-brand font-medium"
          : locked
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-secondary text-foreground"
      }`}
    >
      <span className="mt-0.5 shrink-0">
        {completed ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : locked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : active ? (
          <PlayCircle className="h-4 w-4 text-brand" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
      <span className="flex-1 line-clamp-2 leading-snug">{lecture.title}</span>
      {lecture.duration && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDuration(lecture.duration)}
        </span>
      )}
    </button>
  );
}

// ─── Section accordion ────────────────────────────────────────────────────────

function SectionAccordion({
  section,
  enrollment,
  activeLectureId,
  onSelect,
}: {
  section: CourseSection;
  enrollment: Enrollment | undefined;
  activeLectureId: string | null;
  onSelect: (lecture: CourseLecture) => void;
}) {
  const [open, setOpen] = useState<boolean>(
    () => section.lectures.some((l) => l.id === activeLectureId) || true,
  );

  const completedCount = section.lectures.filter((l) =>
    isCompleted(enrollment, l.id),
  ).length;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-secondary transition-colors"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 text-sm font-semibold text-brand line-clamp-2">
          {section.title}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {completedCount}/{section.lectures.length}
        </span>
      </button>
      {open && (
        <div className="px-2 pb-2">
          {section.lectures.map((lecture) => (
            <LectureItem
              key={lecture.id}
              lecture={lecture}
              completed={isCompleted(enrollment, lecture.id)}
              active={activeLectureId === lecture.id}
              locked={false}
              onClick={() => onSelect(lecture)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LearningPage({ courseId }: { courseId: string }) {
  const { accessToken } = useAuth();

  const enrollmentQuery = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentApi.getEnrollmentByCourse(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  const enrollment = enrollmentQuery.data;
  const learningCourseSlug = enrollment?.courseSlug ?? enrollment?.course?.slug;
  const courseIdentifier = learningCourseSlug ?? courseId;

  const courseQuery = useQuery({
    queryKey: ["course-learn", courseIdentifier],
    queryFn: () => courseApi.getCourseBySlug(courseIdentifier),
    enabled:
      Boolean(courseIdentifier) &&
      (Boolean(learningCourseSlug) ||
        enrollmentQuery.isSuccess ||
        enrollmentQuery.isError),
  });

  const course = courseQuery.data;
  const sections = course?.sections ?? EMPTY_SECTIONS;

  // Flat list of all lectures
  const allLectures = useMemo(
    () => sections.flatMap((s) => s.lectures),
    [sections],
  );

  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(
    null,
  );

  const defaultLectureId = useMemo(() => {
    const last =
      enrollment?.courseProgress?.lastLectureId ?? enrollment?.lastLectureId;

    if (last && allLectures.some((lecture) => lecture.id === last)) {
      return last;
    }

    return allLectures[0]?.id ?? null;
  }, [
    allLectures,
    enrollment?.courseProgress?.lastLectureId,
    enrollment?.lastLectureId,
  ]);

  const activeLectureId =
    selectedLectureId &&
    allLectures.some((lecture) => lecture.id === selectedLectureId)
      ? selectedLectureId
      : defaultLectureId;

  const activeLecture = allLectures.find((l) => l.id === activeLectureId);
  const activeLectureDisplayType = activeLecture
    ? getLectureDisplayType(activeLecture)
    : "video";
  const currentIdx = allLectures.findIndex((l) => l.id === activeLectureId);
  const prevLecture = currentIdx > 0 ? allLectures[currentIdx - 1] : null;
  const nextLecture =
    currentIdx < allLectures.length - 1 ? allLectures[currentIdx + 1] : null;

  const completedCount = allLectures.filter((l) =>
    isCompleted(enrollment, l.id),
  ).length;
  const progressPct =
    allLectures.length > 0
      ? Math.round((completedCount / allLectures.length) * 100)
      : 0;

  const progressMutation = useMutation({
    mutationFn: (lecture: CourseLecture) => {
      const durationSec = lecture.durationSec ?? lecture.duration ?? 0;

      return enrollmentApi.updateProgress(
        {
          courseId,
          lectureId: lecture.id,
          progressSec: Math.max(durationSec, 1),
          durationSec,
          isCompleted: true,
          totalLectures: allLectures.length,
        },
        accessToken!,
      );
    },
    onSuccess: () => {
      void enrollmentQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to save progress.");
    },
  });

  const markComplete = useCallback(
    (lecture: CourseLecture) => {
      if (!isCompleted(enrollment, lecture.id)) {
        progressMutation.mutate(lecture);
      }
    },
    [enrollment, progressMutation],
  );

  const handleNext = () => {
    if (activeLecture) markComplete(activeLecture);
    if (nextLecture) setSelectedLectureId(nextLecture.id);
  };

  const isLoading = enrollmentQuery.isLoading || courseQuery.isLoading;

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-4 gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="font-heading font-semibold text-brand line-clamp-1 flex-1">
            {course?.title ?? "Loading…"}
          </span>
          <div className="hidden sm:flex items-center gap-2">
            <Progress value={progressPct} className="h-2 w-32" />
            <span className="text-xs text-muted-foreground">
              {progressPct}% complete
            </span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              </div>
            ) : !activeLecture ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <PlayCircle className="h-12 w-12 text-muted-foreground" />
                <p className="font-medium text-foreground">
                  No lectures available.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Lecture content area */}
                {activeLectureDisplayType === "video" ? (
                  <div className="w-full bg-black">
                    {activeLecture.videoUrl ? (
                      <div className="mx-auto max-w-4xl aspect-video">
                        <video
                          key={activeLecture.videoUrl}
                          src={activeLecture.videoUrl}
                          controls
                          className="h-full w-full"
                          onEnded={() => {
                            if (activeLecture) markComplete(activeLecture);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex aspect-video max-w-4xl items-center justify-center">
                        <div className="text-center text-white/60">
                          <PlayCircle className="mx-auto mb-3 h-16 w-16" />
                          <p className="text-sm">
                            No video available for this lecture.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeLectureDisplayType === "article" ? (
                  <div className="border-b border-border bg-card">
                    <div className="mx-auto w-full max-w-4xl px-6 py-10">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        Article lesson
                      </div>
                      <div className="rounded-2xl border border-border bg-background p-6">
                        {activeLecture.articleContent?.trim() ? (
                          <div className="whitespace-pre-line text-sm leading-7 text-foreground">
                            {activeLecture.articleContent}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No article content available for this lecture.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-border bg-card">
                    <div className="mx-auto w-full max-w-4xl px-6 py-10">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Download className="h-3.5 w-3.5" />
                        Resource lesson
                      </div>
                      <div className="rounded-2xl border border-border bg-background p-6">
                        {activeLecture.assets && activeLecture.assets.length > 0 ? (
                          <div className="space-y-3">
                            {activeLecture.assets.map((asset) => (
                              <a
                                key={asset.id}
                                href={asset.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition hover:bg-secondary"
                              >
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">
                                    {asset.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {asset.mimeType || asset.fileType}
                                  </p>
                                </div>
                                <Download className="h-4 w-4 shrink-0 text-brand" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No resources available for this lecture.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lecture info */}
                <div className="mx-auto w-full max-w-4xl px-6 py-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        {getLectureTypeLabel(activeLectureDisplayType)}
                      </div>
                      <h1 className="font-heading text-xl font-bold text-brand">
                        {activeLecture.title}
                      </h1>
                      {activeLecture.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {activeLecture.description}
                        </p>
                      )}
                    </div>
                    {isCompleted(enrollment, activeLectureId ?? "") ? (
                      <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          activeLecture && markComplete(activeLecture)
                        }
                        disabled={progressMutation.isPending}
                      >
                        Mark as complete
                      </Button>
                    )}
                  </div>

                  <Separator className="my-5" />

                  {activeLectureDisplayType !== "resource" &&
                  activeLecture.assets &&
                  activeLecture.assets.length > 0 ? (
                    <>
                      <div>
                        <h2 className="text-sm font-semibold text-foreground">
                          Lecture resources
                        </h2>
                        <div className="mt-3 space-y-3">
                          {activeLecture.assets.map((asset) => (
                            <a
                              key={asset.id}
                              href={asset.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition hover:bg-secondary"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {asset.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {asset.mimeType || asset.fileType}
                                </p>
                              </div>
                              <Download className="h-4 w-4 shrink-0 text-brand" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-5" />
                    </>
                  ) : null}

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!prevLecture}
                      onClick={() =>
                        prevLecture && setSelectedLectureId(prevLecture.id)
                      }
                    >
                      ← Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {currentIdx + 1} / {allLectures.length}
                    </span>
                    <Button
                      variant={nextLecture ? "hero" : "outline"}
                      size="sm"
                      disabled={!nextLecture}
                      onClick={handleNext}
                    >
                      {nextLecture ? "Next →" : "Finished"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Curriculum sidebar */}
          <aside className="hidden w-80 shrink-0 border-l border-border bg-card lg:flex lg:flex-col">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-brand">Curriculum</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedCount} / {allLectures.length} lectures completed
              </p>
              <Progress value={progressPct} className="h-1.5 mt-2" />
            </div>
            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 animate-pulse rounded-lg bg-secondary"
                    />
                  ))}
                </div>
              ) : sections.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No curriculum available.
                </div>
              ) : (
                <div className="py-2">
                  {sections.map((section) => (
                    <SectionAccordion
                      key={section.id}
                      section={section}
                      enrollment={enrollment}
                      activeLectureId={activeLectureId}
                      onSelect={(lecture) => setSelectedLectureId(lecture.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>
        </div>
      </div>
    </ProtectedRoute>
  );
}
