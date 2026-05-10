"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Database,
  GraduationCap,
  Layers,
  Monitor,
  Palette,
  Smartphone,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/CourseCard";
import StudentHomePage from "@/components/pages/StudentHomePage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { courseApi } from "@/lib/course-api";
import {
  ADMIN_HOME,
  INSTRUCTOR_HOME,
  isAdminUser,
  isInstructorUser,
} from "@/lib/auth-session";
import { categories as demoCategories, courses as demoCourses } from "@/data/catalog";
import type { Category, CourseListItem } from "@/types/course";

const categoryIconMap: Record<string, React.ReactNode> = {
  Frontend: <Monitor className="h-6 w-6" />,
  Backend: <Code2 className="h-6 w-6" />,
  DevOps: <Layers className="h-6 w-6" />,
  Data: <Database className="h-6 w-6" />,
  Design: <Palette className="h-6 w-6" />,
  Mobile: <Smartphone className="h-6 w-6" />,
};

function getCategoryIcon(name: string): React.ReactNode {
  return categoryIconMap[name] ?? <BookOpen className="h-6 w-6" />;
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

export default function HomePage() {
  const router = useRouter();
  const { loading, isAuthenticated, currentUser, activeRole } = useAuth();

  const isAdmin = isAdminUser(currentUser);
  const isInstructor = isInstructorUser(currentUser);
  const shouldRedirectToAdmin = isAuthenticated && isAdmin;
  const shouldRedirectToInstructor =
    isAuthenticated && isInstructor && activeRole === "instructor";
  const shouldShowStudentLanding =
    isAuthenticated && !shouldRedirectToAdmin && !shouldRedirectToInstructor;
  const shouldShowGuestLanding = !loading && !isAuthenticated;

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseApi.listCategories(),
    staleTime: 5 * 60 * 1000,
    enabled: shouldShowGuestLanding,
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: () => courseApi.listCourses({ limit: 8, sortBy: "popular" }),
    staleTime: 2 * 60 * 1000,
    enabled: shouldShowGuestLanding,
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    if (shouldRedirectToAdmin) {
      router.replace(ADMIN_HOME);
      return;
    }

    if (shouldRedirectToInstructor) {
      router.replace(INSTRUCTOR_HOME);
    }
  }, [
    loading,
    router,
    shouldRedirectToAdmin,
    shouldRedirectToInstructor,
  ]);

  if (loading || shouldRedirectToAdmin || shouldRedirectToInstructor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (shouldShowStudentLanding) {
    return <StudentHomePage />;
  }

  const categories: Category[] = categoriesQuery.data
    ? Array.isArray(categoriesQuery.data)
      ? categoriesQuery.data
      : (categoriesQuery.data as { items?: Category[] }).items ?? []
    : demoCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
      }));

  const rawCourses: CourseListItem[] = coursesQuery.data
    ? Array.isArray(coursesQuery.data)
      ? (coursesQuery.data as CourseListItem[])
      : (coursesQuery.data as { items?: CourseListItem[] }).items ?? []
    : demoCourses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        thumbnailUrl: c.thumbnailUrl,
        price: c.price,
        level: c.level,
        durationHours: c.durationHours,
        studentsCount: c.studentsCount,
        averageRating: c.averageRating,
        instructorName: c.instructorName,
        categoryName: c.categoryName,
      }));

  const featuredCourses = rawCourses.slice(0, 8).map(normalizeCourse);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-card">
        <div className="container mx-auto flex flex-col-reverse items-center gap-8 px-4 py-16 md:flex-row md:py-24">
          <div className="flex-1 animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-cta" />
              Online Learning Platform
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-brand md:text-5xl lg:text-6xl">
              Learn anything,{" "}
              <span className="bg-cta-gradient bg-clip-text text-transparent">
                anytime, anywhere
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Explore hundreds of practical courses across Frontend, Backend,
              DevOps, Data, and Design — taught by industry experts and built
              for real-world outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses">
                <Button variant="hero" size="xl">
                  Explore courses <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button variant="outline" size="xl">
                  Create free account
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="flex-1 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Image
              src="/hero-illustration.jpg"
              alt="EduPath online learning platform"
              width={1280}
              height={960}
              className="w-full rounded-2xl"
              priority
              onError={() => {}}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">
              Popular categories
            </h2>
            <p className="mt-1 text-muted-foreground">
              Pick the area you want to grow in next.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium text-cta hover:underline"
          >
            View all →
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
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

      {/* Featured Courses */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand md:text-3xl">
                Featured courses
              </h2>
              <p className="mt-1 text-muted-foreground">
                {coursesQuery.isLoading
                  ? "Loading..."
                  : coursesQuery.isError
                    ? "Showing demo courses — course-service is offline."
                    : `${featuredCourses.length} hand-picked courses for you.`}
              </p>
            </div>
            <Link
              href="/courses"
              className="text-sm font-medium text-cta hover:underline"
            >
              View all →
            </Link>
          </div>

          {coursesQuery.isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
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

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="overflow-hidden rounded-2xl bg-brand-gradient p-10 text-center md:p-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            <GraduationCap className="h-3.5 w-3.5" />
            Start your learning journey
          </div>
          <h2 className="font-heading text-2xl font-bold text-white md:text-4xl">
            Ready to level up your skills?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Create an account in seconds, verify via email OTP, and start
            learning today. No credit card required.
          </p>
          <Link href="/auth?tab=signup">
            <Button variant="warm" size="xl" className="mt-8">
              Get started for free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
