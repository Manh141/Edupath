"use client";

import {
  Activity,
  CircleDollarSign,
  CreditCard,
  GraduationCap,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminKpiCard } from "@/components/admin/kpi-card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { adminDashboardApi } from "@/lib/admin-api";
import type { AdminDashboardStats } from "@/types/admin";

const icons = [
  <CircleDollarSign key="rev" className="h-5 w-5" />,
  <CreditCard key="order" className="h-5 w-5" />,
  <GraduationCap key="student" className="h-5 w-5" />,
  <TrendingUp key="conv" className="h-5 w-5" />,
];

const chartFills = ["#1B263B", "#415A77", "#6E86A1", "#F77F00", "#D7DFE8"];

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

function formatDelta(value: number | undefined, suffix = "%") {
  const safeValue = value ?? 0;
  const sign = safeValue > 0 ? "+" : "";
  return `${sign}${safeValue}${suffix}`;
}

function buildKpis(stats: AdminDashboardStats) {
  return [
    {
      title: "Monthly revenue",
      value: formatCurrency(stats.orders.revenueThisMonth),
      delta: formatDelta(stats.orders.revenueDeltaPercent),
      note: "vs previous month",
    },
    {
      title: "Paid orders",
      value: formatNumber(stats.orders.paidOrdersThisMonth),
      delta: formatDelta(stats.orders.paidOrdersDeltaPercent),
      note: "vs previous month",
    },
    {
      title: "New learners",
      value: formatNumber(stats.users.newUsersThisMonth),
      delta: formatDelta(stats.users.newUsersDeltaPercent),
      note: "profile signups",
    },
    {
      title: "Cart conversion",
      value: `${stats.orders.conversionRate}%`,
      delta: `${stats.enrollments.completionRate}%`,
      note: "course completion",
    },
  ];
}

function buildActionQueue(stats: AdminDashboardStats) {
  return [
    {
      title: `${formatNumber(stats.courses.pendingReview)} courses waiting for review`,
      description: `${formatNumber(stats.courses.pendingReviewSubmissions)} submitted review packages are still open.`,
      tag: "Content",
    },
    {
      title: `${formatNumber(stats.orders.pendingOrders)} pending orders`,
      description: `${formatCurrency(stats.orders.averageOrderValue)} average order value this month.`,
      tag: "Finance",
    },
    {
      title: `${formatNumber(stats.courses.hiddenReviews)} hidden reviews`,
      description: `${formatNumber(stats.courses.totalReviews)} total reviews are tracked in course-service.`,
      tag: "Moderation",
    },
    {
      title: `${formatNumber(stats.users.inactiveUsers + stats.users.bannedUsers)} restricted profiles`,
      description: `${formatNumber(stats.users.activeUsers)} active profiles can access the learning product.`,
      tag: "Users",
    },
  ];
}

export default function AdminOverviewPage() {
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
        <p className="font-medium text-destructive">Failed to load admin dashboard data.</p>
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
  const overviewStats = buildKpis(stats);
  const actionQueue = buildActionQueue(stats);
  const revenueSeries = stats.orders.monthlyRevenue.map((point) => ({
    name: point.label,
    revenue: point.revenue ?? 0,
    orders: point.orders ?? 0,
  }));
  const categoryShare = stats.courses.categoryShare.slice(0, 5);
  const topCourseMetric = stats.orders.topCourses.length > 0 ? "revenue" : "learners";
  const topCourses =
    stats.orders.topCourses.length > 0
      ? stats.orders.topCourses.map((course) => ({
          name: course.title,
          value: course.revenue,
          note: `${formatNumber(course.sales)} sales`,
        }))
      : stats.courses.topCourses.map((course) => ({
          name: course.title,
          value: course.totalStudents ?? 0,
          note: `${formatNumber(course.totalStudents)} learners`,
        }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="EduPath admin"
        title="Operational overview"
        description="Monitor revenue, learners, course moderation and platform activity from the current production data set."
        actions={
          <Button variant="outline" onClick={() => dashboardQuery.refetch()}>
            Refresh
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, index) => (
          <AdminKpiCard key={stat.title} {...stat} icon={icons[index]} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Revenue trend</CardTitle>
            <p className="text-sm text-body">Paid-order revenue and order count by month.</p>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F77F00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F77F00" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`} />
                <Tooltip formatter={(value, name) => (name === "revenue" ? formatCurrency(Number(value)) : formatNumber(Number(value)))} />
                <Area type="monotone" dataKey="revenue" stroke="#1B263B" strokeWidth={3} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Course mix</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={40} outerRadius={74} paddingAngle={3}>
                    {categoryShare.map((entry, index) => (
                      <Cell key={entry.name + index} fill={chartFills[index % chartFills.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Cart funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.orders.funnel.map((step, index) => {
                const max = stats.orders.funnel[0]?.value || 1;
                return (
                  <div key={step.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-brand">{index + 1}. {step.label}</span>
                      <span className="text-body">{formatNumber(step.value)}</span>
                    </div>
                    <Progress value={(step.value / max) * 100} className="h-2.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Action queue</CardTitle>
            <p className="text-sm text-body">Live counts that usually need an admin decision.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionQueue.map((item) => (
              <div key={item.title} className="admin-muted-panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="font-semibold text-brand">{item.title}</div>
                  <div className="text-sm leading-6 text-body">{item.description}</div>
                </div>
                <Badge variant="outline" className="rounded-full border-border bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brand">
                  {item.tag}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Top courses</CardTitle>
            <p className="text-sm text-body">Ranked by paid order revenue, then by learners when payment data is empty.</p>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCourses} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="4 4" />
                <XAxis type="number" tickFormatter={(value) => formatNumber(Number(value))} />
                <YAxis type="category" dataKey="name" width={138} />
                <Tooltip
                  formatter={(value) =>
                    topCourseMetric === "revenue"
                      ? formatCurrency(Number(value))
                      : formatNumber(Number(value))
                  }
                />
                <Bar dataKey="value" fill="#F77F00" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <Activity className="h-3.5 w-3.5" /> current snapshot
            </div>
            <h2 className="text-3xl font-bold">Platform health at a glance</h2>
            <p className="max-w-3xl text-sm leading-7 text-body">
              {formatNumber(stats.users.activeUsers)} active profiles, {formatNumber(stats.courses.liveCourses)} published courses and {formatNumber(stats.enrollments.active)} active enrollments are currently tracked.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => dashboardQuery.refetch()}>
            Refresh data
          </Button>
        </div>
      </section>
    </div>
  );
}
