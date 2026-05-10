"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, reviewApi, type CourseReview } from "@/lib/communication-api";
import { cn } from "@/lib/utils";

interface CourseReviewsSectionProps {
  courseId: string;
  isEnrolled: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value?: string): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function StarRow({
  value,
  size = "sm",
  interactive,
  onChange,
}: {
  value: number;
  size?: "sm" | "lg";
  interactive?: boolean;
  onChange?: (next: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const px = size === "lg" ? "h-6 w-6" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(rating)}
          onMouseLeave={() => interactive && setHover(null)}
          onClick={() => interactive && onChange?.(rating)}
          className={cn(
            "transition",
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
          )}
          aria-label={`Rate ${rating} star${rating === 1 ? "" : "s"}`}
        >
          <Star
            className={cn(
              px,
              rating <= display
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBars({
  distribution,
  percentages,
  total,
  selectedRating,
  onSelectRating,
}: {
  distribution: Record<string | number, number>;
  percentages: Record<string | number, number>;
  total: number;
  selectedRating?: number;
  onSelectRating?: (rating: number | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating] ?? 0;
        const percent = percentages[rating] ?? 0;
        const isSelected = selectedRating === rating;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onSelectRating?.(isSelected ? undefined : rating)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition",
              "hover:bg-muted/60",
              isSelected && "bg-muted",
            )}
            disabled={!onSelectRating}
          >
            <span className="flex w-12 items-center gap-0.5 text-xs font-medium text-muted-foreground">
              {rating}
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-amber-400 transition-all"
                style={{ width: `${total > 0 ? percent : 0}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs text-muted-foreground">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewForm({
  courseId,
  existing,
}: {
  courseId: string;
  existing: CourseReview | null;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [title, setTitle] = useState<string>(existing?.title ?? "");
  const [content, setContent] = useState<string>(existing?.content ?? "");

  useEffect(() => {
    setRating(existing?.rating ?? 0);
    setTitle(existing?.title ?? "");
    setContent(existing?.content ?? "");
  }, [existing?.id, existing?.rating, existing?.title, existing?.content]);

  const mutation = useMutation({
    mutationFn: () =>
      reviewApi.upsert(accessToken!, courseId, {
        rating,
        title: title.trim() || undefined,
        content: content.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success(existing ? "Review updated" : "Review submitted. Thanks!");
      void queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      void queryClient.invalidateQueries({
        queryKey: ["course-review-aggregate", courseId],
      });
      void queryClient.invalidateQueries({ queryKey: ["my-course-review", courseId] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Could not save review.";
      toast.error(message);
    },
  });

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please choose a rating from 1 to 5 stars.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-foreground">
          {existing ? "Update your review" : "Write a review"}
        </h3>
        {existing ? (
          <Badge variant="outline" className="text-xs">
            Edited {formatDate(existing.updatedAt)}
          </Badge>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">Your rating</p>
        <div className="mt-1.5">
          <StarRow value={rating} size="lg" interactive onChange={setRating} />
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={200}
        placeholder="Review title (optional)"
        className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={4000}
        rows={4}
        placeholder="What did you think of the course? What could be improved?"
        className="mt-2 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {content.length}/4000 characters
        </p>
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {existing ? "Update review" : "Submit review"}
        </Button>
      </div>
    </div>
  );
}

export default function CourseReviewsSection({
  courseId,
  isEnrolled,
}: CourseReviewsSectionProps) {
  const { isAuthenticated, accessToken } = useAuth();
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<
    "latest" | "oldest" | "rating_desc" | "rating_asc"
  >("latest");

  const aggregateQuery = useQuery({
    queryKey: ["course-review-aggregate", courseId],
    queryFn: () => reviewApi.aggregate(courseId),
    enabled: Boolean(courseId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["course-reviews", courseId, page, rating, sort],
    queryFn: () => reviewApi.list(courseId, { page, limit: 10, rating, sort }),
    enabled: Boolean(courseId),
  });

  const myReviewQuery = useQuery({
    queryKey: ["my-course-review", courseId],
    queryFn: () => reviewApi.getMine(accessToken!, courseId),
    enabled: Boolean(accessToken && courseId && isAuthenticated && isEnrolled),
  });

  const aggregate = aggregateQuery.data;
  const items = reviewsQuery.data?.items ?? [];
  const meta = reviewsQuery.data?.meta;

  const averageDisplay = useMemo(() => {
    if (!aggregate) return "—";
    return aggregate.averageRating > 0 ? aggregate.averageRating.toFixed(2) : "—";
  }, [aggregate]);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Student feedback
          </h2>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-4xl font-bold text-foreground">
              {averageDisplay}
            </p>
            <span className="text-sm text-muted-foreground">
              · {aggregate?.totalReviews ?? 0} reviews
            </span>
          </div>
          <div className="mt-1.5">
            <StarRow value={Math.round(aggregate?.averageRating ?? 0)} size="lg" />
          </div>

          <div className="mt-5">
            {aggregateQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <RatingBars
                distribution={aggregate?.ratingDistribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }}
                percentages={aggregate?.ratingPercentages ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }}
                total={aggregate?.totalReviews ?? 0}
                selectedRating={rating}
                onSelectRating={(value) => {
                  setRating(value);
                  setPage(1);
                }}
              />
            )}
          </div>
        </aside>

        <div className="space-y-4">
          {isAuthenticated && isEnrolled ? (
            <ReviewForm courseId={courseId} existing={myReviewQuery.data ?? null} />
          ) : isAuthenticated ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
              Enroll in this course to leave a review.
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
              Sign in and enroll to leave a review.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-foreground">
              {aggregate?.totalReviews ?? 0} reviews
              {rating ? (
                <span className="ml-2 text-sm text-muted-foreground">
                  · {rating} star filter
                </span>
              ) : null}
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as typeof sort);
                  setPage(1);
                }}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="latest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="rating_desc">Highest rated</option>
                <option value="rating_asc">Lowest rated</option>
              </select>
              {rating ? (
                <Button variant="outline" size="sm" onClick={() => setRating(undefined)}>
                  Clear rating filter
                </Button>
              ) : null}
            </div>
          </div>

          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {reviewsQuery.isLoading ? (
              <li className="p-5">
                <Skeleton className="h-16 w-full" />
              </li>
            ) : items.length === 0 ? (
              <li className="p-8 text-center text-sm text-muted-foreground">
                No reviews yet.
              </li>
            ) : (
              items.map((review) => (
                <li key={review.id} className="flex items-start gap-3 p-5">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.userAvatarUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(review.userDisplayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {review.userDisplayName}
                      </span>
                      <StarRow value={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        · {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.title ? (
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {review.title}
                      </p>
                    ) : null}
                    {review.content ? (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {review.content}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>

          {meta && meta.totalPages > 1 ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPrev}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNext}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
