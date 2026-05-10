"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ImagePlus, Lock, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import type { Course } from "@/types/course";
import { AssetUploader } from "../AssetUploader";

export function MediaStep({
  course,
  editable,
  onChanged,
  onPrev,
  onNext,
}: {
  course: Course;
  editable: boolean;
  onChanged: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["instructor-course", course.id] });
    onChanged();
  };

  const thumbnailMutation = useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress: (loaded: number, total: number) => void;
    }) =>
      instructorApi.uploadThumbnail(course.id, file, accessToken!, {
        altText: course.title || "Course thumbnail",
        onProgress,
      }),
    onSuccess: () => {
      toast.success("Thumbnail uploaded.");
      invalidate();
    },
  });

  const promoMutation = useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress: (loaded: number, total: number) => void;
    }) =>
      instructorApi.uploadPromoVideo(course.id, file, accessToken!, {
        onProgress,
      }),
    onSuccess: () => {
      toast.success("Promo video uploaded.");
      invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-black text-brand">
              Course media
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Upload the visual assets that make the landing page reviewable.
              Thumbnail is required; promo video is recommended.
            </p>
          </div>
          {!editable && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Lock className="h-3.5 w-3.5" />
              Locked in current status
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cta-gradient text-white">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-brand">Thumbnail</h3>
              <p className="text-xs text-muted-foreground">
                Required before submit review.
              </p>
            </div>
          </div>
          <AssetUploader
            label="Course thumbnail"
            description="Use a strong 16:9 image. Accepted: JPG, PNG, WebP."
            accept="image/jpeg,image/png,image/webp"
            maxBytes={5 * 1024 * 1024}
            disabled={!editable || thumbnailMutation.isPending}
            previewUrl={course.thumbnailUrl}
            previewKind="image"
            onUpload={(file, opts) =>
              thumbnailMutation.mutateAsync({ file, onProgress: opts.onProgress })
            }
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-white">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-brand">Promo video</h3>
              <p className="text-xs text-muted-foreground">
                Optional warning in checklist, but useful for conversion.
              </p>
            </div>
          </div>
          <AssetUploader
            label="Promo video"
            description="Accepted: MP4, WebM, MOV."
            accept="video/mp4,video/webm,video/quicktime"
            maxBytes={2 * 1024 * 1024 * 1024}
            disabled={!editable || promoMutation.isPending}
            previewUrl={course.trailerUrl}
            previewKind="video"
            onUpload={(file, opts) =>
              promoMutation.mutateAsync({ file, onProgress: opts.onProgress })
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to curriculum
        </Button>
        <Button type="button" variant="outline" onClick={onNext}>
          Continue to checklist
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
