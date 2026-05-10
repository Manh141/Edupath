"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BookOpen, ChevronRight, CreditCard, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/format-price";
import { orderApi } from "@/lib/payment-api";
import type { Order } from "@/types/payment";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
  cancelled: "bg-gray-100 text-gray-600",
};

function OrderRow({ order }: { order: Order }) {
  const status = (order.status ?? "pending").toLowerCase();
  const date = order.createdAt
    ? format(new Date(order.createdAt), "MMM d, yyyy")
    : "-";
  const total = order.total ?? order.subtotal ?? 0;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient">
          <Package className="h-5 w-5 text-white/80" />
        </div>
        <div>
          <p className="font-heading font-semibold text-brand">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {order.items.length} course{order.items.length !== 1 ? "s" : ""} · {date}
          </p>
          {order.provider ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              {order.provider.toUpperCase()}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          className={STATUS_COLORS[status] ?? "bg-secondary text-muted-foreground"}
          variant="secondary"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <span className="font-heading font-bold text-brand">
          {formatPrice(total, order.currency)}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { accessToken } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ordersQuery = useQuery({
    queryKey: ["orders", { status: statusFilter, page, pageSize }],
    queryFn: () =>
      orderApi.listMyOrders(
        {
          status: statusFilter || undefined,
          page,
          limit: pageSize,
          sortBy: "newest",
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  const orders: Order[] = ordersQuery.data?.items ?? ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand">
              Order history
            </h1>
            {!ordersQuery.isLoading ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {total} order{total !== 1 ? "s" : ""} total
              </p>
            ) : null}
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value === "_all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {ordersQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : ordersQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-destructive">Failed to load orders.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => ordersQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No orders yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your purchase history will appear here once you enroll in a course.
            </p>
            <Link href="/courses" className="mt-4 inline-block">
              <Button variant="hero" size="sm">
                Browse courses
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>

            <DataPagination
              className="mt-8"
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              itemLabel="orders"
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              disabled={ordersQuery.isFetching}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
