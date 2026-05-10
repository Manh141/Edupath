"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseApi } from "@/lib/course-api";
import type { Category, CourseListItem } from "@/types/course";

const LEVELS = [
  { value: "", label: "All levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

function normalizeCourse(item: CourseListItem) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    thumbnailUrl: item.thumbnailUrl ?? null,
    price: item.price ?? 0,
    level: item.level ?? "Beginner",
    durationHours:
      item.durationHours ??
      (item.totalDurationSec
        ? Math.ceil(item.totalDurationSec / 3600)
        : item.totalDuration
          ? Math.ceil(item.totalDuration / 3600)
          : null),
    studentsCount: item.studentsCount ?? item.totalStudents ?? 0,
    averageRating: item.averageRating ?? 0,
    instructorName: item.instructorName,
    categoryName: item.categoryName,
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") ?? "";

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [pageState, setPageState] = useState({ filterKey: "", page: 1 });
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const filterKey = useMemo(
    () => [debouncedSearch, categorySlug, selectedLevel, sortBy].join("|"),
    [categorySlug, debouncedSearch, selectedLevel, sortBy],
  );

  const page = pageState.filterKey === filterKey ? pageState.page : 1;

  const updatePage = useCallback(
    (next: number | ((currentPage: number) => number)) => {
      setPageState((current) => {
        const currentPage = current.filterKey === filterKey ? current.page : 1;
        const nextPage =
          typeof next === "function" ? next(currentPage) : next;

        return {
          filterKey,
          page: nextPage,
        };
      });
    },
    [filterKey],
  );

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseApi.listCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const coursesQuery = useQuery({
    queryKey: [
      "courses",
      { search: debouncedSearch, categorySlug, selectedLevel, sortBy, page },
    ],
    queryFn: () =>
      courseApi.listCourses({
        search: debouncedSearch || undefined,
        category: categorySlug || undefined,
        level: selectedLevel || undefined,
        sortBy: sortBy || undefined,
        page,
        limit: 12,
      }),
    staleTime: 60 * 1000,
  });

  const categories: Category[] = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : (categoriesQuery.data as { items?: Category[] } | undefined)?.items ?? [];

  const rawItems: CourseListItem[] = coursesQuery.data
    ? Array.isArray(coursesQuery.data)
      ? (coursesQuery.data as CourseListItem[])
      : (coursesQuery.data as { items?: CourseListItem[] }).items ?? []
    : [];

  const total: number =
    coursesQuery.data && !Array.isArray(coursesQuery.data)
      ? (coursesQuery.data as { total?: number; pagination?: { total?: number } })
          .total ??
        (coursesQuery.data as { pagination?: { total?: number } }).pagination
          ?.total ??
        rawItems.length
      : rawItems.length;

  const courses = rawItems.map(normalizeCourse);
  const totalPages = Math.ceil(total / 12);

  const currentCategory = categories.find(
    (c) => c.slug === categorySlug || c.name.toLowerCase() === categorySlug,
  );

  const hasActiveFilters = !!(debouncedSearch || categorySlug || selectedLevel);

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setSelectedLevel("");
    setSortBy("popular");
    if (categorySlug) {
      router.push("/courses");
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-brand">
          {currentCategory?.name ?? "All Courses"}
        </h1>
        {!coursesQuery.isLoading && (
          <p className="mt-1 text-muted-foreground">
            {total > 0
              ? `${total.toLocaleString()} course${total === 1 ? "" : "s"}`
              : "No courses found."}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedLevel || "_all"}
              onValueChange={(value) =>
                setSelectedLevel(value === "_all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-40 rounded-xl">
                <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value || "_all"}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-44 rounded-xl">
                <Filter className="mr-1.5 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10 gap-1"
              >
                <X className="h-4 w-4" /> Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/courses"
            className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors ${
              !categorySlug
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug ?? cat.name.toLowerCase()}`}
              className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors ${
                categorySlug === cat.slug ||
                categorySlug === cat.name.toLowerCase()
                  ? "bg-brand text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      {coursesQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-secondary"
            />
          ))}
        </div>
      ) : coursesQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-destructive">
            Failed to load courses.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => coursesQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-foreground">No courses found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search terms or filters.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <DataPagination
            className="mt-10"
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={12}
            itemLabel="courses"
            onPageChange={(next) => updatePage(next)}
            disabled={coursesQuery.isFetching}
          />
        </>
      )}
    </div>
  );
}
