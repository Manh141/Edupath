"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Landmark,
  Loader2,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { monetizationApi } from "@/lib/monetization-api";
import type {
  MonetizationProfile,
  OnboardingStepKey,
  PayoutAccountProvider,
  PayoutAccountPublic,
  SellerEligibility,
} from "@/types/monetization";

const TERMS_VERSION = "v1.0";

const STEP_LABELS: Record<OnboardingStepKey, string> = {
  public_profile: "Public instructor profile",
  terms: "Monetization terms",
  promotional: "Promotional program",
  payout: "Payout account",
};

const PROVIDER_LABELS: Record<PayoutAccountProvider, string> = {
  bank_transfer_vn: "Vietnam bank transfer",
  paypal: "PayPal",
  stripe_connect: "Stripe Connect",
};

function StatusPill({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <CircleDashed className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

// ── Profile form ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  legalName: z.string().min(2, "Legal name is required").max(120),
  companyName: z.string().max(120).optional(),
  publicHeadline: z.string().min(2, "Headline is required").max(60, "Max 60 characters"),
  shortBio: z.string().min(20, "At least 20 characters").max(2000),
  profileImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileSection({ profile }: { profile: MonetizationProfile }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      legalName: profile.legalName ?? "",
      companyName: profile.companyName ?? "",
      publicHeadline: profile.publicHeadline ?? "",
      shortBio: profile.shortBio ?? "",
      profileImageUrl: profile.profileImageUrl ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      monetizationApi.updateProfile(
        {
          legalName: values.legalName,
          companyName: values.companyName || undefined,
          publicHeadline: values.publicHeadline,
          shortBio: values.shortBio,
          profileImageUrl: values.profileImageUrl || undefined,
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Profile saved.");
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["monetization-eligibility"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to save profile."),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="publicHeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public headline</FormLabel>
                  <FormControl>
                    <Input maxLength={60} {...field} />
                  </FormControl>
                  <FormDescription>Up to 60 characters. Shown on your courses.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short bio</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile image URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ── Terms & promotional ─────────────────────────────────────────────────────────

function TermsSection({ profile }: { profile: MonetizationProfile }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [accepted, setAccepted] = useState(
    profile.acceptedTermsVersion === TERMS_VERSION,
  );

  const mutation = useMutation({
    mutationFn: () =>
      monetizationApi.acceptTerms(
        { termsVersion: TERMS_VERSION, accepted: true },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Terms accepted.");
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["monetization-eligibility"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to accept terms."),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monetization terms ({TERMS_VERSION})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          By accepting the monetization terms you agree to EduPath&apos;s revenue share,
          refund policy, and content guidelines for paid courses.
        </p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="accept-terms"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(Boolean(v))}
            disabled={profile.acceptedTermsVersion === TERMS_VERSION}
          />
          <Label htmlFor="accept-terms">I accept the monetization terms.</Label>
        </div>
        <Button
          onClick={() => mutation.mutate()}
          disabled={
            !accepted || mutation.isPending || profile.acceptedTermsVersion === TERMS_VERSION
          }
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {profile.acceptedTermsVersion === TERMS_VERSION ? "Accepted" : "Accept terms"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PromotionalSection({ profile }: { profile: MonetizationProfile }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [participate, setParticipate] = useState(
    profile.acceptedPromotional ? "yes" : "no",
  );

  const mutation = useMutation({
    mutationFn: (val: "yes" | "no") =>
      monetizationApi.acceptPromotional({ participate: val === "yes" }, accessToken!),
    onSuccess: () => {
      toast.success("Decision recorded.");
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["monetization-eligibility"] });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to save decision."),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotional program</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Opt in to let EduPath run promotions and discounts on your paid courses.
          You can change this later.
        </p>
        <RadioGroup
          value={participate}
          onValueChange={(v) => setParticipate(v as "yes" | "no")}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id="promo-yes" value="yes" />
            <Label htmlFor="promo-yes">Yes, include my paid courses in promotions.</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="promo-no" value="no" />
            <Label htmlFor="promo-no">No, keep my prices fixed.</Label>
          </div>
        </RadioGroup>
        <Button
          onClick={() => mutation.mutate(participate as "yes" | "no")}
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save decision
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Payout section ──────────────────────────────────────────────────────────────

const payoutSchema = z.object({
  provider: z.enum(["bank_transfer_vn", "paypal", "stripe_connect"]),
  displayName: z.string().min(1).max(120),
  holderName: z.string().min(2).max(120),
  accountRef: z.string().min(4).max(64),
  bankCode: z.string().max(32).optional(),
  country: z.string().length(2).optional(),
  currency: z.string().length(3).optional(),
});
type PayoutFormValues = z.infer<typeof payoutSchema>;

function PayoutSection({
  accounts,
}: {
  accounts: PayoutAccountPublic[];
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      provider: "bank_transfer_vn",
      displayName: "",
      holderName: "",
      accountRef: "",
      bankCode: "",
      country: "VN",
      currency: "VND",
    },
  });

  const connectMutation = useMutation({
    mutationFn: (values: PayoutFormValues) =>
      monetizationApi.connectPayoutAccount(
        {
          provider: values.provider,
          displayName: values.displayName,
          holderName: values.holderName,
          accountRef: values.accountRef,
          bankCode: values.bankCode || undefined,
          country: values.country || "VN",
          currency: values.currency || "VND",
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Payout account submitted for review.");
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["monetization-eligibility"] });
      form.reset({
        provider: "bank_transfer_vn",
        displayName: "",
        holderName: "",
        accountRef: "",
        bankCode: "",
        country: "VN",
        currency: "VND",
      });
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to connect payout account."),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => monetizationApi.setDefaultPayoutAccount(id, accessToken!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      toast.success("Default account updated.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => monetizationApi.removePayoutAccount(id, accessToken!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["monetization-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["monetization-eligibility"] });
      toast.success("Account removed.");
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Failed to remove account."),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No payout accounts yet. Connect one below. New accounts start in{" "}
            <span className="font-medium">pending review</span>.
          </p>
        ) : (
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-start gap-3">
                  <Landmark className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{acc.displayName}</span>
                      {acc.isDefault && (
                        <Badge variant="secondary">
                          <Star className="mr-1 h-3 w-3" /> Default
                        </Badge>
                      )}
                      <Badge
                        variant={acc.status === "active" ? "default" : "outline"}
                        className="uppercase"
                      >
                        {acc.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {PROVIDER_LABELS[acc.provider]} · {acc.accountRefMasked ?? "—"} ·{" "}
                      {acc.currency}
                    </div>
                    {acc.rejectedReason && (
                      <div className="mt-1 text-xs text-destructive">
                        Rejected: {acc.rejectedReason}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {acc.status === "active" && !acc.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultMutation.mutate(acc.id)}
                      disabled={setDefaultMutation.isPending}
                    >
                      Make default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMutation.mutate(acc.id)}
                    disabled={removeMutation.isPending || (acc.status === "active" && acc.isDefault)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-semibold">Connect a new payout account</h4>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => connectMutation.mutate(v))}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer_vn">
                              Vietnam bank transfer
                            </SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="stripe_connect">Stripe Connect</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="My Vietcombank account" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="holderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account holder</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>As printed on the bank record.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number / IBAN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Stored encrypted. Only the last 4 digits are shown back to you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank code (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={connectMutation.isPending}>
                {connectMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit for review
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function InstructorMonetizationPage() {
  const { accessToken } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["monetization-profile"],
    queryFn: () => monetizationApi.getProfile(accessToken!),
    enabled: Boolean(accessToken),
  });

  const eligibilityQuery = useQuery({
    queryKey: ["monetization-eligibility"],
    queryFn: () => monetizationApi.getEligibility(accessToken!),
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    if (profileQuery.isError && profileQuery.error instanceof Error) {
      toast.error(profileQuery.error.message);
    }
  }, [profileQuery.isError, profileQuery.error]);

  const stepMap = useMemo(() => {
    const map = new Map<OnboardingStepKey, boolean>();
    (eligibilityQuery.data?.onboarding ?? []).forEach((s) => {
      map.set(s.stepKey, s.status === "completed");
    });
    return map;
  }, [eligibilityQuery.data]);

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Seller onboarding</h1>
          <p className="text-sm text-muted-foreground">
            Complete these steps to sell paid courses on EduPath. Free courses do not
            require onboarding.
          </p>
        </div>

        {(profileQuery.isLoading || eligibilityQuery.isLoading) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        )}

        {eligibilityQuery.data && <EligibilitySummary eligibility={eligibilityQuery.data} stepMap={stepMap} />}

        {profileQuery.data && (
          <>
            <ProfileSection profile={profileQuery.data} />
            <TermsSection profile={profileQuery.data} />
            <PromotionalSection profile={profileQuery.data} />
            <PayoutSection accounts={profileQuery.data.payoutAccounts} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function EligibilitySummary({
  eligibility,
  stepMap,
}: {
  eligibility: SellerEligibility;
  stepMap: Map<OnboardingStepKey, boolean>;
}) {
  const ordered: OnboardingStepKey[] = ["public_profile", "terms", "promotional", "payout"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {eligibility.canSellPaid ? (
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>You are eligible to sell paid courses.</AlertTitle>
            <AlertDescription>
              Set a paid price from the course editor to start earning.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>You cannot set paid prices yet.</AlertTitle>
            <AlertDescription>
              Finish the steps below to unlock paid pricing.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2 md:grid-cols-2">
          {ordered.map((key) => (
            <StatusPill key={key} done={stepMap.get(key) ?? false} label={STEP_LABELS[key]} />
          ))}
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground">
          Identity verification status:{" "}
          <Badge variant="outline" className="uppercase">
            {eligibility.identityStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
