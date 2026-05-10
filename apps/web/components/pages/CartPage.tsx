"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/format-price";
import { cartApi, ApiError } from "@/lib/payment-api";
import type { CartItem } from "@/types/payment";

function CartItemRow({
  item,
  onRemove,
  isRemoving,
}: {
  item: CartItem;
  onRemove: (courseId: string) => void;
  isRemoving: boolean;
}) {
  const course = item.course;
  const courseHref = course?.slug ? `/courses/${course.slug}` : "/courses";

  return (
    <div className="flex items-start gap-4 py-4">
      <Link
        href={courseHref}
        className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {course?.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title ?? "Course"}
            width={200}
            height={112}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
            <BookOpen className="h-5 w-5 text-white/70" />
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={courseHref}
          className="line-clamp-2 font-medium text-brand hover:text-cta"
        >
          {course?.title ?? item.courseTitle ?? "Course"}
        </Link>
        {course?.instructorName ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {course.instructorName}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-heading font-bold text-brand">
          {formatPrice(item.price, item.currency)}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onRemove(item.courseId)}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");

  const cartQuery = useQuery({
    queryKey: ["cart", accessToken],
    queryFn: () => cartApi.getMyCart(accessToken!),
    enabled: Boolean(accessToken),
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: string) => cartApi.removeItem(courseId, accessToken!),
    onSuccess: () => {
      toast.success("Item removed.");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove.");
    },
  });

  const couponMutation = useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code, accessToken!),
    onSuccess: () => {
      toast.success("Coupon applied!");
      setCouponCode("");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Invalid or expired coupon.",
      );
    },
  });

  const clearCouponMutation = useMutation({
    mutationFn: () => cartApi.clearCoupon(accessToken!),
    onSuccess: () => {
      toast.success("Coupon removed.");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove coupon.");
    },
  });

  const cart = cartQuery.data;
  const items: CartItem[] = cart?.items ?? [];
  const subtotal =
    cart?.subtotal ?? items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const discount = cart?.discount ?? cart?.couponDiscount ?? 0;
  const total = cart?.total ?? Math.max(0, subtotal - discount);
  const currency = cart?.currency ?? items[0]?.currency ?? "VND";

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 font-heading text-2xl font-bold text-brand">
          Shopping cart
        </h1>

        {cartQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : cartQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <ShoppingCart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-destructive">Failed to load cart.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => cartQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">Your cart is empty.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add courses from the catalog to get started.
            </p>
            <Link href="/courses" className="mt-4 inline-block">
              <Button variant="hero" size="sm">
                Browse courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-xl border border-border bg-card">
              <div className="px-6 py-4">
                <p className="font-medium text-muted-foreground">
                  {items.length} course{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Separator />
              <div className="divide-y divide-border px-6">
                {items.map((item) => (
                  <CartItemRow
                    key={item.courseId}
                    item={item}
                    onRemove={(courseId) => removeMutation.mutate(courseId)}
                    isRemoving={
                      removeMutation.isPending &&
                      removeMutation.variables === item.courseId
                    }
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-brand">
                  Order summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  {discount > 0 ? (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {cart?.couponCode ? `Coupon (${cart.couponCode})` : "Discount"}
                      </span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  ) : null}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-heading text-base font-bold text-brand">
                    <span>Total</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="mt-5 block">
                  <Button variant="hero" size="lg" className="w-full">
                    Checkout
                  </Button>
                </Link>
                <Link href="/courses" className="mt-3 block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue shopping
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-sm font-medium text-brand">
                  Have a coupon?
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && couponCode.trim()) {
                        couponMutation.mutate(couponCode.trim());
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => couponMutation.mutate(couponCode.trim())}
                    disabled={!couponCode.trim() || couponMutation.isPending}
                  >
                    {couponMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {cart?.couponCode ? (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <Tag className="h-3.5 w-3.5" />
                    Applied: {cart.couponCode}
                    <button
                      type="button"
                      onClick={() => clearCouponMutation.mutate()}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      {clearCouponMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
