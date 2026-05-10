"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  DollarSign,
  GraduationCap,
  Percent,
  PlusCircle,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import type {
  InstructorOverviewPeriod,
  InstructorOverviewSeriesPoint,
  InstructorOverviewStats,
} from "@/types/course";

type StatCardProps = {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  Icon: typeof BookOpen;
};

function formatCurrency(value: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatCard({ label, value, delta, hint, Icon }: StatCardProps) {
  const isUp = (delta ?? 0) >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
              isUp
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {isUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}

function ChartBars({
  data,
  metric,
  currency,
}: {
  data: InstructorOverviewSeriesPoint[];
  metric: "revenue" | "enrollments";
  currency: string;
}) {
  const values = data.map((item) =>
    metric === "revenue" ? item.instructorEarnings : item.enrollments,
  );
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((item, index) => {
        const value =
          metric === "revenue" ? item.instructorEarnings : item.enrollments;

        return (
          <div
            key={`${item.date}-${index}`}
            className="group relative flex-1 rounded-sm bg-muted"
            style={{ height: `${Math.max((value / max) * 100, 4)}%` }}
          >
            <div
              className={`h-full w-full rounded-sm ${
                metric === "revenue" ? "bg-emerald-500" : "bg-primary"
              }`}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm group-hover:block">
              {item.label}:{" "}
              {metric === "revenue"
                ? formatCurrency(value, currency)
                : `${value} enrollments`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function InstructorOverviewPage() {
  const { accessToken, currentUser } = useAuth();
  const [period, setPeriod] = useState<InstructorOverviewPeriod>("30d");

  const overviewQuery = useQuery({
    queryKey: ["instructor-overview", period],
    queryFn: () => instructorApi.getOverview(period, accessToken!),
    enabled: Boolean(accessToken),
  });

  const stats = overviewQuery.data;
  const firstName =
    currentUser?.email?.split("@")[0]?.split(/[._-]/)[0] ?? "instructor";

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10 xl:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Instructor Studio
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold capitalize text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real sales, enrollment, and payout metrics from EduPath services.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            {(["7d", "30d", "90d"] as InstructorOverviewPeriod[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item === "7d"
                  ? "7 days"
                  : item === "30d"
                    ? "30 days"
                    : "90 days"}
              </button>
            ))}
          </div>
          <Link href="/instructor/courses/new">
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New course
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {overviewQuery.isLoading ? (
          <OverviewSkeleton />
        ) : overviewQuery.isError || !stats ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="font-medium text-destructive">
              Could not load instructor overview.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => overviewQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <OverviewContent stats={stats} />
        )}
      </div>
    </div>
  );
}

function OverviewContent({ stats }: { stats: InstructorOverviewStats }) {
  const currency = stats.totals.currency || "VND";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Instructor earnings"
          value={formatCurrency(stats.totals.instructorEarnings, currency)}
          delta={stats.deltas.revenue}
          hint={`last ${stats.days} days`}
          Icon={Wallet}
        />
        <StatCard
          label="New enrollments"
          value={stats.totals.newEnrollments.toLocaleString()}
          delta={stats.deltas.enrollments}
          hint={`last ${stats.days} days`}
          Icon={Users}
        />
        <StatCard
          label="Total students"
          value={stats.totals.totalStudents.toLocaleString()}
          hint={`${stats.totals.completedStudents} completed`}
          Icon={GraduationCap}
        />
        <StatCard
          label="Avg. rating"
          value={
            stats.totals.averageRating > 0
              ? stats.totals.averageRating.toFixed(2)
              : "-"
          }
          hint={`${stats.totals.totalReviews} reviews`}
          Icon={Star}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Earnings over time
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {formatCurrency(stats.totals.instructorEarnings, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                Gross {formatCurrency(stats.totals.grossRevenue, currency)} ·
                EduPath fee {formatCurrency(stats.totals.platformFee, currency)}
              </p>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
              <TrendingUp className="mr-1 h-3 w-3" />
              {stats.deltas.revenue.toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-6">
            <ChartBars data={stats.series} metric="revenue" currency={currency} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Enrollment trend
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {stats.totals.newEnrollments.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Average progress {stats.totals.averageProgress.toFixed(1)}%
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Users className="mr-1 h-3 w-3" />
              {stats.deltas.enrollments.toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-6">
            <ChartBars
              data={stats.series}
              metric="enrollments"
              currency={currency}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Top courses
            </h2>
            <Link
              href="/instructor/courses"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {stats.topCourses.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                No course metrics yet
              </p>
              <Link href="/instructor/courses/new" className="mt-4 inline-block">
                <Button size="sm">Create a course</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Course</th>
                    <th className="px-4 py-2.5 text-right font-medium">Students</th>
                    <th className="px-4 py-2.5 text-right font-medium">Sales</th>
                    <th className="px-4 py-2.5 text-right font-medium">Earnings</th>
                    <th className="px-4 py-2.5 text-right font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.topCourses.map((course) => (
                    <tr key={course.courseId} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <Link
                          href={`/instructor/courses/${course.courseId}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          <span className="line-clamp-1">{course.title}</span>
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {course.status}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {course.students.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {course.sales.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {formatCurrency(course.instructorEarnings, currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {course.averageRating > 0
                          ? course.averageRating.toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Revenue split
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {stats.sharePolicy.activePlan}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground">Instructor</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.sharePolicy.instructorSharePercent}%
              </p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground">EduPath</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.sharePolicy.platformSharePercent}%
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Gross revenue</span>
              <span className="font-medium">
                {formatCurrency(stats.totals.grossRevenue, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Instructor earnings</span>
              <span className="font-medium">
                {formatCurrency(stats.totals.instructorEarnings, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">EduPath fee</span>
              <span className="font-medium">
                {formatCurrency(stats.totals.platformFee, currency)}
              </span>
            </div>
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recommended tiers
            </p>
            <div className="mt-3 space-y-2">
              {stats.sharePolicy.recommendedTiers.map((tier) => (
                <div
                  key={tier.channel}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-xs"
                >
                  <span className="text-muted-foreground">{tier.channel}</span>
                  <span className="font-medium text-foreground">
                    {tier.instructorSharePercent}/{tier.platformSharePercent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent activity
          </h2>
          <Badge variant="secondary">
            {stats.totals.currentSales} paid sales
          </Badge>
        </div>
        {stats.recentActivity.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
            <DollarSign className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No paid sales or enrollments yet.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {stats.recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center gap-3 py-3 text-sm">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    activity.type === "sale"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {activity.type === "sale" ? (
                    <DollarSign className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(activity.occurredAt)}
                  </p>
                </div>
                {activity.instructorEarnings !== undefined ? (
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(activity.instructorEarnings, currency)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
