"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, orderApi, paymentApi } from "@/lib/payment-api";
import { formatPrice } from "@/lib/format-price";
import type { Transaction } from "@/types/payment";

const PROVIDER_LABELS: Record<string, string> = {
  vnpay: "VNPay",
  momo: "MoMo",
  stripe: "Credit / Debit card (Stripe)",
  paypal: "PayPal",
  cod: "Cash on delivery",
  bank_transfer: "Bank transfer",
  free: "Free enrollment",
};

function pickActiveTransaction(transactions?: Transaction[]): Transaction | null {
  if (!transactions || transactions.length === 0) return null;

  const pending = transactions.find((t) => t.status === "pending");
  if (pending) return pending;

  return transactions[0];
}

export default function PaymentPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [result, setResult] = useState<null | "success" | "failed" | "cancelled">(
    null,
  );

  const returnTo = searchParams.get("returnTo") ?? "/my-learning";

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getOrder(orderId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(orderId),
    refetchOnWindowFocus: false,
  });

  const order = orderQuery.data;
  const activeTransaction = useMemo(
    () => pickActiveTransaction(order?.transactions),
    [order?.transactions],
  );
  const status = (order?.status ?? "pending").toLowerCase();
  const isAlreadyPaid = status === "paid";
  const isTerminalFailure =
    status === "failed" || status === "cancelled" || status === "expired";

  const simulateMutation = useMutation({
    mutationFn: async (outcome: "success" | "failed" | "cancelled") => {
      if (!activeTransaction) {
        throw new ApiError("No pending transaction for this order.");
      }
      return paymentApi.simulateTransaction(
        activeTransaction.id,
        { status: outcome },
        accessToken!,
      );
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });

      if (data.status === "success") {
        setResult("success");
        toast.success("Payment confirmed. Enrollment is being prepared.");
        const url = appendQuery(returnTo, { paid: "success", orderId });
        router.push(url);
      } else if (data.status === "cancelled") {
        setResult("cancelled");
        toast.message("Payment cancelled.");
      } else {
        setResult("failed");
        toast.error("Payment failed. Please try again or use a different method.");
      }
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Something went wrong processing the payment.",
      );
    },
  });

  const handleReturnToCourse = () => {
    const url = appendQuery(returnTo, { paid: "success", orderId });
    router.push(url);
  };

  const total = order?.total ?? order?.totalAmount ?? 0;
  const subtotal = order?.subtotal ?? order?.subtotalAmount ?? total;
  const discount = order?.discount ?? order?.discountAmount ?? 0;
  const currency = order?.currency ?? "VND";
  const provider =
    activeTransaction?.provider ?? order?.provider ?? "vnpay";
  const providerLabel = PROVIDER_LABELS[provider] ?? provider.toUpperCase();

  const items = order?.items ?? [];

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Link
          href={returnTo}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel and go back
        </Link>
        <h1 className="font-heading text-2xl font-bold text-brand">
          Complete payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm your payment to finish your enrollment. This uses the
          integrated sandbox — no real charge is made.
        </p>

        {orderQuery.isLoading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : orderQuery.isError || !order ? (
          <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <XCircle className="mx-auto mb-3 h-10 w-10 text-destructive" />
            <p className="font-medium text-destructive">
              Could not load this order.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => orderQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : isAlreadyPaid ? (
          <PaidAlreadyPanel onReturn={handleReturnToCourse} />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Order
                    </p>
                    <p className="font-heading text-lg font-semibold text-brand">
                      #{order.id.slice(-12).toUpperCase()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      isTerminalFailure
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {status.toUpperCase()}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.courseId}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient">
                          <BookOpen className="h-4 w-4 text-white/80" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-medium">
                            {item.course?.title ??
                              item.courseTitle ??
                              "Course"}
                          </p>
                          {item.course?.instructorName ? (
                            <p className="text-xs text-muted-foreground">
                              {item.course.instructorName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span className="shrink-0 font-medium text-brand">
                        {formatPrice(
                          item.finalPrice ?? item.price ?? item.unitPrice,
                          item.currency ?? currency,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-lg font-semibold text-brand">
                  Payment method
                </h2>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4">
                  <CreditCard className="h-5 w-5 text-brand" />
                  <div>
                    <p className="font-medium text-foreground">{providerLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      Sandbox provider — outcome is simulated instantly.
                    </p>
                  </div>
                </div>

                {isTerminalFailure ? (
                  <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                    This order has been{" "}
                    <span className="font-semibold">{status}</span>. Please start
                    a new checkout if you still want to enroll.
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={() => simulateMutation.mutate("success")}
                    disabled={
                      simulateMutation.isPending ||
                      !activeTransaction ||
                      isTerminalFailure
                    }
                  >
                    {simulateMutation.isPending && result === null ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Confirm payment
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => simulateMutation.mutate("cancelled")}
                    disabled={
                      simulateMutation.isPending ||
                      !activeTransaction ||
                      isTerminalFailure
                    }
                  >
                    Cancel payment
                  </Button>
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure transaction · 30-day refund policy
                </p>
              </section>

              {result === "cancelled" ? (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-50 p-4 text-sm text-yellow-900">
                  Payment was cancelled. You can return to{" "}
                  <Link href="/cart" className="font-semibold underline">
                    your cart
                  </Link>{" "}
                  or start over from{" "}
                  <Link href={returnTo} className="font-semibold underline">
                    the course page
                  </Link>
                  .
                </div>
              ) : null}
              {result === "failed" ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  Payment failed. Start a fresh checkout to try again.
                </div>
              ) : null}
            </div>

            <aside className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-lg font-semibold text-brand">
                  Summary
                </h2>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  {discount > 0 ? (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  ) : null}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-heading text-lg font-bold text-brand">
                    <span>Total</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>
              </div>
              <Link href={returnTo}>
                <Button variant="ghost" size="sm" className="w-full">
                  Return without paying
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function PaidAlreadyPanel({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-50 p-10 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
      <p className="font-heading text-lg font-semibold text-emerald-900">
        This order is already paid.
      </p>
      <p className="mt-1 text-sm text-emerald-800">
        You can access your enrolled courses from the My Learning area.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button variant="hero" onClick={onReturn}>
          Continue
        </Button>
        <Link href="/my-learning">
          <Button variant="outline">Go to My Learning</Button>
        </Link>
      </div>
    </div>
  );
}

function appendQuery(target: string, params: Record<string, string>) {
  try {
    const baseUrl = target.startsWith("/")
      ? new URL(target, "http://local.placeholder")
      : new URL(target);
    for (const [key, value] of Object.entries(params)) {
      baseUrl.searchParams.set(key, value);
    }
    return `${baseUrl.pathname}${baseUrl.search}${baseUrl.hash}`;
  } catch {
    const separator = target.includes("?") ? "&" : "?";
    const qs = new URLSearchParams(params).toString();
    return `${target}${separator}${qs}`;
  }
}
