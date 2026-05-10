"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Database,
  GraduationCap,
  Layers,
  LineChart,
  Monitor,
  Palette,
  PlayCircle,
  Smartphone,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  categories as demoCategories,
  courses as demoCourses,
} from "@/data/catalog";
import { courseApi } from "@/lib/course-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import { isInstructorUser } from "@/lib/auth-session";
import type { Enrollment } from "@/types/enrollment";
import type { Category, CourseListItem } from "@/types/course";

const categoryIconMap: Record<string, React.ReactNode> = {
  Frontend: <Monitor className="h-6 w-6" />,
  Backend: <BookOpen className="h-6 w-6" />,
  DevOps: <Layers className="h-6 w-6" />,
  Data: <Database className="h-6 w-6" />,
  Design: <Palette className="h-6 w-6" />,
  Mobile: <Smartphone className="h-6 w-6" />,
};

function getCategoryIcon(name: string): React.ReactNode {
  return categoryIconMap[name] ?? <Compass className="h-6 w-6" />;
}

function normalizeCourse(item: CourseListItem) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    thumbnailUrl: item.thumbnailUrl ?? null,
    price: item.price ?? 0,
    level: item.level ?? "Beginner",
    durationHours:
      item.durationHours ??
      (item.totalDuration ? Math.round(item.totalDuration / 60) : null),
    studentsCount: item.studentsCount ?? item.totalStudents ?? 0,
    averageRating: item.averageRating ?? 0,
    instructorName: item.instructorName,
    categoryName: item.categoryName,
  };
}

function deriveDisplayName(email: string | null | undefined): string {
  const localPart = email?.split("@")[0]?.trim();

  if (!localPart) {
    return "learner";
  }

  const [firstToken] = localPart.split(/[._-]/);
  const normalized = firstToken || localPart;

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getEnrollmentProgress(enrollment: Enrollment): number {
  return (
    enrollment.completionPercent ??
    enrollment.progress ??
    enrollment.courseProgress?.progressPercent ??
    0
  );
}

function ContinueLearningCard({ enrollment }: { enrollment: Enrollment }) {
  const progress = getEnrollmentProgress(enrollment);
  const title = enrollment.course?.title ?? enrollment.courseTitle ?? "Course";
  const instructorName =
    enrollment.course?.instructorName ?? enrollment.instructorName;
  const lectureCount =
    enrollment.course?.totalLectures ??
    enrollment.courseProgress?.totalLectures;
  const completedLectures = enrollment.courseProgress?.completedLectures ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cta">
            Continue learning
          </p>
          <h3 className="mt-2 line-clamp-2 font-heading text-lg font-semibold text-brand">
            {title}
          </h3>
          {instructorName ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {instructorName}
            </p>
          ) : null}
        </div>
        <div className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-brand">
          {Math.round(progress)}%
        </div>
      </div>
      <div className="mt-4">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{progress >= 100 ? "Completed" : "In progress"}</span>
          {lectureCount ? (
            <span>
              {completedLectures}/{lectureCount} lectures
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={`/learn/${enrollment.courseId}`}
          className="w-full sm:w-auto"
        >
          <Button variant="hero" size="sm" className="w-full sm:w-auto">
            <PlayCircle className="mr-1.5 h-4 w-4" />
            {progress >= 100 ? "Review course" : "Resume course"}
          </Button>
        </Link>
        {enrollment.course?.slug ? (
          <Link
            href={`/courses/${enrollment.course.slug}`}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View details
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Icon className="h-6 w-6 text-cta" />
      <p className="mt-4 font-heading text-3xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function StudentHomePage() {
  const { accessToken, currentUser, setActiveRole } = useAuth();
  const canTeach = isInstructorUser(currentUser);
  const displayName = deriveDisplayName(currentUser?.email);

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments", accessToken, "student-home"],
    queryFn: () =>
      enrollmentApi.listMyEnrollments(
        { limit: 6, sortBy: "updatedAt" },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
    staleTime: 60_000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", "student-home"],
    queryFn: () => courseApi.listCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", "student-home", "featured"],
    queryFn: () => courseApi.listCourses({ limit: 8, sortBy: "popular" }),
    staleTime: 2 * 60 * 1000,
  });

  const categories: Category[] = categoriesQuery.data
    ? Array.isArray(categoriesQuery.data)
      ? categoriesQuery.data
      : ((categoriesQuery.data as { items?: Category[] }).items ?? [])
    : demoCategories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      }));

  const rawCourses: CourseListItem[] = coursesQuery.data
    ? Array.isArray(coursesQuery.data)
      ? (coursesQuery.data as CourseListItem[])
      : ((coursesQuery.data as { items?: CourseListItem[] }).items ?? [])
    : demoCourses.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnailUrl: course.thumbnailUrl,
        price: course.price,
        level: course.level,
        durationHours: course.durationHours,
        studentsCount: course.studentsCount,
        averageRating: course.averageRating,
        instructorName: course.instructorName,
        categoryName: course.categoryName,
      }));

  const featuredCourses = rawCourses.slice(0, 8).map(normalizeCourse);
  const enrollments =
    enrollmentsQuery.data?.items ?? enrollmentsQuery.data?.data ?? [];
  const activeEnrollments = enrollments.filter(
    (enrollment) => getEnrollmentProgress(enrollment) < 100,
  );
  const completedEnrollments = enrollments.filter(
    (enrollment) => getEnrollmentProgress(enrollment) >= 100,
  );
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) => sum + getEnrollmentProgress(enrollment),
            0,
          ) / enrollments.length,
        )
      : 0;
  const heroEnrollment = activeEnrollments[0] ?? enrollments[0] ?? null;
  const continueLearning = activeEnrollments.slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,119,6,0.14),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(14,116,144,0.12),_transparent_38%)]" />
        <div className="container relative mx-auto grid gap-6 px-4 py-12 sm:gap-8 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-cta" />
              Student home
            </div>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight text-brand md:text-5xl lg:text-6xl">
              Welcome back, {displayName}.{" "}
              <span className="bg-cta-gradient bg-clip-text text-transparent">
                Keep your momentum.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Jump into your active courses, track your progress, and discover
              the next skill to add to your stack.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={
                  heroEnrollment
                    ? `/learn/${heroEnrollment.courseId}`
                    : "/courses"
                }
                className="w-full sm:w-auto"
              >
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  {heroEnrollment ? "Continue learning" : "Explore courses"}{" "}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/my-learning" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  Open My Learning
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-fade-in rounded-[24px] border border-border bg-background/80 p-5 shadow-card backdrop-blur-sm sm:rounded-[28px] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Snapshot
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-brand">
                  Your learning week
                </h2>
              </div>
              <div className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-brand">
                {averageProgress}% avg progress
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  Courses enrolled
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-brand">
                  {enrollmentsQuery.isLoading ? "-" : enrollments.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">In progress</p>
                <p className="mt-2 font-heading text-3xl font-bold text-brand">
                  {enrollmentsQuery.isLoading ? "-" : activeEnrollments.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="mt-2 font-heading text-3xl font-bold text-brand">
                  {enrollmentsQuery.isLoading
                    ? "-"
                    : completedEnrollments.length}
                </p>
              </div>
            </div>

            {heroEnrollment ? (
              <div className="mt-6 rounded-2xl border border-cta/20 bg-cta/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cta">
                  Next up
                </p>
                <p className="mt-2 font-heading text-lg font-semibold text-brand">
                  {heroEnrollment.course?.title ??
                    heroEnrollment.courseTitle ??
                    "Course"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {heroEnrollment.course?.instructorName ??
                    heroEnrollment.instructorName ??
                    "Instructor"}
                </p>
                <div className="mt-4">
                  <Progress
                    value={getEnrollmentProgress(heroEnrollment)}
                    className="h-2"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-4">
                <p className="font-medium text-foreground">
                  Start your first course
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the catalog and enroll in a course to build your
                  personalized learning path here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto grid gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon={BookOpen}
            label="Enrolled courses"
            value={enrollmentsQuery.isLoading ? "-" : enrollments.length}
          />
          <StatTile
            icon={LineChart}
            label="Average progress"
            value={enrollmentsQuery.isLoading ? "-" : `${averageProgress}%`}
          />
          <StatTile
            icon={PlayCircle}
            label="Active right now"
            value={enrollmentsQuery.isLoading ? "-" : activeEnrollments.length}
          />
          <StatTile
            icon={CheckCircle2}
            label="Completed"
            value={
              enrollmentsQuery.isLoading ? "-" : completedEnrollments.length
            }
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">
              Continue where you left off
            </h2>
            <p className="mt-1 text-muted-foreground">
              Your most recent active courses, ready to resume.
            </p>
          </div>
          <Link
            href="/my-learning"
            className="text-sm font-medium text-cta hover:underline"
          >
            View all {"->"}
          </Link>
        </div>

        {enrollmentsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-secondary"
              />
            ))}
          </div>
        ) : enrollmentsQuery.isError ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-medium text-foreground">
              Could not load your learning progress.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The enrollment service may be unavailable in this environment.
            </p>
          </div>
        ) : continueLearning.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-medium text-foreground">
              No active courses yet.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore the catalog and your next course will appear here.
            </p>
            <Link href="/courses" className="mt-5 inline-block">
              <Button variant="hero" size="sm">
                Explore courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {continueLearning.map((enrollment) => (
              <ContinueLearningCard
                key={enrollment.id}
                enrollment={enrollment}
              />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">
              Popular categories
            </h2>
            <p className="mt-1 text-muted-foreground">
              Choose the area you want to level up next.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium text-cta hover:underline"
          >
            View all {"->"}
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug ?? category.name.toLowerCase()}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cta/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-brand transition-colors group-hover:bg-cta/10 group-hover:text-cta">
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">
                Recommended for your next step
              </h2>
              <p className="mt-1 text-muted-foreground">
                {coursesQuery.isLoading
                  ? "Loading recommendations..."
                  : coursesQuery.isError
                    ? "Showing curated demo courses while course-service is offline."
                    : `${featuredCourses.length} picks to keep you moving.`}
              </p>
            </div>
            <Link
              href="/courses"
              className="text-sm font-medium text-cta hover:underline"
            >
              View all {"->"}
            </Link>
          </div>

          {coursesQuery.isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-xl bg-secondary"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-center sm:p-8 md:p-12 lg:p-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            <GraduationCap className="h-3.5 w-3.5" />
            Keep building
          </div>
          <h2 className="font-heading text-2xl font-bold text-white md:text-4xl">
            {canTeach
              ? "Ready to switch back to teaching mode?"
              : "Want to share your knowledge later?"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            {canTeach
              ? "Your student view stays separate. Jump into Instructor Studio whenever you want to create or manage courses."
              : "Stay focused on learning now, then activate your instructor profile when you are ready to publish your own courses."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href={canTeach ? "/instructor" : "/become-instructor"}
              onClick={canTeach ? () => setActiveRole("instructor") : undefined}
              className="w-full sm:w-auto"
            >
              <Button variant="warm" size="xl" className="w-full sm:w-auto">
                {canTeach ? "Open Instructor Studio" : "Become an instructor"}
              </Button>
            </Link>
            <Link href="/wishlist" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="xl"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Open wishlist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
