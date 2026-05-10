"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  Heart,
  HeartOff,
  Lock,
  PartyPopper,
  PlayCircle,
  RotateCcw,
  ShoppingCart,
  Star,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseReviewsSection from "@/components/course/CourseReviewsSection";
import CourseDiscussionsSection from "@/components/course/CourseDiscussionsSection";
import MessageInstructorButton from "@/components/course/MessageInstructorButton";
import { useAuth } from "@/contexts/AuthContext";
import { courseApi } from "@/lib/course-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import { cartApi } from "@/lib/payment-api";
import { ApiError } from "@/lib/api-client";
import { getCourseBySlug as getDemoCourse } from "@/data/catalog";
import { formatPrice } from "@/lib/format-price";

const levelLabels: Record<string, string> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

function formatDuration(totalSeconds?: number | null): string | null {
  if (!totalSeconds || totalSeconds <= 0) return null;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export default function CourseDetailPage({ slug }: { slug: string }) {
  const { isAuthenticated, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "success";
  const [successBannerDismissed, setSuccessBannerDismissed] = useState(false);
  const showSuccessBanner = justPaid && !successBannerDismissed;
  const [showTrailer, setShowTrailer] = useState(false);

  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: () => courseApi.getCourseBySlug(slug),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const enrollmentQuery = useQuery({
    queryKey: ["enrollment-status", courseQuery.data?.id],
    queryFn: () =>
      enrollmentApi.getEnrollmentStatusByCourse(courseQuery.data!.id, accessToken!),
    enabled: isAuthenticated && !!courseQuery.data?.id,
    retry: false,
  });

  const wishlistCheckQuery = useQuery({
    queryKey: ["wishlist-check", courseQuery.data?.id],
    queryFn: async () => {
      const res = await enrollmentApi.listMyWishlist({}, accessToken!);
      const items = res.items ?? res.data ?? [];
      return items.some((item) => item.courseId === courseQuery.data?.id);
    },
    enabled: isAuthenticated && !!courseQuery.data?.id,
    retry: false,
  });

  const cartQuery = useQuery({
    queryKey: ["cart", accessToken],
    queryFn: () => cartApi.getMyCart(accessToken!),
    enabled: isAuthenticated && Boolean(accessToken),
    staleTime: 60_000,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem(courseQuery.data!.id, accessToken!),
    onSuccess: () => {
      toast.success("Added to cart!");
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to add to cart.");
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const isInWishlist = wishlistCheckQuery.data;
      if (isInWishlist) {
        return enrollmentApi.removeFromWishlist(
          courseQuery.data!.id,
          accessToken!,
        );
      }
      return enrollmentApi.addToWishlist(
        {
          courseId: courseQuery.data!.id,
          courseSlug: courseQuery.data!.slug,
          courseTitle: courseQuery.data!.title,
          courseThumbnailUrl: courseQuery.data!.thumbnailUrl ?? undefined,
        },
        accessToken!,
      );
    },
    onSuccess: () => {
      const wasInWishlist = wishlistCheckQuery.data;
      toast.success(
        wasInWishlist ? "Removed from wishlist." : "Added to wishlist!",
      );
      void queryClient.invalidateQueries({
        queryKey: ["wishlist-check", courseQuery.data?.id],
      });
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to update wishlist.");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart.");
      return;
    }

    if (cartQuery.data?.items.some((item) => item.courseId === courseQuery.data?.id)) {
      router.push("/cart");
      return;
    }

    addToCartMutation.mutate();
  };

  const handleBuyNow = () => {
    if (!isAuthenticated || !courseQuery.data?.id) {
      toast.error("Please sign in to continue.");
      return;
    }

    router.push(`/checkout?courseId=${encodeURIComponent(courseQuery.data.id)}`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save to wishlist.");
      return;
    }
    wishlistMutation.mutate();
  };

  useEffect(() => {
    if (!justPaid) return;
    void queryClient.invalidateQueries({
      queryKey: ["enrollment-status", courseQuery.data?.id],
    });
    void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    void queryClient.invalidateQueries({ queryKey: ["cart"] });
    void queryClient.invalidateQueries({ queryKey: ["cart-count"] });
  }, [justPaid, queryClient, courseQuery.data?.id]);

  if (courseQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-secondary" />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="aspect-video animate-pulse rounded-xl bg-secondary" />
            <div className="h-6 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (courseQuery.isError || !courseQuery.data) {
    const demo = getDemoCourse(slug);
    if (!demo) {
      return (
        <div className="container mx-auto px-4 py-10 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-medium text-foreground">Course not found.</p>
          <Link href="/courses">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to courses
            </Button>
          </Link>
        </div>
      );
    }
    return <DemoCourseFallback slug={slug} />;
  }

  const course = courseQuery.data;
  const isEnrolled = enrollmentQuery.data?.enrolled === true;
  const isInWishlist = wishlistCheckQuery.data === true;
  const isInCart = Boolean(
    cartQuery.data?.items.some((item) => item.courseId === course.id),
  );
  const isFree = !course.price || course.price === 0;

  const totalLectures =
    course.sections?.reduce((sum, s) => sum + (s.lectures?.length ?? 0), 0) ??
    course.totalLectures ??
    0;
  const totalSeconds =
    course.sections
      ?.flatMap((s) => s.lectures ?? [])
      .reduce((sum, l) => sum + (l.durationSec ?? l.duration ?? 0), 0) ??
    course.totalDurationSec ??
    course.totalDuration ??
    0;
  const durationLabel = formatDuration(totalSeconds);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      {showSuccessBanner ? (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-emerald-500/40 bg-emerald-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <PartyPopper className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <p className="font-heading text-base font-semibold text-emerald-900">
                Thanh toán thành công!
              </p>
              <p className="mt-0.5 text-sm text-emerald-800">
                Bạn đã đăng ký khóa học này. Bắt đầu học ngay hoặc tiếp tục xem
                thêm khóa khác.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/learn/${course.id}`}>
              <Button variant="hero" size="sm">
                <PlayCircle className="mr-1.5 h-4 w-4" />
                Bắt đầu học
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="sm">
                Tiếp tục mua
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              onClick={() => setSuccessBannerDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Hero media (trailer or thumbnail) */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            {showTrailer && course.trailerUrl ? (
              <video
                src={course.trailerUrl}
                controls
                autoPlay
                poster={course.thumbnailUrl ?? undefined}
                className="h-full w-full bg-black object-contain"
              />
            ) : course.thumbnailUrl ? (
              <>
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover"
                />
                {course.trailerUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowTrailer(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/45"
                    aria-label="Play preview video"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <PlayCircle className="h-10 w-10 text-brand" />
                    </span>
                    <span className="sr-only">Preview this course</span>
                  </button>
                ) : null}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
                <BookOpen className="h-16 w-16 text-white/80" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div>
            {course.categoryName && (
              <span className="text-sm font-semibold text-cta">
                {course.categoryName}
              </span>
            )}
            <h1 className="mt-1 font-heading text-2xl font-bold text-brand md:text-3xl">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="mt-2 text-lg text-muted-foreground">
                {course.subtitle}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {(course.averageRating ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-cta text-cta" />
                  {course.averageRating!.toFixed(1)}
                  {course.totalRatings ? ` (${course.totalRatings})` : ""}
                </span>
              )}
              {(course.totalStudents ?? course.studentsCount ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {(
                    course.totalStudents ?? course.studentsCount ?? 0
                  ).toLocaleString()}{" "}
                  students
                </span>
              )}
              {durationLabel && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {durationLabel} total
                </span>
              )}
              {course.language && (
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {course.language.toUpperCase()}
                </span>
              )}
              {course.level && (
                <Badge
                  className={levelColors[course.level] ?? ""}
                  variant="secondary"
                >
                  {levelLabels[course.level] ?? course.level}
                </Badge>
              )}
            </div>
            {course.instructorName && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-bold text-white">
                  {course.instructorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{course.instructorName}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand">
                About this course
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            </div>
          )}

          {/* What you'll learn */}
          {course.objectives && course.objectives.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand">
                What you&apos;ll learn
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-muted-foreground">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-brand">
                Requirements
              </h2>
              <ul className="mt-3 space-y-1">
                {course.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          {course.sections && course.sections.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-brand">
                  Course content
                </h2>
                <span className="text-sm text-muted-foreground">
                  {course.sections.length} sections · {totalLectures} lectures
                  {durationLabel ? ` · ${durationLabel}` : ""}
                </span>
              </div>
              <div className="space-y-2">
                {course.sections.map((section) => (
                  <details
                    key={section.id}
                    className="group rounded-xl border border-border"
                  >
                    <summary className="flex cursor-pointer select-none items-center justify-between rounded-xl bg-secondary/50 p-4 font-medium text-foreground">
                      <span>{section.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {section.lectures?.length ?? 0} lectures
                      </span>
                    </summary>
                    <div className="divide-y divide-border px-4">
                      {(section.lectures ?? []).map((lecture, idx) => (
                        <div
                          key={lecture.id}
                          className="flex items-center gap-3 py-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {lecture.title}
                            </p>
                            {formatDuration(
                              lecture.durationSec ?? lecture.duration,
                            ) ? (
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(
                                  lecture.durationSec ?? lecture.duration,
                                )}
                              </p>
                            ) : null}
                          </div>
                          {lecture.isFree ? (
                            <PlayCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Reviews + Q&A */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold text-brand">
                Community
              </h2>
              <MessageInstructorButton course={course} />
            </div>
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="qna">Q&amp;A</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="mt-6">
                <CourseReviewsSection
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                />
              </TabsContent>
              <TabsContent value="qna" className="mt-6">
                <CourseDiscussionsSection courseId={course.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 text-center">
              {course.compareAtPrice &&
                course.compareAtPrice > (course.price ?? 0) && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(course.compareAtPrice, course.currency)}
                  </span>
                )}
              <div className="font-heading text-3xl font-bold text-brand">
                {formatPrice(course.price, course.currency)}
              </div>
            </div>

            {isEnrolled ? (
              <Link href={`/learn/${course.id}`} className="block">
                <Button size="lg" className="w-full" variant="hero">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Continue learning
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                {isFree ? (
                  <Button
                    size="lg"
                    className="w-full"
                    variant="hero"
                    onClick={handleBuyNow}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Enroll now
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="w-full"
                      variant="hero"
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                    >
                      {addToCartMutation.isPending ? (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : isInCart ? (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Go to cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to cart
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={handleBuyNow}
                    >
                      Buy now
                    </Button>
                  </>
                )}
                {!isFree ? (
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full"
                    onClick={handleWishlist}
                    disabled={wishlistMutation.isPending}
                  >
                    {isInWishlist ? (
                      <>
                        <HeartOff className="mr-2 h-4 w-4" />
                        Remove from wishlist
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Save to wishlist
                      </>
                    )}
                  </Button>
                ) : null}
                <div className="rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                  <p>
                    {isFree
                      ? "Start learning right after enrollment."
                      : "30-day money-back guarantee for paid courses."}
                  </p>
                  <p className="mt-1">Access your learning on desktop and mobile.</p>
                </div>
              </div>
            )}

            <Separator className="my-5" />

            <div className="space-y-3 text-sm">
              {course.level && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">
                    {levelLabels[course.level] ?? course.level}
                  </span>
                </div>
              )}
              {totalLectures > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lectures</span>
                  <span className="font-medium">{totalLectures}</span>
                </div>
              )}
              {durationLabel && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{durationLabel}</span>
                </div>
              )}
              {(course.totalStudents ?? course.studentsCount ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">
                    {(
                      course.totalStudents ??
                      course.studentsCount ??
                      0
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {course.language && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">
                    {course.language.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                <Link href="/auth" className="text-cta hover:underline">
                  Sign in
                </Link>{" "}
                to save this course or enroll.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback: render demo data when API is unavailable
function DemoCourseFallback({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();
  const course = getDemoCourse(slug);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Course not found.</p>
        <Link href="/courses">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-xl bg-muted">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
                <BookOpen className="h-16 w-16 text-white/80" />
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-cta">
              {course.categoryName}
            </span>
            <h1 className="mt-1 font-heading text-2xl font-bold text-brand md:text-3xl">
              {course.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-cta text-cta" />
                {course.averageRating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.studentsCount} students
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.durationHours}h
              </span>
              <Badge variant="secondary">{course.level}</Badge>
            </div>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {course.description}
          </p>
          <div>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand">
              Course content ({course.lessons.length} lectures)
            </h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lesson.title}</p>
                    {lesson.durationMinutes ? (
                      <p className="text-xs text-muted-foreground">
                        {lesson.durationMinutes} min
                      </p>
                    ) : null}
                  </div>
                  {lesson.isFree ? (
                    <PlayCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="font-heading text-3xl font-bold text-brand">
                {course.price > 0 ? `$${course.price.toLocaleString()}` : "Free"}
              </div>
            </div>
            <Button
              size="lg"
              className="w-full"
              variant="hero"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please sign in first.");
                  return;
                }
                toast.info(
                  "Enrollment will be available when the course service is online.",
                );
              }}
            >
              {course.price > 0 ? "Buy now" : "Enroll for free"}
            </Button>
            <Separator className="my-5" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lectures</span>
                <span className="font-medium">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{course.durationHours}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
