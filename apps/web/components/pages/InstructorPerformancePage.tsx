"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  instructorPerformanceApi,
  type InstructorPerformanceCourse,
} from "@/lib/communication-api";
import { cn } from "@/lib/utils";

const ALL_COURSES = "__all__";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function StatCard({
  label,
  value,
  hint,
  Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  Icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i <= filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

function RatingDistributionBars({
  distribution,
  percentages,
}: {
  distribution: Record<string | number, number>;
  percentages: Record<string | number, number>;
}) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating] ?? 0;
        const percent = percentages[rating] ?? 0;
        return (
          <div key={rating} className="flex items-center gap-3">
            <span className="w-8 text-xs font-medium text-muted-foreground">{rating}★</span>
            <div className="flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-amber-400"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-14 text-right text-xs text-muted-foreground">
              {count} ({percent.toFixed(0)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CourseDropdown({
  courses,
  value,
  onChange,
}: {
  courses: InstructorPerformanceCourse[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value={ALL_COURSES}>All my courses</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.title}
        </option>
      ))}
    </select>
  );
}

function PerformanceOverview() {
  const { accessToken } = useAuth();
  const overviewQuery = useQuery({
    queryKey: ["instructor-performance-overview"],
    queryFn: () => instructorPerformanceApi.overview(accessToken!),
    enabled: Boolean(accessToken),
  });

  const data = overviewQuery.data;

  if (overviewQuery.isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total courses"
          value={data.totals.totalCourses.toLocaleString()}
          Icon={BookOpen}
        />
        <StatCard
          label="Total students"
          value={data.totals.totalStudents.toLocaleString()}
          Icon={Users}
        />
        <StatCard
          label="Total reviews"
          value={data.totals.totalReviews.toLocaleString()}
          Icon={MessageSquare}
        />
        <StatCard
          label="Average rating"
          value={data.totals.averageRating > 0 ? data.totals.averageRating.toFixed(2) : "—"}
          hint={`${data.totals.totalReviews} reviews across all courses`}
          Icon={Star}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Rating distribution</h2>
            <StarRow value={data.totals.averageRating} />
          </div>
          <p className="text-sm text-muted-foreground">
            Across all courses · {data.totals.totalReviews} reviews
          </p>
          <div className="mt-4">
            <RatingDistributionBars
              distribution={data.ratingDistribution}
              percentages={data.ratingPercentages}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Top courses</h2>
          <p className="text-sm text-muted-foreground">
            Highest student count and rating
          </p>
          <ul className="mt-4 space-y-3">
            {data.topCourses.map((course) => (
              <li
                key={course.courseId}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {course.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.students} students · {course.totalReviews} reviews
                  </p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {course.averageRating > 0 ? course.averageRating.toFixed(2) : "—"}
                </Badge>
              </li>
            ))}
            {data.topCourses.length === 0 ? (
              <li className="text-sm text-muted-foreground">No courses yet.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Recent reviews</h2>
        <ul className="mt-4 divide-y divide-border">
          {data.recentReviews.map((review) => (
            <li key={review.id} className="flex items-start gap-3 py-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={review.userAvatarUrl || undefined} />
                <AvatarFallback>{getInitials(review.userDisplayName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{review.userDisplayName}</p>
                  <StarRow value={review.rating} />
                  <span className="text-xs text-muted-foreground">
                    · {review.courseTitle}
                  </span>
                </div>
                {review.title ? (
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {review.title}
                  </p>
                ) : null}
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                  {review.content || "No comment"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </li>
          ))}
          {data.recentReviews.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              No reviews yet.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}

function PerformanceStudents({ courses }: { courses: InstructorPerformanceCourse[] }) {
  const { accessToken } = useAuth();
  const [courseId, setCourseId] = useState(ALL_COURSES);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const studentsQuery = useQuery({
    queryKey: ["instructor-students", courseId, search, page],
    queryFn: () =>
      instructorPerformanceApi.students(accessToken!, {
        courseId: courseId === ALL_COURSES ? undefined : courseId,
        search: search.trim() || undefined,
        page,
        limit: 20,
      }),
    enabled: Boolean(accessToken),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <CourseDropdown courses={courses} value={courseId} onChange={(value) => {
            setCourseId(value);
            setPage(1);
          }} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students…"
              className="w-64 pl-8"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {studentsQuery.data?.meta.total ?? 0} students total
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Progress</th>
              <th className="px-4 py-3 text-right">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {studentsQuery.isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6">
                  <Skeleton className="h-12 w-full" />
                </td>
              </tr>
            ) : studentsQuery.data?.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No students found.
                </td>
              </tr>
            ) : (
              studentsQuery.data?.items.map((row) => (
                <tr key={`${row.userId}-${row.courseId}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={row.avatarUrl || undefined} />
                        <AvatarFallback>{getInitials(row.displayName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{row.displayName}</p>
                        {row.email ? (
                          <p className="text-xs text-muted-foreground">{row.email}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{row.courseTitle}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        row.status === "completed"
                          ? "secondary"
                          : row.status === "active"
                            ? "default"
                            : "outline"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.progressPercent !== undefined
                      ? `${Math.round(row.progressPercent)}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatDate(row.enrolledAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {studentsQuery.data && studentsQuery.data.meta.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {studentsQuery.data.meta.page} of {studentsQuery.data.meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={!studentsQuery.data.meta.hasPrev}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => value + 1)}
              disabled={!studentsQuery.data.meta.hasNext}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PerformanceReviews({ courses }: { courses: InstructorPerformanceCourse[] }) {
  const { accessToken } = useAuth();
  const [courseId, setCourseId] = useState(ALL_COURSES);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "rating_desc" | "rating_asc">("latest");
  const [page, setPage] = useState(1);

  const reviewsQuery = useQuery({
    queryKey: ["instructor-reviews", courseId, rating, search, sort, page],
    queryFn: () =>
      instructorPerformanceApi.reviews(accessToken!, {
        courseId: courseId === ALL_COURSES ? undefined : courseId,
        rating,
        search: search.trim() || undefined,
        sort,
        page,
        limit: 20,
      }),
    enabled: Boolean(accessToken),
  });

  const distributionQuery = useQuery({
    queryKey: ["instructor-rating-distribution", courseId],
    queryFn: () =>
      instructorPerformanceApi.ratingDistribution(
        accessToken!,
        courseId === ALL_COURSES ? undefined : courseId,
      ),
    enabled: Boolean(accessToken),
  });

  const distribution = distributionQuery.data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <CourseDropdown
          courses={courses}
          value={courseId}
          onChange={(value) => {
            setCourseId(value);
            setPage(1);
          }}
        />
        <select
          value={rating ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            setRating(value === "" ? undefined : Number(value));
            setPage(1);
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="latest">Newest first</option>
          <option value="rating_desc">Highest rated</option>
          <option value="rating_asc">Lowest rated</option>
        </select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews…"
            className="w-72 pl-8"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Average rating</h2>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-4xl font-bold text-foreground">
              {distribution?.averageRating?.toFixed(2) ?? "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              from {distribution?.totalReviews ?? 0} reviews
            </p>
          </div>
          <div className="mt-2">
            <StarRow value={distribution?.averageRating ?? 0} />
          </div>
          <div className="mt-6">
            {distribution ? (
              <RatingDistributionBars
                distribution={distribution.ratingDistribution}
                percentages={distribution.ratingPercentages}
              />
            ) : (
              <Skeleton className="h-20 w-full" />
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <ul className="divide-y divide-border">
            {reviewsQuery.isLoading ? (
              <li className="p-6">
                <Skeleton className="h-16 w-full" />
              </li>
            ) : reviewsQuery.data?.items.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted-foreground">
                No reviews match these filters.
              </li>
            ) : (
              reviewsQuery.data?.items.map((review) => (
                <li key={review.id} className="flex items-start gap-3 p-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={review.userAvatarUrl || undefined} />
                    <AvatarFallback>{getInitials(review.userDisplayName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{review.userDisplayName}</p>
                      <StarRow value={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        · {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.title ? (
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {review.title}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.content || "No comment."}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
          {reviewsQuery.data && reviewsQuery.data.meta.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Page {reviewsQuery.data.meta.page} of {reviewsQuery.data.meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={!reviewsQuery.data.meta.hasPrev}
                  className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => value + 1)}
                  disabled={!reviewsQuery.data.meta.hasNext}
                  className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default function InstructorPerformancePage() {
  const { accessToken } = useAuth();
  const coursesQuery = useQuery({
    queryKey: ["instructor-performance-courses"],
    queryFn: () => instructorPerformanceApi.myCourses(accessToken!),
    enabled: Boolean(accessToken),
  });

  const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10 xl:px-8">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Instructor Studio
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Track students, reviews, and rating distribution across the courses you teach.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <PerformanceOverview />
        </TabsContent>
        <TabsContent value="students" className="mt-6">
          <PerformanceStudents courses={courses} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <PerformanceReviews courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
