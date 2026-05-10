"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { courseApi } from "@/lib/course-api";
import { formatPrice } from "@/lib/format-price";
import { cartApi, orderApi, ApiError } from "@/lib/payment-api";
import type { PaymentMethod } from "@/types/payment";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "vnpay",
    label: "VNPay",
    description: "Pay via VNPay gateway",
    icon: "VN",
  },
  {
    id: "momo",
    label: "MoMo",
    description: "Pay via MoMo e-wallet",
    icon: "MM",
  },
  {
    id: "stripe",
    label: "Credit / Debit card",
    description: "Visa, Mastercard via Stripe",
    icon: "CC",
  },
  {
    id: "free",
    label: "Free enrollment",
    description: "No payment required",
    icon: "FR",
  },
];

export default function CheckoutPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");
  const checkoutCourseId = searchParams.get("courseId");
  const isSingleCourseCheckout = Boolean(checkoutCourseId);

  const cartQuery = useQuery({
    queryKey: ["cart", accessToken],
    queryFn: () => cartApi.getMyCart(accessToken!),
    enabled: Boolean(accessToken) && !isSingleCourseCheckout,
  });

  const singleCourseQuery = useQuery({
    queryKey: ["checkout-course", checkoutCourseId, accessToken],
    queryFn: () => courseApi.getCourseById(checkoutCourseId!, accessToken ?? undefined),
    enabled: Boolean(checkoutCourseId),
  });

  const singleCourse = singleCourseQuery.data;
  const singleCoursePrice = singleCourse?.price ?? 0;
  const singleCourseCurrency = singleCourse?.currency ?? "VND";
  const cart = cartQuery.data;

  const items = isSingleCourseCheckout
    ? singleCourse
      ? [
          {
            courseId: singleCourse.id,
            price: singleCoursePrice,
            currency: singleCourseCurrency,
            course: {
              id: singleCourse.id,
              slug: singleCourse.slug,
              title: singleCourse.title,
              thumbnailUrl: singleCourse.thumbnailUrl ?? null,
              instructorName: singleCourse.instructorName,
              totalLectures: singleCourse.totalLectures,
              totalDuration:
                singleCourse.totalDurationSec ?? singleCourse.totalDuration,
            },
          },
        ]
      : []
    : (cart?.items ?? []);

  const subtotal = isSingleCourseCheckout
    ? singleCoursePrice
    : (cart?.subtotal ?? items.reduce((sum, item) => sum + (item.price ?? 0), 0));
  const discount = isSingleCourseCheckout
    ? 0
    : (cart?.discount ?? cart?.couponDiscount ?? 0);
  const total = isSingleCourseCheckout
    ? singleCoursePrice
    : (cart?.total ?? Math.max(0, subtotal - discount));
  const checkoutCurrency = isSingleCourseCheckout
    ? singleCourseCurrency
    : (cart?.currency ?? items[0]?.currency ?? "VND");
  const isFreeOrder = total === 0;
  const activeMethod =
    isFreeOrder ? "free" : selectedMethod === "free" ? "vnpay" : selectedMethod;

  const checkoutMutation = useMutation({
    mutationFn: () =>
      orderApi.checkout(
        {
          provider: activeMethod,
          courseId: checkoutCourseId ?? undefined,
          idempotencyKey: `${Date.now()}-${Math.random()}`,
        },
        accessToken!,
      ),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });

      const returnTo =
        isSingleCourseCheckout && singleCourse?.slug
          ? `/courses/${singleCourse.slug}`
          : "/my-learning";

      const orderStatus = (order.status ?? "").toLowerCase();
      if (orderStatus === "paid") {
        toast.success("Enrollment completed!");
        const url = `${returnTo}?paid=success&orderId=${encodeURIComponent(order.id)}`;
        router.push(url);
        return;
      }

      toast.success("Order created. Complete the payment to enroll.");
      const qs = new URLSearchParams({ returnTo });
      router.push(`/payment/${order.id}?${qs.toString()}`);
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Checkout failed. Please try again.",
      );
    },
  });

  const methods = isFreeOrder
    ? PAYMENT_METHODS.filter((method) => method.id === "free")
    : PAYMENT_METHODS.filter((method) => method.id !== "free");

  const backHref =
    isSingleCourseCheckout && singleCourse?.slug
      ? `/courses/${singleCourse.slug}`
      : "/cart";
  const isLoading = isSingleCourseCheckout
    ? singleCourseQuery.isLoading
    : cartQuery.isLoading;
  const hasLoadError = isSingleCourseCheckout
    ? singleCourseQuery.isError
    : cartQuery.isError;
  const isEmpty = isSingleCourseCheckout
    ? !singleCourse
    : items.length === 0;

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {isSingleCourseCheckout ? "Back to course" : "Back to cart"}
          </Link>
          <h1 className="font-heading text-2xl font-bold text-brand">
            {isSingleCourseCheckout ? "Buy now" : "Checkout"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSingleCourseCheckout
              ? "Review this course and choose a payment method. Your shopping cart stays unchanged."
              : "Review your order and choose a payment method."}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : hasLoadError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-destructive">
              Failed to load checkout details.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                isSingleCourseCheckout
                  ? singleCourseQuery.refetch()
                  : cartQuery.refetch()
              }
            >
              Retry
            </Button>
          </div>
        ) : isEmpty ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">
              {isSingleCourseCheckout
                ? "This course is not available for checkout."
                : "Your cart is empty."}
            </p>
            <Link href="/courses" className="mt-4 inline-block">
              <Button variant="hero" size="sm">
                Browse courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-brand">
                Payment method
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      activeMethod === method.id
                        ? "border-brand bg-brand/5"
                        : "border-border bg-card hover:border-brand/40"
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {method.icon}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {method.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    {activeMethod === method.id ? (
                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-brand" />
                    ) : null}
                  </button>
                ))}
              </div>

              {isSingleCourseCheckout ? (
                <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  Coupon codes are applied in the cart flow. Use Add to cart if you
                  want to review promotions or combine multiple courses before paying.
                </div>
              ) : null}

              <div className="rounded-xl border border-border bg-card">
                <div className="px-5 py-4">
                  <h3 className="font-medium text-brand">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </h3>
                </div>
                <Separator />
                <div className="divide-y divide-border px-5">
                  {items.map((item) => (
                    <div
                      key={item.courseId}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient">
                          <BookOpen className="h-4 w-4 text-white/80" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-medium">
                            {item.course?.title ?? "Course"}
                          </p>
                          {item.course?.instructorName ? (
                            <p className="text-xs text-muted-foreground">
                              {item.course.instructorName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span className="shrink-0 font-medium text-brand">
                        {formatPrice(item.price, item.currency ?? checkoutCurrency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-brand">
                  Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal, checkoutCurrency)}</span>
                  </div>
                  {discount > 0 ? (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount, checkoutCurrency)}</span>
                    </div>
                  ) : null}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-heading text-lg font-bold text-brand">
                    <span>Total</span>
                    <span>
                      {total === 0 ? (
                        <Badge className="bg-emerald-600 text-white">Free</Badge>
                      ) : (
                        formatPrice(total, checkoutCurrency)
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => checkoutMutation.mutate()}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {isFreeOrder
                        ? "Complete enrollment"
                        : isSingleCourseCheckout
                          ? "Complete purchase"
                          : "Place order"}
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure checkout · 30-day refund policy
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                By placing your order you agree to EduPath&apos;s terms of service.
              </p>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
