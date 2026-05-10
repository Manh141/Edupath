"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, ImagePlus, Loader2, Save, Trash2, User } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, ApiError } from "@/lib/user-api";

const MAX_AVATAR_DIMENSION = 512;
const MAX_AVATAR_UPLOAD_BYTES = 10 * 1024 * 1024;
const AVATAR_JPEG_QUALITY = 0.82;

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  headline: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  language: z.string().max(10).optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
});

const preferencesSchema = z.object({
  learningGoal: z.string().max(200).optional().or(z.literal("")),
  preferredLanguage: z.string().max(10).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

function toTrimmedOrEmpty(value?: string): string {
  return value?.trim() ?? "";
}

function formatLearningGoals(
  goals?: string[] | null,
  fallback?: string | null,
): string {
  if (goals && goals.length > 0) {
    return goals.join(", ");
  }
  return fallback?.trim() ?? "";
}

function parseLearningGoals(value?: string): string[] {
  return Array.from(
    new Set(
      (value ?? "")
        .split(/[\n,]/)
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read the selected image."));
    };
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the selected image."));
    image.src = src;
  });
}

async function createAvatarDataUrlFromFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > MAX_AVATAR_UPLOAD_BYTES) {
    throw new Error("Please choose an image smaller than 10MB.");
  }

  const sourceUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceUrl);
  const longestSide = Math.max(image.width, image.height);
  const scale = longestSide > MAX_AVATAR_DIMENSION
    ? MAX_AVATAR_DIMENSION / longestSide
    : 1;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process the selected image.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY);
}

function captureAvatarDataUrl(video: HTMLVideoElement): string {
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("Camera preview is not ready yet.");
  }

  const longestSide = Math.max(video.videoWidth, video.videoHeight);
  const scale = longestSide > MAX_AVATAR_DIMENSION
    ? MAX_AVATAR_DIMENSION / longestSide
    : 1;
  const width = Math.max(1, Math.round(video.videoWidth * scale));
  const height = Math.max(1, Math.round(video.videoHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not capture a frame from the camera.");
  }

  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY);
}

export default function ProfilePage() {
  const { currentUser, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPreparingAvatar, setIsPreparingAvatar] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["my-profile", accessToken],
    queryFn: () => userApi.getMyProfile(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const profile = profileQuery.data;

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      headline: "",
      phone: "",
      country: "",
      language: "",
      bio: "",
    },
  });

  const prefsForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      learningGoal: "",
      preferredLanguage: "",
    },
  });

  useEffect(() => {
    if (!profile) return;

    profileForm.reset({
      fullName: profile.fullName ?? "",
      headline: profile.headline ?? "",
      phone: profile.phone ?? profile.phoneNumber ?? "",
      country: profile.country ?? "",
      language: profile.language ?? "",
      bio: profile.bio ?? "",
    });

    prefsForm.reset({
      learningGoal: formatLearningGoals(
        profile.preferences?.learningGoals,
        profile.preferences?.learningGoal,
      ),
      preferredLanguage:
        profile.preferences?.preferredLanguage ?? profile.language ?? "",
    });
  }, [prefsForm, profile, profileForm]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (!avatarDialogOpen) {
      stopCamera();
      setCameraError(null);
    }
  }, [avatarDialogOpen, stopCamera]);

  useEffect(() => {
    if (!cameraActive || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => undefined);
  }, [cameraActive]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      userApi.updateMyProfile(
        {
          fullName: values.fullName.trim(),
          headline: toTrimmedOrEmpty(values.headline),
          phone: toTrimmedOrEmpty(values.phone),
          country: toTrimmedOrEmpty(values.country),
          language: toTrimmedOrEmpty(values.language),
          bio: toTrimmedOrEmpty(values.bio),
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Profile updated.");
      void queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update profile.",
      );
    },
  });

  const updatePrefsMutation = useMutation({
    mutationFn: (values: PreferencesFormValues) =>
      userApi.updateMyPreferences(
        {
          learningGoals: parseLearningGoals(values.learningGoal),
          preferredLanguage:
            values.preferredLanguage?.trim() ||
            profile?.preferences?.preferredLanguage ||
            profile?.language ||
            "vi",
        },
        accessToken!,
      ),
    onSuccess: () => {
      toast.success("Preferences saved.");
      void queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save preferences.",
      );
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatarUrl: string) =>
      userApi.updateMyProfile({ avatarUrl }, accessToken!),
    onSuccess: () => {
      toast.success("Avatar updated.");
      setAvatarDialogOpen(false);
      stopCamera();
      void queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update avatar.",
      );
    },
  });

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser does not support camera access.");
      return;
    }

    try {
      setCameraError(null);
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? error.message
          : "Camera access was denied.",
      );
      stopCamera();
    }
  }, [stopCamera]);

  const submitAvatarData = useCallback(
    (avatarUrl: string) => {
      updateAvatarMutation.mutate(avatarUrl);
    },
    [updateAvatarMutation],
  );

  const handleAvatarFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file) return;

      try {
        setIsPreparingAvatar(true);
        const avatarUrl = await createAvatarDataUrlFromFile(file);
        submitAvatarData(avatarUrl);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not prepare the selected image.",
        );
      } finally {
        setIsPreparingAvatar(false);
      }
    },
    [submitAvatarData],
  );

  const handleCapturePhoto = useCallback(async () => {
    try {
      setIsPreparingAvatar(true);
      if (!videoRef.current) {
        throw new Error("Camera preview is unavailable.");
      }
      const avatarUrl = captureAvatarDataUrl(videoRef.current);
      submitAvatarData(avatarUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not capture a photo from the camera.",
      );
    } finally {
      setIsPreparingAvatar(false);
    }
  }, [submitAvatarData]);

  const displayName = profile?.fullName || currentUser?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((word) => word.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarBusy = isPreparingAvatar || updateAvatarMutation.isPending;

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-brand">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account, personal information and learning preferences.
          </p>
        </div>

        <input
          ref={avatarFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-brand-gradient text-2xl font-bold text-white">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || <User className="h-8 w-8" />
              )}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-brand transition-colors hover:bg-cta hover:text-white"
              onClick={() => setAvatarDialogOpen(true)}
              aria-label="Change avatar"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold text-brand">
              {displayName}
            </p>
            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground capitalize">
              {currentUser?.role}
              {currentUser?.roles && currentUser.roles.length > 1
                ? ` · ${currentUser.roles.join(", ")}`
                : ""}
            </p>
          </div>
        </div>

        <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Update avatar</DialogTitle>
              <DialogDescription>
                Upload an image or take a photo with your camera. EduPath will
                resize it automatically for profile use.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-secondary">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                ) : profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-brand">
                    {initials || "U"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={avatarBusy}
                  onClick={() => avatarFileInputRef.current?.click()}
                >
                  {avatarBusy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="mr-2 h-4 w-4" />
                  )}
                  Upload image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={avatarBusy}
                  onClick={() => {
                    void startCamera();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Open camera
                </Button>
              </div>

              {cameraActive ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="hero"
                    className="flex-1"
                    disabled={avatarBusy}
                    onClick={() => {
                      void handleCapturePhoto();
                    }}
                  >
                    {avatarBusy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="mr-2 h-4 w-4" />
                    )}
                    Take photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={avatarBusy}
                    onClick={stopCamera}
                  >
                    Close camera
                  </Button>
                </div>
              ) : null}

              {cameraError ? (
                <p className="text-sm text-destructive">{cameraError}</p>
              ) : null}
            </div>

            <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={avatarBusy || !profile?.avatarUrl}
                onClick={() => submitAvatarData("")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove avatar
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={avatarBusy}
                onClick={() => setAvatarDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Learning Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {profileQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl bg-secondary"
                  />
                ))}
              </div>
            ) : (
              <form
                onSubmit={profileForm.handleSubmit((values) =>
                  updateProfileMutation.mutate(values),
                )}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    {...profileForm.register("fullName")}
                    placeholder="Alex Johnson"
                  />
                  {profileForm.formState.errors.fullName ? (
                    <p className="text-xs text-destructive">
                      {profileForm.formState.errors.fullName.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    {...profileForm.register("headline")}
                    placeholder="Student, creator, or lifelong learner"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      placeholder="+66 81 234 5678"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...profileForm.register("country")}
                      placeholder="Thailand"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="language">Profile language</Label>
                  <Input
                    id="language"
                    {...profileForm.register("language")}
                    placeholder="vi"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...profileForm.register("bio")}
                    rows={4}
                    placeholder="Tell us a little about yourself."
                  />
                  {profileForm.formState.errors.bio ? (
                    <p className="text-xs text-destructive">
                      {profileForm.formState.errors.bio.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="preferences">
            <form
              onSubmit={prefsForm.handleSubmit((values) =>
                updatePrefsMutation.mutate(values),
              )}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label htmlFor="learningGoal">Learning goals</Label>
                <Textarea
                  id="learningGoal"
                  {...prefsForm.register("learningGoal")}
                  rows={3}
                  placeholder="e.g. Become a full-stack developer, improve SQL skills"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple goals with commas or new lines.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preferredLanguage">Preferred language</Label>
                <Input
                  id="preferredLanguage"
                  {...prefsForm.register("preferredLanguage")}
                  placeholder="vi"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                disabled={updatePrefsMutation.isPending}
              >
                {updatePrefsMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save preferences
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-4">
              <h3 className="font-heading text-base font-semibold text-brand">
                Auth account details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "User ID", value: currentUser?.id },
                  { label: "Email", value: currentUser?.email },
                  { label: "Provider", value: currentUser?.provider },
                  {
                    label: "Email verified",
                    value: String(currentUser?.isEmailVerified),
                  },
                  { label: "Status", value: currentUser?.status },
                  { label: "Primary role", value: currentUser?.role },
                  {
                    label: "Created",
                    value: currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : undefined,
                  },
                  {
                    label: "Last login",
                    value: currentUser?.lastLoginAt
                      ? new Date(currentUser.lastLoginAt).toLocaleDateString()
                      : "N/A",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-foreground">
                      {value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground">
                To change your email address or sign-in method, please use the
                auth flow or contact support.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
