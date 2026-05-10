"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { pricingApi } from "@/lib/monetization-api";
import type { CoursePricingTier } from "@/types/monetization";

const TIER_OPTIONS: {
  value: CoursePricingTier;
  label: string;
  price: number;
}[] = [
  { value: "free", label: "Free", price: 0 },
  { value: "tier_99k", label: "99.000 VND", price: 99000 },
  { value: "tier_199k", label: "199.000 VND", price: 199000 },
  { value: "tier_299k", label: "299.000 VND", price: 299000 },
  { value: "tier_499k", label: "499.000 VND", price: 499000 },
  { value: "tier_799k", label: "799.000 VND", price: 799000 },
  { value: "tier_1299k", label: "1.299.000 VND", price: 1299000 },
  { value: "tier_1999k", label: "1.999.000 VND", price: 1999000 },
  { value: "custom", label: "Custom price", price: 0 },
];

const REASON_COPY: Record<string, string> = {
  PUBLIC_PROFILE_INCOMPLETE:
    "Complete your public instructor profile (legal name, headline, bio).",
  TERMS_NOT_ACCEPTED: "Accept the monetization terms of service.",
  PROMOTIONAL_NOT_DECIDED:
    "Make a decision on the promotional program (opt in or out).",
  PAYOUT_NOT_ACTIVE: "Add a bank or e-banking payout account for commissions.",
  MONETIZATION_SUSPENDED:
    "Your monetization is currently suspended. Contact support.",
  MONETIZATION_SERVICE_UNCONFIGURED: "Monetization service is not configured.",
  MONETIZATION_SERVICE_UNREACHABLE: "Monetization service is not reachable.",
  MONETIZATION_SERVICE_ERROR: "Monetization service returned an error.",
};

const schema = z
  .object({
    tier: z.enum([
      "free",
      "tier_99k",
      "tier_199k",
      "tier_299k",
      "tier_499k",
      "tier_799k",
      "tier_1299k",
      "tier_1999k",
      "custom",
    ]),
    price: z.number().min(0, "Price cannot be negative"),
    compareAtPrice: z.number().min(0).optional(),
    currency: z.string().length(3),
  })
  .refine((v) => v.tier !== "free" || v.price === 0, {
    path: ["price"],
    message: "Free courses must have price 0.",
  })
  .refine((v) => v.tier === "free" || v.price > 0, {
    path: ["price"],
    message: "Paid tiers require a price greater than 0.",
  })
  .refine(
    (v) =>
      v.compareAtPrice == null ||
      v.compareAtPrice === 0 ||
      v.compareAtPrice >= v.price,
    {
      path: ["compareAtPrice"],
      message:
        "Compare-at price must be greater than or equal to the selling price.",
    },
  );

type FormValues = z.infer<typeof schema>;

function formatVND(value: number | null | undefined): string {
  if (value == null) return "-";
  return new Intl.NumberFormat("vi-VN").format(value) + " VND";
}

export function CoursePricingPanel({ courseId }: { courseId: string }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const pricingQuery = useQuery({
    queryKey: ["course-pricing", courseId],
    queryFn: () => pricingApi.getCoursePricing(courseId, accessToken!),
    enabled: Boolean(accessToken) && Boolean(courseId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tier: "free",
      price: 0,
      compareAtPrice: undefined,
      currency: "VND",
    },
  });

  useEffect(() => {
    const data = pricingQuery.data;
    if (!data) return;
    if (data.pricing) {
      form.reset({
        tier: data.pricing.tier,
        price: data.pricing.price,
        compareAtPrice: data.pricing.compareAtPrice ?? undefined,
        currency: data.pricing.currency ?? "VND",
      });
    } else {
      form.reset({
        tier: "free",
        price: 0,
        compareAtPrice: undefined,
        currency: "VND",
      });
    }
  }, [pricingQuery.data, form]);

  const watchTier = useWatch({ control: form.control, name: "tier" });
  const pricingData = pricingQuery.data;
  const canSetPrice = Boolean(
    pricingData && (pricingData.canSetPrice ?? pricingData.canSetPaidPrice),
  );
  const blocking =
    !pricingData?.eligibility || pricingData.eligibility.canSellPaid
      ? []
      : pricingData.eligibility.reasons;
  const gateActive = Boolean(
    pricingData && !canSetPrice && !pricingData.editingLocked,
  );

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) =>
      pricingApi.updateCoursePricing(
        courseId,
        {
          tier: values.tier,
          price: values.price,
          compareAtPrice: values.compareAtPrice ?? null,
          currency: values.currency,
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Pricing saved.");
      void queryClient.invalidateQueries({
        queryKey: ["course-pricing", courseId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["instructor-course", courseId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["course-checklist", courseId],
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update pricing.";
      toast.error(msg);
    },
  });

  function onSubmit(values: FormValues) {
    updateMutation.mutate(values);
  }

  function onTierChange(next: CoursePricingTier) {
    form.setValue("tier", next);
    const preset = TIER_OPTIONS.find((o) => o.value === next);
    if (preset && next !== "custom") {
      form.setValue("price", preset.price);
    }
  }

  if (pricingQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading pricing…
      </div>
    );
  }

  if (pricingQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Cannot load pricing</AlertTitle>
        <AlertDescription>
          {pricingQuery.error instanceof Error
            ? pricingQuery.error.message
            : "Unknown error."}
        </AlertDescription>
      </Alert>
    );
  }

  const data = pricingData!;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Course pricing</h3>
        <p className="text-sm text-muted-foreground">
          Complete pre-instructor registration before saving any course pricing.
        </p>
      </div>

      {data.currentStatus && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Current course status:
          <Badge variant="outline" className="uppercase">
            {data.currentStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      )}

      {gateActive && data.eligibility && (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Pre-instructor registration required</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Finish these steps before setting pricing or submitting for
              review:
            </p>
            <ul className="ml-5 list-disc text-sm">
              {blocking.map((reason) => (
                <li key={reason}>{REASON_COPY[reason] ?? reason}</li>
              ))}
            </ul>
            <Button asChild size="sm" variant="outline" className="mt-2">
              <Link
                href={
                  data.eligibility.onboardingUrl ?? "/instructor/monetization"
                }
              >
                Open seller onboarding
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing tier</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => onTierChange(v as CoursePricingTier)}
                    disabled={data.editingLocked || !canSetPrice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Tip: choose &quot;Free&quot; to let anyone enroll without
                  payment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      disabled={
                        data.editingLocked ||
                        !canSetPrice ||
                        (watchTier !== "custom" && watchTier !== "free")
                      }
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Effective: {formatVND(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare-at price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      disabled={
                        data.editingLocked ||
                        !canSetPrice ||
                        watchTier === "free"
                      }
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Shown as the strike-through price on the course page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {data.eligibility?.canSellPaid ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Pre-instructor registration complete.
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Pricing is blocked until pre-instructor registration is
                  complete.
                </>
              )}
            </div>
            <Button
              type="submit"
              disabled={
                updateMutation.isPending || data.editingLocked || !canSetPrice
              }
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save pricing
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
