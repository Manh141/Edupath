import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  price: number;
  level: string;
  durationHours?: number | null;
  studentsCount: number;
  averageRating: number;
  instructorName?: string;
  categoryName?: string;
}

const levelLabels: Record<string, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

const levelColors: Record<string, string> = {
  beginner: "bg-primary/10 text-primary",
  intermediate: "bg-secondary/10 text-secondary",
  advanced: "bg-accent/10 text-accent-foreground",
};

export default function CourseCard({
  title,
  slug,
  thumbnailUrl,
  price,
  level,
  durationHours,
  studentsCount,
  averageRating,
  instructorName,
  categoryName,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="aspect-video overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            width={1200}
            height={675}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center gradient-hero opacity-60">
            <span className="text-3xl font-bold text-primary-foreground">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {categoryName ? (
          <span className="mb-1 text-xs font-medium text-primary">
            {categoryName}
          </span>
        ) : null}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {instructorName ? (
          <p className="mb-2 text-xs text-muted-foreground">{instructorName}</p>
        ) : null}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {averageRating > 0 ? averageRating.toFixed(1) : "Mới"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {studentsCount}
          </span>
          {durationHours ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {durationHours}h
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge className={levelColors[level] || ""} variant="secondary">
            {levelLabels[level] || level}
          </Badge>
          <span className="font-bold text-foreground">
            {price > 0 ? `${price.toLocaleString("vi-VN")}₫` : "Miễn phí"}
          </span>
        </div>
      </div>
    </Link>
  );
}
