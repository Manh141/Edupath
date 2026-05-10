"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, chatApi } from "@/lib/communication-api";
import type { Course } from "@/types/course";

interface MessageInstructorButtonProps {
  course: Course;
}

export default function MessageInstructorButton({
  course,
}: MessageInstructorButtonProps) {
  const router = useRouter();
  const { accessToken, isAuthenticated, currentUser } = useAuth();

  const primaryInstructor =
    course.instructors?.find((entry) => entry.isPrimary) ??
    course.instructors?.[0];
  const instructorId = primaryInstructor?.instructorId ?? course.instructorId;

  const isOwnCourse = Boolean(
    currentUser?.id &&
      (instructorId === currentUser.id ||
        course.instructors?.some(
          (entry) => entry.instructorId === currentUser.id,
        )),
  );

  const mutation = useMutation({
    mutationFn: () => chatApi.getOrCreateDirect(accessToken!, instructorId!),
    onSuccess: (conversation) => {
      router.push(`/messages?c=${encodeURIComponent(conversation.id)}`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Could not open chat.";
      toast.error(message);
    },
  });

  if (!instructorId || isOwnCourse) {
    return null;
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth?next=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    mutation.mutate();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleClick}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageSquare className="h-4 w-4" />
      )}
      Message instructor
    </Button>
  );
}
