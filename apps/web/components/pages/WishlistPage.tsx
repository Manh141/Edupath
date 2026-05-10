"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Heart,
  Loader2,
  ShoppingCart,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { enrollmentApi, ApiError } from "@/lib/enrollment-api";
import { cartApi } from "@/lib/payment-api";
import type { WishlistItem } from "@/types/enrollment";

const levelLabels: Record<string, string> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function WishlistCard({
  item,
  onRemove,
  onAddToCart,
  isRemoving,
  isAddingToCart,
}: {
  item: WishlistItem;
  onRemove: (courseId: string) => void;
  onAddToCart: (courseId: string) => void;
  isRemoving: boolean;
  isAddingToCart: boolean;
}) {
  const course = item.course;
  const price = course?.price ?? 0;
  const isFree = price === 0;
  const durationHours = course?.durationHours
    ?? (course?.totalDuration ? Math.round(course.totalDuration / 60) : null);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      {/* Thumbnail */}
      <Link
        href={`/courses/${course?.slug ?? ""}`}
        className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-48"
      >
        {course?.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course?.title ?? "Course"}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
            <BookOpen className="h-8 w-8 text-white/70" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          {course?.categoryName && (
            <p className="text-xs font-semibold text-cta">
              {course.categoryName}
            </p>
          )}
          <Link
            href={`/courses/${course?.slug ?? ""}`}
            className="mt-0.5 block font-heading font-semibold text-brand hover:text-cta line-clamp-2"
          >
            {course?.title ?? "Untitled course"}
          </Link>
          {course?.instructorName && (
            <p className="mt-1 text-xs text-muted-foreground">
              {course.instructorName}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {(course?.averageRating ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-cta text-cta" />
                {course!.averageRating!.toFixed(1)}
              </span>
            )}
            {(course?.studentsCount ?? course?.totalStudents ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {(course?.studentsCount ?? course?.totalStudents)?.toLocaleString()}
              </span>
            )}
            {durationHours && durationHours > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {durationHours}h
              </span>
            )}
            {course?.level && (
              <Badge variant="secondary" className="h-5 px-2 text-[11px]">
                {levelLabels[course.level] ?? course.level}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-heading text-lg font-bold text-brand">
            {isFree ? "Free" : `$${price.toLocaleString()}`}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="hero"
              onClick={() => onAddToCart(item.courseId)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="mr-1.5 h-4 w-4" />
                  {isFree ? "Enroll" : "Add to cart"}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemove(item.courseId)}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const wishlistQuery = useQuery({
    queryKey: ["wishlist", { page, pageSize }],
    queryFn: () =>
      enrollmentApi.listMyWishlist({ page, limit: pageSize }, accessToken!),
    enabled: Boolean(accessToken),
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: string) =>
      enrollmentApi.removeFromWishlist(courseId, accessToken!),
    onSuccess: () => {
      toast.success("Removed from wishlist.");
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove.");
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (courseId: string) => cartApi.addItem(courseId, accessToken!),
    onSuccess: () => {
      toast.success("Added to cart!");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to add to cart.",
      );
    },
  });

  const items =
    wishlistQuery.data?.items ?? wishlistQuery.data?.data ?? [];
  const total = wishlistQuery.data?.total ?? items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand">
              Wishlist
            </h1>
            {!wishlistQuery.isLoading && (
              <p className="mt-1 text-sm text-muted-foreground">
                {total} saved course{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {items.length > 0 && (
            <Link href="/cart">
              <Button variant="hero" size="sm">
                Go to cart
              </Button>
            </Link>
          )}
        </div>

        {wishlistQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : wishlistQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-destructive">
              Failed to load wishlist.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => wishlistQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Heart className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">
              Your wishlist is empty.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse courses and click &quot;Save to wishlist&quot; to add them here.
            </p>
            <Link href="/courses" className="mt-4 inline-block">
              <Button variant="hero" size="sm">
                Explore courses
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={(id) => removeMutation.mutate(id)}
                  onAddToCart={(id) => addToCartMutation.mutate(id)}
                  isRemoving={
                    removeMutation.isPending &&
                    removeMutation.variables === item.courseId
                  }
                  isAddingToCart={
                    addToCartMutation.isPending &&
                    addToCartMutation.variables === item.courseId
                  }
                />
              ))}
            </div>

            <DataPagination
              className="mt-6"
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              itemLabel="courses"
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              disabled={wishlistQuery.isFetching}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
