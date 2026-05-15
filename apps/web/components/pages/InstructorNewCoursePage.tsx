"use client";

import { startTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, BookOpenCheck, Layers3, Loader2, Sparkles } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, courseApi, instructorApi } from "@/lib/course-api";

const PICK_LATER = "__pick_later__";

const createCourseSchema = z.object({
  title: z.string().trim().max(180, "Title must be 180 characters or fewer").optional(),
  subcategoryId: z.string().optional(),
  language: z.string().trim().min(1, "Language is required").max(20),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "AllLevels"]),
});

type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

export default function InstructorNewCoursePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseApi.listCategories(),
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => courseApi.listSubcategories(),
  });

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      subcategoryId: PICK_LATER,
      language: "vi",
      level: "Beginner",
    },
  });

  const groupedSubcategories = useMemo(() => {
    const categories = categoriesQuery.data ?? [];
    const subcategories = subcategoriesQuery.data ?? [];

    if (categories.length === 0) {
      return [
        {
          id: "all",
          name: "All categories",
          subcategories,
        },
      ];
    }

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: subcategories.filter((item) => item.categoryId === category.id),
    }));
  }, [categoriesQuery.data, subcategoriesQuery.data]);

  const createMutation = useMutation({
    mutationFn: (values: CreateCourseFormValues) =>
      instructorApi.createCourse(
        {
          title: values.title?.trim() || undefined,
          subcategoryId:
            values.subcategoryId && values.subcategoryId !== PICK_LATER
              ? values.subcategoryId
              : undefined,
          language: values.language,
          level: values.level,
        },
        accessToken!,
      ),
    onSuccess: (course) => {
      toast.success("Course draft created. Let's shape it into something great.");
      void queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      startTransition(() => {
        router.push(`/instructor/courses/${course.id}?step=basic`);
      });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 409) {
        form.setError("title", {
          type: "server",
          message: error.message,
        });
      }
      toast.error(error instanceof Error ? error.message : "Failed to create course draft.");
    },
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,#f77f0030,transparent_34%),linear-gradient(135deg,#1b263b_0%,#253754_56%,#f8fafc_56%)]" />
      <div className="container mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_430px]">
        <section className="flex min-h-[560px] flex-col justify-between rounded-[2rem] bg-[#1b263b] p-8 text-white shadow-card-soft">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Instructor Studio
            </div>
            <h1 className="mt-8 max-w-2xl font-heading text-4xl font-black leading-tight text-white md:text-5xl">
              Create the draft first. Perfect it with the wizard next.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              EduPath now follows a Udemy-like authoring flow: draft, landing page,
              learners, curriculum, media, checklist, then admin review.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Draft-safe", "Create without forcing every field up front."],
              ["Checklist-gated", "Submit only when production rules pass."],
              ["Review-ready", "Admin submission is created after validation."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <BookOpenCheck className="mb-3 h-5 w-5 text-[#ffb15c]" />
                <p className="font-heading text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="self-start rounded-[2rem] border border-border bg-card p-6 shadow-card-soft">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cta-gradient text-white">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-brand">New course draft</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Only a few fields are useful now. Everything else is saved in the
                authoring wizard.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Master NestJS Microservices"
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
                      Optional for now. The checklist will require a stronger title later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick now or choose later" />
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
                      Optional at draft time, required before review submission.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input placeholder="vi" {...field} />
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={createMutation.isPending || !accessToken}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Create draft and open wizard
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
}
