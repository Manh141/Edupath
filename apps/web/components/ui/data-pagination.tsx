"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type DataPaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
  showPageNumbers?: boolean;
  showSummary?: boolean;
  disabled?: boolean;
  className?: string;
  itemLabel?: string;
};

function buildPageWindow(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);
  return pages;
}

export function DataPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showPageNumbers = true,
  showSummary = true,
  disabled = false,
  className,
  itemLabel = "items",
}: DataPaginationProps) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const canPrev = safePage > 1 && !disabled;
  const canNext = safePage < totalPages && !disabled;

  const fromIndex =
    pageSize && total ? Math.min((safePage - 1) * pageSize + 1, total) : null;
  const toIndex =
    pageSize && total ? Math.min(safePage * pageSize, total) : null;

  const pageWindow = showPageNumbers ? buildPageWindow(safePage, totalPages) : [];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {showSummary && total != null && fromIndex != null && toIndex != null ? (
          <span>
            Showing <span className="font-medium text-foreground">{fromIndex.toLocaleString()}–{toIndex.toLocaleString()}</span>{" "}
            of <span className="font-medium text-foreground">{total.toLocaleString()}</span>{" "}
            {itemLabel}
          </span>
        ) : showSummary && total != null ? (
          <span>
            <span className="font-medium text-foreground">{total.toLocaleString()}</span> {itemLabel}
          </span>
        ) : null}

        {onPageSizeChange ? (
          <div className="flex items-center gap-1.5">
            <span>Per page</span>
            <Select
              value={String(pageSize ?? pageSizeOptions[0])}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[72px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-1"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={!canPrev}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Previous page"
            className="h-8 gap-1 px-2.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {showPageNumbers ? (
            <div className="hidden items-center gap-1 sm:flex">
              {pageWindow.map((entry, idx) =>
                entry === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={entry}
                    variant={entry === safePage ? "default" : "ghost"}
                    size="sm"
                    aria-current={entry === safePage ? "page" : undefined}
                    aria-label={`Page ${entry}`}
                    onClick={() => onPageChange(entry)}
                    disabled={disabled}
                    className={cn(
                      "h-8 w-8 p-0 text-sm font-medium",
                      entry === safePage
                        ? "bg-brand text-white hover:bg-brand/90"
                        : "",
                    )}
                  >
                    {entry}
                  </Button>
                ),
              )}
            </div>
          ) : null}

          <span className="px-2 text-sm text-muted-foreground sm:hidden">
            Page {safePage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!canNext}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Next page"
            className="h-8 gap-1 px-2.5"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
