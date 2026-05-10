"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PartyPopper,
  PlayCircle,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { enrollmentApi } from "@/lib/enrollment-api";
import type { Enrollment } from "@/types/enrollment";

type LearningFilter = "all" | "in-progress" | "completed";

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const course = enrollment.course;
  const progressValue =
    enrollment.completionPercent ??
    enrollment.progress ??
    enrollment.courseProgress?.progressPercent ??
    0;
  const isCompleted = progressValue >= 100;
  const thumbnail = course?.thumbnailUrl ?? enrollment.courseThumbnailUrl;
  const title = course?.title ?? enrollment.courseTitle ?? "Untitled course";
  const instructor = course?.instructorName ?? enrollment.instructorName;
  const totalLectures =
    course?.totalLectures ?? enrollment.courseProgress?.totalLectures;
  const completedLectures = enrollment.courseProgress?.completedLectures;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      <Link
        href={`/learn/${enrollment.courseId}`}
        className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-44"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={225}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
            <BookOpen className="h-6 w-6 text-white/80" />
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/learn/${enrollment.courseId}`}
              className="line-clamp-2 font-heading font-semibold text-brand hover:text-cta"
            >
              {title}
            </Link>
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={
                isCompleted
                  ? "shrink-0 bg-emerald-600 text-white"
                  : "shrink-0"
              }
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                </>
              ) : (
                `${Math.round(progressValue)}%`
              )}
            </Badge>
          </div>
          {instructor ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{instructor}</p>
          ) : null}
          {totalLectures ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {completedLectures ?? 0}/{totalLectures} lectures completed
            </p>
          ) : null}
        </div>
        <div>
          <Progress value={progressValue} className="h-1.5" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={`/learn/${enrollment.courseId}`}>
              <Button variant="hero" size="sm">
                <PlayCircle className="mr-1.5 h-4 w-4" />
                {progressValue === 0
                  ? "Bắt đầu học"
                  : isCompleted
                    ? "Xem lại"
                    : "Tiếp tục học"}
              </Button>
            </Link>
            {course?.slug ? (
              <Link href={`/courses/${course.slug}`}>
                <Button variant="outline" size="sm">
                  Chi tiết khóa học
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyLearningPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "success";
  const [filter, setFilter] = useState<LearningFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [successBannerDismissed, setSuccessBannerDismissed] = useState(false);
  const showSuccessBanner = justPaid && !successBannerDismissed;
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm]);

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments", { page, pageSize, search: debouncedSearch }],
    queryFn: () =>
      enrollmentApi.listMyEnrollments(
        {
          page,
          limit: pageSize,
          sortBy: "updatedAt",
          searchTerm: debouncedSearch.trim() || undefined,
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    if (!justPaid) return;
    void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    void queryClient.invalidateQueries({ queryKey: ["cart"] });
    void queryClient.invalidateQueries({ queryKey: ["cart-count"] });
  }, [justPaid, queryClient]);

  const pageEnrollments =
    enrollmentsQuery.data?.items ?? enrollmentsQuery.data?.data ?? [];
  const total = enrollmentsQuery.data?.total ?? pageEnrollments.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filteredEnrollments = pageEnrollments.filter((enrollment) => {
    const progress =
      enrollment.completionPercent ??
      enrollment.progress ??
      enrollment.courseProgress?.progressPercent ??
      0;
    const isCompleted = progress >= 100;

    if (filter === "in-progress" && isCompleted) return false;
    if (filter === "completed" && !isCompleted) return false;

    return true;
  });

  const pageInProgressCount = pageEnrollments.filter((e) => {
    const p =
      e.completionPercent ?? e.progress ?? e.courseProgress?.progressPercent ?? 0;
    return p < 100;
  }).length;
  const pageCompletedCount = pageEnrollments.length - pageInProgressCount;

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {showSuccessBanner ? (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-500/40 bg-emerald-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-900">
                <span className="font-semibold">Thanh toán thành công!</span>{" "}
                Các khóa học đã được thêm vào My Learning. Chọn một khóa học
                bên dưới để bắt đầu học.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  Tiếp tục mua
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Dismiss"
                onClick={() => setSuccessBannerDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-brand">
              <GraduationCap className="h-7 w-7" />
              My Learning
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tất cả khóa học bạn đã mua và đang theo học.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Duyệt thêm khóa học
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All ({total})
            </FilterButton>
            <FilterButton
              active={filter === "in-progress"}
              onClick={() => setFilter("in-progress")}
            >
              In progress ({pageInProgressCount})
            </FilterButton>
            <FilterButton
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Completed ({pageCompletedCount})
            </FilterButton>
          </div>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm khóa học..."
              className="pl-9"
            />
          </div>
        </div>

        {enrollmentsQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : enrollmentsQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-destructive">
              Không tải được danh sách khóa học.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => enrollmentsQuery.refetch()}
            >
              Thử lại
            </Button>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {total === 0
                ? "Bạn chưa đăng ký khóa học nào."
                : "Không có khóa học nào khớp với bộ lọc."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {total === 0
                ? "Khám phá catalog và mua khóa học để bắt đầu học."
                : "Thử đổi bộ lọc hoặc xóa từ khóa tìm kiếm."}
            </p>
            {total === 0 ? (
              <Link href="/courses" className="mt-4 inline-block">
                <Button variant="hero" size="sm">
                  Duyệt khóa học
                </Button>
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>

            <DataPagination
              className="mt-6"
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              itemLabel="enrollments"
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              disabled={enrollmentsQuery.isFetching}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-brand text-white"
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      }`}
    >
      {children}
    </button>
  );
}
