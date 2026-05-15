"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, instructorApi } from "@/lib/course-api";
import {
  isDeletableStatus,
  type CourseListItem,
} from "@/types/course";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-500",
};

type InstructorCourseRow = CourseListItem & { status?: string };

function CourseRow({
  course,
  deleteDisabled,
  isDeleting,
  onDelete,
}: {
  course: InstructorCourseRow;
  deleteDisabled: boolean;
  isDeleting: boolean;
  onDelete: (course: InstructorCourseRow) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = (course.status ?? "draft").toLowerCase();
  const students = course.totalStudents ?? course.studentsCount ?? 0;
  const canDelete = isDeletableStatus(course.status);
  const title = course.title?.trim() || "Untitled course";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <Link
        href={`/instructor/courses/${course.id}`}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient">
          <BookOpen className="h-5 w-5 text-white/80" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 font-heading font-semibold text-brand">
            {title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {students > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {students.toLocaleString()} students
              </span>
            )}
            {course.totalLectures && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.totalLectures} lectures
              </span>
            )}
            {course.categoryName && (
              <span className="text-muted-foreground">{course.categoryName}</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Badge
            className={
              STATUS_COLORS[status] ?? "bg-secondary text-muted-foreground"
            }
            variant="secondary"
          >
            {status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
          </Badge>
          <span className="font-heading font-bold text-brand">
            {(course.price ?? 0) === 0
              ? "Free"
              : `$${(course.price ?? 0).toLocaleString()}`}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Link>

      {canDelete ? (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={deleteDisabled}
              className="shrink-0 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive sm:self-center"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-medium text-foreground">{title}</span>{" "}
                will be removed from your instructor workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteDisabled}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  setConfirmOpen(false);
                  onDelete(course);
                }}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}

export default function InstructorCoursesPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const coursesQuery = useQuery({
    queryKey: [
      "instructor-courses",
      { page, pageSize, search: debouncedSearch },
    ],
    queryFn: () =>
      instructorApi.listMyCourses(
        {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  const courses = coursesQuery.data?.items ?? [];
  const total = coursesQuery.data?.total ?? courses.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const deleteMutation = useMutation({
    mutationFn: (course: InstructorCourseRow) =>
      instructorApi.deleteCourse(course.id, accessToken!),
    onSuccess: (_, course) => {
      if (courses.length === 1 && page > 1) {
        setPage((currentPage) => Math.max(1, currentPage - 1));
      }
      void queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success(`Deleted "${course.title?.trim() || "Untitled course"}".`);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete course.",
      );
    },
  });

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10 xl:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand">
            My Courses
          </h1>
          {!coursesQuery.isLoading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {total} course{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link href="/instructor/courses/new">
          <Button variant="hero" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New course
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search my courses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator className="mb-6" />

      {coursesQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-secondary"
            />
          ))}
        </div>
      ) : coursesQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-destructive">Failed to load courses.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => coursesQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-foreground">
            {debouncedSearch ? "No courses match your search." : "No courses yet."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {debouncedSearch
              ? "Try a different keyword or clear the search."
              : "Create your first course to start teaching on EduPath."}
          </p>
          {!debouncedSearch ? (
            <Link href="/instructor/courses/new" className="mt-4 inline-block">
              <Button variant="hero" size="sm">
                Create your first course
              </Button>
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {courses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                deleteDisabled={deleteMutation.isPending}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables?.id === course.id
                }
                onDelete={(selectedCourse) =>
                  deleteMutation.mutate(selectedCourse)
                }
              />
            ))}
          </div>

          <DataPagination
            className="mt-6"
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            itemLabel="courses"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            disabled={coursesQuery.isFetching}
          />
        </>
      )}
    </div>
  );
}
