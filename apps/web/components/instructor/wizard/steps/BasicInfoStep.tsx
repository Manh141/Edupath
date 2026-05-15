"use client";

import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, courseApi, instructorApi } from "@/lib/course-api";
import type { Course, CourseLevel } from "@/types/course";

const PICK_LATER = "__pick_later__";

const basicInfoSchema = z.object({
  title: z.string().trim().max(180, "Title must be 180 characters or fewer"),
  subtitle: z.string().trim().max(180, "Subtitle must be 180 characters or fewer"),
  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description must be 500 characters or fewer"),
  description: z.string().trim(),
  subcategoryId: z.string().optional(),
  language: z.string().trim().min(1, "Language is required").max(20),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "AllLevels"]),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

export function BasicInfoStep({
  course,
  editable,
  onChanged,
  onNext,
}: {
  course: Course;
  editable: boolean;
  onChanged: () => void;
  onNext: () => void;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseApi.listCategories(),
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => courseApi.listSubcategories(),
  });

  const groupedSubcategories = useMemo(() => {
    const categories = categoriesQuery.data ?? [];
    const subcategories = subcategoriesQuery.data ?? [];

    if (categories.length === 0) {
      return [{ id: "all", name: "All categories", subcategories }];
    }

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: subcategories.filter((item) => item.categoryId === category.id),
    }));
  }, [categoriesQuery.data, subcategoriesQuery.data]);

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: buildDefaultValues(course),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(course));
  }, [course, form]);

  const saveMutation = useMutation({
    mutationFn: (values: BasicInfoFormValues) =>
      instructorApi.updateCourse(
        course.id,
        {
          title: values.title.trim(),
          subtitle: values.subtitle.trim(),
          shortDescription: values.shortDescription.trim(),
          description: values.description.trim(),
          subcategoryId:
            values.subcategoryId && values.subcategoryId !== PICK_LATER
              ? values.subcategoryId
              : undefined,
          language: values.language.trim(),
          level: values.level,
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Draft saved.");
      void queryClient.invalidateQueries({ queryKey: ["instructor-course", course.id] });
      onChanged();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 409) {
        form.setError("title", {
          type: "server",
          message: error.message,
        });
      }
      toast.error(error instanceof Error ? error.message : "Failed to save basic info.");
    },
  });

  const handleSave = form.handleSubmit((values) => saveMutation.mutate(values));

  return (
    <div className="space-y-6">
      <StepIntro
        title="Basic info"
        description="This is your course landing page foundation: title, promise, category, language and level."
        locked={!editable}
      />

      <Form {...form}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Build Production NestJS Microservices"
                        disabled={!editable}
                        {...field}
                        onChange={(event) => {
                          if (form.formState.errors.title?.type === "server") {
                            form.clearErrors("title");
                          }
                          field.onChange(event);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Required before review. Aim for a clear outcome, not a vague topic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A crisp promise students can understand in one sentence"
                        disabled={!editable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Two or three lines for cards, share previews and quick scanning."
                        className="min-h-24"
                        disabled={!editable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain who this course is for, what students will build, and why the content is worth their time."
                        className="min-h-52"
                        disabled={!editable}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The submit checklist currently expects at least 200 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category and subcategory</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!editable}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PICK_LATER}>Choose later</SelectItem>
                        {groupedSubcategories.map((group) =>
                          group.subcategories.length > 0 ? (
                            <SelectGroup key={group.id}>
                              <SelectLabel>{group.name}</SelectLabel>
                              {group.subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : null,
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Required before review; optional while drafting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="vi" disabled={!editable} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!editable}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="AllLevels">All levels</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
                <p className="font-heading font-bold text-brand">Draft behavior</p>
                <p className="mt-1 leading-6">
                  Saving this step can move a course from draft to in progress. Once
                  submitted, backend state locks major edits until admin asks for changes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="submit"
              variant="hero"
              disabled={!editable || saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save draft
            </Button>
            <Button type="button" variant="outline" onClick={onNext}>
              Continue to learners
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function StepIntro({
  title,
  description,
  locked,
}: {
  title: string;
  description: string;
  locked: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-black text-brand">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {locked && (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Lock className="h-3.5 w-3.5" />
            Locked in current status
          </div>
        )}
      </div>
    </div>
  );
}

function buildDefaultValues(course: Course): BasicInfoFormValues {
  return {
    title: course.title ?? "",
    subtitle: course.subtitle ?? "",
    shortDescription: course.shortDescription ?? "",
    description: course.description ?? "",
    subcategoryId: course.subcategoryId ?? PICK_LATER,
    language: course.language ?? "vi",
    level: ((course.level as CourseLevel | undefined) ?? "Beginner") as BasicInfoFormValues["level"],
  };
}
