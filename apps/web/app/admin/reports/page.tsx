"use client";

import { ArrowUpRight, ChartNoAxesCombined, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { adminDashboardApi } from "@/lib/admin-api";

function formatCurrency(value: number | undefined) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

export default function AdminReportsPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminDashboardApi.getStats(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (dashboardQuery.isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <p className="font-medium text-destructive">Failed to load reports.</p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => dashboardQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const stats = dashboardQuery.data;
  const revenueSeries = stats.orders.monthlyRevenue.map((point) => ({
    name: point.label,
    orders: point.orders ?? 0,
    revenue: point.revenue ?? 0,
  }));
  const topCourses =
    stats.orders.topCourses.length > 0
      ? stats.orders.topCourses
      : stats.enrollments.topCourses.map((course) => ({
          courseId: course.courseId,
          title: course.title,
          instructorName: course.instructorName,
          sales: course.enrollments,
          revenue: 0,
        }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Analytics"
        title="Reports & insights"
        description="Revenue, order, enrollment and content health metrics are calculated from live service data."
        actions={
          <Button variant="outline" onClick={() => dashboardQuery.refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-2xl">Revenue & paid orders</CardTitle>
            <p className="text-sm leading-7 text-body">Monthly paid orders from payment-service.</p>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue"
                      ? formatCurrency(Number(value))
                      : formatNumber(Number(value))
                  }
                />
                <Bar dataKey="orders" fill="#1B263B" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <MetricCard
            label="Completion rate"
            value={`${stats.enrollments.completionRate}%`}
            note={`${formatNumber(stats.enrollments.completed)} completed enrollments`}
          />
          <MetricCard
            label="Refund rate"
            value={`${stats.orders.refundRate}%`}
            note={`${formatNumber(stats.orders.refundOrders)} refunded orders`}
          />
          <MetricCard
            label="Average order value"
            value={formatCurrency(stats.orders.averageOrderValue)}
            note={`${formatNumber(stats.orders.paidOrdersThisMonth)} paid orders this month`}
          />
          <MetricCard
            label="Courses pending review"
            value={formatNumber(stats.courses.pendingReview)}
            note={`${formatNumber(stats.courses.liveCourses)} published courses`}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-2xl">Top courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCourses.map((course) => (
              <div key={course.courseId} className="admin-muted-panel flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold text-brand">{course.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {course.revenue > 0
                      ? `${formatCurrency(course.revenue)} revenue`
                      : `${formatNumber(course.sales)} enrollments`}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-2xl">Platform health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-7 text-body md:grid-cols-2">
            <InsightItem title="Active profiles" value={formatNumber(stats.users.activeUsers)} />
            <InsightItem title="Instructors" value={formatNumber(stats.users.instructors)} />
            <InsightItem title="Average course rating" value={String(stats.courses.averageRating)} />
            <InsightItem title="Average learner progress" value={`${stats.enrollments.averageProgress}%`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold text-brand">{value}</div>
          <div className="mt-2 text-sm text-body">{note}</div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-brand">
          <ChartNoAxesCombined className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InsightItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-border bg-white p-4">
      <div className="font-semibold text-brand">{title}</div>
      <div className="mt-2 text-2xl font-bold text-brand">{value}</div>
    </div>
  );
}
