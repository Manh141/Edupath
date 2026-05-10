"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Code2,
  Database,
  Layers,
  Monitor,
  Palette,
  Smartphone,
} from "lucide-react";
import { courseApi } from "@/lib/course-api";
import { categories as demoCategories } from "@/data/catalog";
import type { Category, Subcategory } from "@/types/course";

const categoryIconMap: Record<string, ReactNode> = {
  Frontend: <Monitor className="h-7 w-7" />,
  Backend: <Code2 className="h-7 w-7" />,
  DevOps: <Layers className="h-7 w-7" />,
  Data: <Database className="h-7 w-7" />,
  Design: <Palette className="h-7 w-7" />,
  Mobile: <Smartphone className="h-7 w-7" />,
};

function getCategoryIcon(name: string): ReactNode {
  return categoryIconMap[name] ?? <BookOpen className="h-7 w-7" />;
}

const categoryColorMap: Record<string, string> = {
  Frontend: "bg-blue-50 text-blue-600",
  Backend: "bg-purple-50 text-purple-600",
  DevOps: "bg-orange-50 text-orange-600",
  Data: "bg-emerald-50 text-emerald-600",
  Design: "bg-pink-50 text-pink-600",
  Mobile: "bg-indigo-50 text-indigo-600",
};

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseApi.listCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => courseApi.listSubcategories(),
    staleTime: 5 * 60 * 1000,
  });

  const categories: Category[] = data
    ? Array.isArray(data)
      ? data
      : ((data as { items?: Category[] }).items ?? [])
    : demoCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
      }));

  const subcategories: Subcategory[] = subcategoriesQuery.data
    ? Array.isArray(subcategoriesQuery.data)
      ? subcategoriesQuery.data
      : ((subcategoriesQuery.data as { items?: Subcategory[] }).items ?? [])
    : [];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-brand">
          Browse Categories
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore all learning paths available on EduPath.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-secondary"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => {
            const subs = subcategories.filter((s) => s.categoryId === cat.id);
            const colorClass =
              categoryColorMap[cat.name] ?? "bg-secondary text-brand";
            const categoryHref = `/courses?category=${encodeURIComponent(
              cat.slug ?? cat.name.toLowerCase(),
            )}`;

            return (
              <Link
                key={cat.id}
                href={categoryHref}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}
                >
                  {getCategoryIcon(cat.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold text-brand">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                  {subs.length > 0 && (
                    <p className="mt-2 text-xs text-cta">
                      {subs.length} subcategories
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
