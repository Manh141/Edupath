"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, FolderTree, Loader2, PlayCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminCell, AdminDataTable } from "@/components/admin/data-table";
import { CourseModerationActions } from "@/components/admin/course-moderation-actions";
import { AdminFilterToolbar } from "@/components/admin/filter-toolbar";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { adminCoursesApi } from "@/lib/admin-api";
import type { CourseListItem } from "@/types/course";

type AdminCourseRow = CourseListItem & {
  status?: string;
  updatedAt?: string;
  instructorName?: string;
};

function CourseRow({ course }: { course: AdminCourseRow }) {
  const status = (course.status ?? "draft").toLowerCase();

  return (
    <TableRow>
      <AdminCell>
        <div className="max-w-[320px]">
          <div className="line-clamp-2 font-semibold text-brand">{course.title}</div>
          <div className="text-xs text-muted-foreground">{course.id.slice(-8)}</div>
        </div>
      </AdminCell>
      <AdminCell>{course.categoryName ?? "N/A"}</AdminCell>
      <AdminCell>{course.instructorName ?? "N/A"}</AdminCell>
      <AdminCell>{course.totalLectures ?? 0}</AdminCell>
      <AdminCell>
        <StatusBadge value={status} />
      </AdminCell>
      <AdminCell>
        {course.updatedAt ? format(new Date(course.updatedAt), "MMM d, yyyy") : "N/A"}
      </AdminCell>
      <AdminCell>
        <CourseModerationActions course={course} />
      </AdminCell>
    </TableRow>
  );
}

export default function AdminCoursesPage() {
  const { accessToken } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");

  const coursesQuery = useQuery({
    queryKey: ["admin-courses", { search, page, pageSize, status: statusFilter }],
    queryFn: () =>
      adminCoursesApi.listCourses(
        {
          search: search || undefined,
          page,
          limit: pageSize,
          status: statusFilter || undefined,
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  const courses = (coursesQuery.data?.items ?? coursesQuery.data?.data ?? []) as AdminCourseRow[];
  const total =
    coursesQuery.data?.meta?.total ?? coursesQuery.data?.total ?? courses.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content ops"
        title="Course management"
        description="Open course details and moderate submitted courses with Reject or Approve & Publish."
        actions={
          <Select
            value={statusFilter || "_all"}
            onValueChange={(value) => {
              setStatusFilter(value === "_all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="pending_review">Pending review</SelectItem>
              <SelectItem value="changes_requested">Changes requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <AdminFilterToolbar
        placeholder="Search by course title, instructor or category..."
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {coursesQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : coursesQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="font-medium text-destructive">Failed to load courses.</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => coursesQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <AdminDataTable
            headers={["Course", "Category", "Instructor", "Lectures", "Status", "Updated", "Actions"]}
          >
            {courses.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
          </AdminDataTable>

          <DataPagination
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

      <div className="grid gap-4 md:grid-cols-3">
        <MiniFeature
          icon={<Eye className="h-5 w-5" />}
          title="Review queue"
          text="Pending courses are filtered from course-service moderation status."
        />
        <MiniFeature
          icon={<PlayCircle className="h-5 w-5" />}
          title="Publish pipeline"
          text="Approve and publish actions call the same backend state machine."
        />
        <MiniFeature
          icon={<FolderTree className="h-5 w-5" />}
          title="Content structure"
          text="Lecture counts come from section and lecture records."
        />
      </div>
    </div>
  );
}

function MiniFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="admin-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-brand">
        {icon}
      </div>
      <div className="mt-4 text-lg font-bold">{title}</div>
      <p className="mt-2 text-sm leading-7 text-body">{text}</p>
    </div>
  );
}
