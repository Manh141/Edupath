"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/format-price";
import { orderApi } from "@/lib/payment-api";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
  cancelled: "bg-gray-100 text-gray-600",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  paid: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  completed: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  failed: <XCircle className="h-5 w-5 text-destructive" />,
  cancelled: <XCircle className="h-5 w-5 text-muted-foreground" />,
  pending: <Clock className="h-5 w-5 text-yellow-600" />,
  processing: <Clock className="h-5 w-5 text-blue-600" />,
};

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const { accessToken } = useAuth();

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getOrder(orderId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(orderId),
  });

  const order = orderQuery.data;
  const status = (order?.status ?? "pending").toLowerCase();
  const total = order?.total ?? order?.subtotal ?? 0;
  const discount = order?.discount ?? 0;

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        {orderQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : orderQuery.isError || !order ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">Order not found.</p>
            <Link href="/orders" className="mt-4 inline-block">
              <Button variant="outline">View all orders</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="mt-0.5 font-heading font-bold text-brand">
                    #{order.id.slice(-12).toUpperCase()}
                  </p>
                </div>
                <Badge
                  className={
                    STATUS_COLORS[status] ?? "bg-secondary text-muted-foreground"
                  }
                  variant="secondary"
                >
                  <span className="mr-1.5">{STATUS_ICONS[status] ?? null}</span>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="mt-1 font-medium">
                    {order.createdAt ? format(new Date(order.createdAt), "PPP") : "-"}
                  </p>
                </div>
                {order.provider ? (
                  <div>
                    <p className="text-muted-foreground">Payment method</p>
                    <p className="mt-1 flex items-center gap-1.5 font-medium">
                      <CreditCard className="h-4 w-4" />
                      {order.provider.toUpperCase()}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="mt-1 font-heading font-bold text-brand">
                    {formatPrice(total, order.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="px-6 py-4">
                <h2 className="font-heading font-semibold text-brand">
                  Courses ({order.items.length})
                </h2>
              </div>
              <Separator />
              <div className="divide-y divide-border px-6">
                {order.items.map((item, index) => (
                  <div
                    key={item.courseId ?? index}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient">
                        <BookOpen className="h-4 w-4 text-white/80" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {item.course?.title ?? item.courseTitle ?? "Course"}
                        </p>
                        {item.course?.instructorName ? (
                          <p className="text-xs text-muted-foreground">
                            {item.course.instructorName}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-brand">
                        {formatPrice(item.price, item.currency ?? order.currency)}
                      </span>
                      {(status === "paid" || status === "completed") && item.courseId ? (
                        <Link href={`/learn/${item.courseId}`}>
                          <Button size="sm" variant="outline">
                            Go to course
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading font-semibold text-brand">
                Price breakdown
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal ?? total, order.currency)}</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount, order.currency)}</span>
                  </div>
                ) : null}
                <Separator className="my-2" />
                <div className="flex justify-between font-heading font-bold text-brand">
                  <span>Total charged</span>
                  <span>{formatPrice(total, order.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
