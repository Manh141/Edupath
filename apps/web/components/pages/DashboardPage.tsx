"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Heart,
  PlayCircle,
  Plus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/auth-api";
import { isAdminUser, isInstructorUser } from "@/lib/auth-session";
import { enrollmentApi } from "@/lib/enrollment-api";

function StatCard({
  icon: Icon,
  value,
  label,
  color = "text-brand",
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <Icon className={`mb-2 h-6 w-6 ${color}`} />
      <p className="font-heading text-2xl font-bold text-brand">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoItem({
  label,
  value,
  compact = false,
}: {
  label: string;
  value?: string | null;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-lg bg-muted/50 px-3 py-2"
          : "rounded-lg border border-border p-3"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, accessToken, setActiveRole } = useAuth();
  const router = useRouter();
  const isAdmin = isAdminUser(currentUser);
  const isInstructor = isInstructorUser(currentUser);

  useEffect(() => {
    if (isAdmin) {
      router.replace("/admin/overview");
    }
  }, [isAdmin, router]);

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments", accessToken],
    queryFn: () =>
      enrollmentApi.listMyEnrollments({ limit: 6, sortBy: "updatedAt" }, accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const gatewayMeQuery = useQuery({
    queryKey: ["gateway-me", accessToken],
    queryFn: () => authApi.getGatewayMe(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const gatewayRoutesQuery = useQuery({
    queryKey: ["gateway-routes", accessToken],
    queryFn: () => authApi.getGatewayRoutes(accessToken!),
    enabled: Boolean(accessToken) && isAdmin,
    retry: false,
  });

  const enrollments =
    enrollmentsQuery.data?.items ?? enrollmentsQuery.data?.data ?? [];
  const completedCount = enrollments.filter(
    (e) => (e.completionPercent ?? e.progress ?? 0) >= 100,
  ).length;

  const displayName =
    currentUser?.email?.split("@")[0] ?? currentUser?.email ?? "there";

  return (
    <ProtectedRoute>
      {isAdmin ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="text-muted-foreground">
            Redirecting to the admin dashboard...
          </span>
        </div>
      ) : (
      <div className="container mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-xl font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand">
              Welcome back, {displayName}!
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {Array.from(
                new Set(
                  [
                    currentUser?.role,
                    ...((currentUser?.roles ?? []) as string[]),
                  ]
                    .filter(Boolean)
                    .map((r) => (r as string).toLowerCase()),
                ),
              ).map((role, index) => (
                <Badge
                  key={role}
                  variant={index === 0 ? "secondary" : "outline"}
                  className="capitalize"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            value={
              enrollmentsQuery.isLoading
                ? "—"
                : enrollments.length
            }
            label="Enrolled courses"
            color="text-brand"
          />
          <StatCard
            icon={GraduationCap}
            value={enrollmentsQuery.isLoading ? "—" : completedCount}
            label="Completed"
            color="text-emerald-600"
          />
          <StatCard
            icon={TrendingUp}
            value={
              enrollmentsQuery.isLoading
                ? "—"
                : enrollments.length > 0
                  ? `${Math.round(enrollments.reduce((s, e) => s + (e.completionPercent ?? e.progress ?? 0), 0) / enrollments.length)}%`
                  : "0%"
            }
            label="Avg. progress"
            color="text-cta"
          />
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Plus className="mb-2 h-6 w-6 text-muted-foreground" />
            <Link href="/courses">
              <Button variant="outline" size="sm">
                Browse courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Role-based quick links */}
        {(isInstructor || isAdmin) && (
          <div className="mb-8 flex flex-wrap gap-3">
            {isInstructor && (
              <Link
                href="/instructor/courses"
                onClick={() => setActiveRole("instructor")}
              >
                <Button variant="hero" size="sm">
                  Instructor Studio
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin/overview">
                <Button variant="cta" size="sm">
                  Admin Console
                </Button>
              </Link>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Enrollments */}
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-bold text-brand">
                My learning
              </h2>
              <div className="flex items-center gap-4">
                <Link
                  href="/my-learning"
                  className="text-sm text-cta hover:underline"
                >
                  View all →
                </Link>
                <Link href="/orders" className="text-sm text-cta hover:underline">
                  Order history →
                </Link>
              </div>
            </div>

            {enrollmentsQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl bg-secondary"
                  />
                ))}
              </div>
            ) : enrollmentsQuery.isError ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Could not load enrollments. Ensure the enrollment service is
                  running.
                </p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium text-foreground">
                  No enrolled courses yet.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the catalog and enroll in a course to get started.
                </p>
                <Link href="/courses" className="mt-4 inline-block">
                  <Button variant="hero" size="sm">
                    Explore courses
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => {
                  const progress =
                    enrollment.completionPercent ?? enrollment.progress ?? 0;
                  const course = enrollment.course;
                  const courseTitle =
                    course?.title ?? enrollment.courseTitle ?? "Course";
                  const instructorName =
                    course?.instructorName ?? enrollment.instructorName;
                  return (
                    <div
                      key={enrollment.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {course?.categoryName && (
                            <p className="mb-1 text-xs font-semibold text-cta">
                              {course.categoryName}
                            </p>
                          )}
                          <p className="font-heading font-semibold text-brand line-clamp-1">
                            {courseTitle}
                          </p>
                          {instructorName && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {instructorName}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={progress >= 100 ? "default" : "secondary"}
                          className={
                            progress >= 100
                              ? "bg-emerald-600 text-white"
                              : ""
                          }
                        >
                          {progress >= 100 ? "Completed" : `${Math.round(progress)}%`}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <Progress value={progress} className="h-2" />
                      </div>
                      {enrollment.courseId && (
                        <Link
                          href={`/learn/${enrollment.courseId}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cta hover:underline"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {progress === 0 ? "Start learning" : "Continue"}
                        </Link>
                      )}
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-1">
                  <Link href="/wishlist">
                    <Button variant="outline" size="sm">
                      <Heart className="mr-1.5 h-4 w-4" /> Wishlist
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" size="sm">
                      My cart
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Gateway check */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <h3 className="font-heading text-base font-semibold text-brand">
                  Session
                </h3>
              </div>
              {gatewayMeQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">
                  Verifying session…
                </p>
              ) : gatewayMeQuery.isError ? (
                <p className="text-sm text-muted-foreground">
                  Gateway unreachable in this environment.
                </p>
              ) : (
                <div className="space-y-2">
                  <InfoItem
                    label="User ID"
                    value={gatewayMeQuery.data?.userId}
                    compact
                  />
                  <InfoItem
                    label="Email"
                    value={gatewayMeQuery.data?.email}
                    compact
                  />
                  <InfoItem
                    label="Role"
                    value={gatewayMeQuery.data?.role}
                    compact
                  />
                </div>
              )}
            </div>

            {/* Auth account snapshot */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 font-heading text-base font-semibold text-brand">
                Account
              </h3>
              <div className="space-y-2">
                <InfoItem label="Email" value={currentUser?.email} compact />
                <InfoItem
                  label="Provider"
                  value={currentUser?.provider}
                  compact
                />
                <InfoItem
                  label="Verified"
                  value={String(currentUser?.isEmailVerified)}
                  compact
                />
                <InfoItem
                  label="Status"
                  value={currentUser?.status}
                  compact
                />
              </div>
              <Link href="/profile" className="mt-3 inline-block">
                <Button variant="outline" size="sm" className="w-full">
                  Edit profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin: gateway routes */}
        {isAdmin && gatewayRoutesQuery.data && gatewayRoutesQuery.data.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-xl font-bold text-brand">
              Gateway routes
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {gatewayRoutesQuery.data.map((route) => (
                <div
                  key={`${route.name}-${route.routePrefix}`}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="text-sm font-semibold text-brand">{route.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {route.routePrefix}
                  </p>
                  {route.target && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      → {route.target}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}
    </ProtectedRoute>
  );
}
