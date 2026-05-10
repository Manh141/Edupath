"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { instructorApi } from "@/lib/course-api";
import type { Course } from "@/types/course";
import { StringListEditor } from "../StringListEditor";

export function IntendedLearnersStep({
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

  const objectivesMutation = useMutation({
    mutationFn: (items: string[]) =>
      instructorApi.replaceObjectives(course.id, items, accessToken!),
    onSuccess: () => {
      toast.success("Learning outcomes saved.");
      invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Failed to save outcomes."),
  });

  const requirementsMutation = useMutation({
    mutationFn: (items: string[]) =>
      instructorApi.replaceRequirements(course.id, items, accessToken!),
    onSuccess: () => {
      toast.success("Requirements saved.");
      invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Failed to save requirements."),
  });

  const audienceMutation = useMutation({
    mutationFn: (items: string[]) =>
      instructorApi.replaceTargetAudiences(course.id, items, accessToken!),
    onSuccess: () => {
      toast.success("Target audience saved.");
      invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Failed to save audience."),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-black text-brand">
              Intended learners
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Tell students what they will achieve, what they need before starting,
              and who should take this course.
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

      <div className="grid gap-5">
        <StringListEditor
          key={`objectives-${(course.objectives ?? []).join("|")}`}
          label="What students will learn"
          description="Checklist requires at least 4 concrete learning outcomes."
          placeholder="e.g. Design a production-ready NestJS service boundary"
          items={course.objectives ?? []}
          minItems={4}
          maxItems={20}
          saving={objectivesMutation.isPending}
          disabled={!editable}
          onSave={(items) => objectivesMutation.mutate(items)}
        />

        <StringListEditor
          key={`requirements-${(course.requirements ?? []).join("|")}`}
          label="Requirements"
          description="Checklist requires at least 1 prerequisite."
          placeholder="e.g. Basic TypeScript knowledge"
          items={course.requirements ?? []}
          minItems={1}
          maxItems={20}
          saving={requirementsMutation.isPending}
          disabled={!editable}
          onSave={(items) => requirementsMutation.mutate(items)}
        />

        <StringListEditor
          key={`audience-${(course.targetAudiences ?? []).join("|")}`}
          label="Target audience"
          description="Checklist requires at least 1 audience segment."
          placeholder="e.g. Backend engineers building LMS products"
          items={course.targetAudiences ?? []}
          minItems={1}
          maxItems={20}
          saving={audienceMutation.isPending}
          disabled={!editable}
          onSave={(items) => audienceMutation.mutate(items)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" />
          Back to basic info
        </Button>
        <Button type="button" variant="outline" onClick={onNext}>
          Continue to curriculum
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
