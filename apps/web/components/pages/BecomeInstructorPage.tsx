"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, GraduationCap, Rocket, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, authApi } from "@/lib/auth-api";
import { isAdminUser, isInstructorUser } from "@/lib/auth-session";
import { userApi } from "@/lib/user-api";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function buildDefaultDisplayName(email?: string): string {
  const localPart = email
    ?.split("@")[0]
    ?.replace(/[._-]+/g, " ")
    .trim();
  return localPart && localPart.length >= 2 ? localPart : "EduPath Instructor";
}

export default function BecomeInstructorPage() {
  const router = useRouter();
  const {
    loading,
    isAuthenticated,
    accessToken,
    currentUser,
    refreshSession,
    setActiveRole,
  } = useAuth();

  const isAdmin = isAdminUser(currentUser);
  const alreadyInstructor = isInstructorUser(currentUser);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser?.email) return;
    setDisplayName(
      (current) => current || buildDefaultDisplayName(currentUser.email),
    );
  }, [currentUser?.email]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/auth?next=/become-instructor");
      return;
    }

    if (isAdmin) {
      router.replace("/admin/overview");
      return;
    }

    if (alreadyInstructor) {
      setActiveRole("instructor");
      router.replace("/instructor");
    }
  }, [alreadyInstructor, isAdmin, isAuthenticated, loading, router, setActiveRole]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;

    const trimmedDisplayName = displayName.trim();
    const trimmedBio = bio.trim();
    const trimmedExpertise = expertise.trim();
    const trimmedWebsiteUrl = websiteUrl.trim();

    if (
      trimmedDisplayName.length < 2 ||
      trimmedBio.length < 20 ||
      trimmedExpertise.length < 3
    ) {
      toast.error(
        "Please fill in your display name, at least 20 chars bio, and your main expertise.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await userApi.upsertInstructorProfile(
        {
          displayName: trimmedDisplayName,
          title: trimmedExpertise,
          about: trimmedBio,
          websiteUrl: trimmedWebsiteUrl || undefined,
        },
        accessToken,
      );
      await authApi.activateInstructorRole(accessToken);
      const ok = await refreshSession();
      if (!ok) {
        toast.error("Could not refresh your session. Please sign in again.");
        return;
      }
      setActiveRole("instructor");
      toast.success("Welcome to EduPath Instructor Studio.");
      router.replace("/instructor");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to activate instructor role."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated || isAdmin || alreadyInstructor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:py-14">
      <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            EduPath · Teach
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Share what you know. Earn while you teach.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Activate instructor mode on your existing account. Your student
            progress, wishlist, and orders stay unchanged — we simply add a
            separate Instructor Studio you can switch in and out of.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <p className="mt-3 font-medium text-foreground">One account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No second sign-up. Student and instructor share the same email.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <Rocket className="h-5 w-5 text-primary" />
              <p className="mt-3 font-medium text-foreground">
                Studio is separate
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The teaching dashboard is its own space. A clear Student button
                always takes you back home.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 sm:col-span-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 font-medium text-foreground">
                Reviewed publishing
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Each course you submit is reviewed before going public.
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Changed your mind?{" "}
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Back to home
            </Link>
          </p>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Instructor profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell learners who you are. This unlocks your Instructor Studio.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                placeholder="Your public instructor name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                minLength={2}
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Main expertise</Label>
              <Input
                id="expertise"
                placeholder="e.g. Frontend engineering, Data science, UX design"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                required
                minLength={3}
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short bio</Label>
              <Textarea
                id="bio"
                placeholder="At least 20 characters about your background, what you teach, and why learners should trust you."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                minLength={20}
                maxLength={1200}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website (optional)</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Activating..." : "Activate Instructor Studio"}
            </Button>
            <p className="text-xs text-muted-foreground">
              By continuing you agree to the EduPath Instructor Terms.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
