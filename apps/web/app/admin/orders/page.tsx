"use client";

import { useState } from "react";
import { format } from "date-fns";
import { HandCoins, Loader2, ReceiptText, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminCell, AdminDataTable } from "@/components/admin/data-table";
import { DetailsDrawer } from "@/components/admin/details-drawer";
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
import { adminOrdersApi } from "@/lib/admin-api";
import type { AdminOrder } from "@/types/admin";

function formatCurrency(value: number | undefined, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function OrderRow({ order }: { order: AdminOrder }) {
  const total = order.totalAmount ?? order.total ?? 0;
  const provider = order.provider ?? "N/A";

  return (
    <TableRow>
      <AdminCell className="font-semibold text-brand">{order.id.slice(-10)}</AdminCell>
      <AdminCell>{order.userId?.slice(-10) ?? "N/A"}</AdminCell>
      <AdminCell>
        {order.courseTitle ?? order.items?.[0]?.courseTitle ?? order.items?.[0]?.course?.title ?? "N/A"}
      </AdminCell>
      <AdminCell>{formatCurrency(total, order.currency)}</AdminCell>
      <AdminCell className="uppercase">{provider}</AdminCell>
      <AdminCell>
        <StatusBadge value={order.status ?? "pending"} />
      </AdminCell>
      <AdminCell>
        {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
      </AdminCell>
      <AdminCell>
        <DetailsDrawer
          triggerLabel="Details"
          title={`Order ${order.id.slice(-10)}`}
          description="Order snapshot, payment status and purchased course items."
        >
          <div className="space-y-5 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard label="Order ID" value={order.id} />
              <InfoCard label="User ID" value={order.userId ?? "N/A"} />
              <InfoCard label="Status" value={order.status ?? "pending"} />
              <InfoCard label="Payment" value={`${provider} / ${order.paymentStatus ?? "N/A"}`} />
              <InfoCard label="Subtotal" value={formatCurrency(order.subtotalAmount ?? order.subtotal, order.currency)} />
              <InfoCard label="Discount" value={formatCurrency(order.discountAmount ?? order.discount, order.currency)} />
              <InfoCard label="Total" value={formatCurrency(total, order.currency)} />
              <InfoCard
                label="Created"
                value={
                  order.createdAt
                    ? format(new Date(order.createdAt), "PPP p")
                    : "N/A"
                }
              />
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Items
              </div>
              <div className="mt-3 space-y-2">
                {(order.items ?? []).map((item) => (
                  <div key={item.courseId} className="flex items-center justify-between gap-3">
                    <span className="font-medium text-brand">
                      {item.courseTitle ?? item.course?.title ?? item.courseId}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.finalPrice ?? item.price, order.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailsDrawer>
      </AdminCell>
    </TableRow>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 break-words font-medium text-brand">{value}</div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { accessToken } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const ordersQuery = useQuery({
    queryKey: ["admin-orders", { search, status: statusFilter, page, pageSize }],
    queryFn: () =>
      adminOrdersApi.listOrders(
        {
          page,
          limit: pageSize,
          search: search || undefined,
          status: statusFilter || undefined,
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  const statsQuery = useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: () => adminOrdersApi.getStats(accessToken!),
    enabled: Boolean(accessToken),
  });

  const orders = ordersQuery.data?.items ?? ordersQuery.data?.data ?? [];
  const total =
    ordersQuery.data?.meta?.total ?? ordersQuery.data?.total ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finance ops"
        title="Orders & payments"
        description="Track orders, payment status and revenue directly from payment-service."
        actions={
          <Select
            value={statusFilter || "_all"}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <AdminFilterToolbar
        placeholder="Search by order ID, user ID, course or instructor..."
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {ordersQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : ordersQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="font-medium text-destructive">Failed to load orders.</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => ordersQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <AdminDataTable headers={["Order ID", "User", "Course", "Amount", "Method", "Status", "Date", "Actions"]}>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </AdminDataTable>

          <DataPagination
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

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<HandCoins className="h-5 w-5" />}
          title="Monthly revenue"
          text={formatCurrency(statsQuery.data?.revenueThisMonth)}
        />
        <FeatureCard
          icon={<ReceiptText className="h-5 w-5" />}
          title="Paid orders"
          text={(statsQuery.data?.paidOrdersThisMonth ?? 0).toLocaleString("vi-VN")}
        />
        <FeatureCard
          icon={<RotateCcw className="h-5 w-5" />}
          title="Refund rate"
          text={`${statsQuery.data?.refundRate ?? 0}%`}
        />
      </div>
    </div>
  );
}

function FeatureCard({
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
      <p className="mt-2 text-2xl font-bold text-brand">{text}</p>
    </div>
  );
}
