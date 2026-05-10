"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircle, Pin, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  ApiError,
  discussionApi,
  type Discussion,
  type DiscussionTargetType,
} from "@/lib/communication-api";
import { cn } from "@/lib/utils";

interface CourseDiscussionsSectionProps {
  courseId: string;
  defaultTargetType?: DiscussionTargetType;
  sectionId?: string;
  lectureId?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRelative(value: string): string {
  const now = Date.now();
  const then = new Date(value).getTime();
  const diff = (now - then) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function NewQuestionForm({
  courseId,
  targetType,
  sectionId,
  lectureId,
}: {
  courseId: string;
  targetType: DiscussionTargetType;
  sectionId?: string;
  lectureId?: string;
}) {
  const { accessToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      discussionApi.create(accessToken!, {
        courseId,
        targetType,
        sectionId,
        lectureId,
        title: title.trim() || undefined,
        body: body.trim(),
      }),
    onSuccess: () => {
      toast.success("Question posted");
      setTitle("");
      setBody("");
      void queryClient.invalidateQueries({ queryKey: ["course-discussions", courseId] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Could not post question.";
      toast.error(message);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
        Sign in to ask a question.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-display text-base font-semibold text-foreground">
        Ask a question
      </h3>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={200}
        placeholder="Title (optional)"
        className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={8000}
        rows={4}
        placeholder="What is your question? Provide context to make it easier to help."
        className="mt-2 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{body.length}/8000</p>
        <Button
          onClick={() => body.trim() && mutation.mutate()}
          disabled={!body.trim() || mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Post question
        </Button>
      </div>
    </div>
  );
}

function ReplyComposer({
  discussionId,
  parentReplyId,
  onCancel,
  placeholder = "Write a reply…",
}: {
  discussionId: string;
  parentReplyId?: string;
  onCancel?: () => void;
  placeholder?: string;
}) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      discussionApi.reply(accessToken!, discussionId, {
        body: body.trim(),
        parentReplyId,
      }),
    onSuccess: () => {
      setBody("");
      void queryClient.invalidateQueries({
        queryKey: ["discussion-replies", discussionId],
      });
      void queryClient.invalidateQueries({ queryKey: ["course-discussions"] });
      onCancel?.();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Could not post reply.";
      toast.error(message);
    },
  });

  return (
    <div className="space-y-2">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={8000}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button
          size="sm"
          onClick={() => body.trim() && mutation.mutate()}
          disabled={!body.trim() || mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : null}
          Reply
        </Button>
      </div>
    </div>
  );
}

function DiscussionItem({ discussion }: { discussion: Discussion }) {
  const { isAuthenticated } = useAuth();
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const repliesQuery = useQuery({
    queryKey: ["discussion-replies", discussion.id],
    queryFn: () => discussionApi.listReplies(discussion.id),
    enabled: showReplies,
  });

  return (
    <li className="flex items-start gap-3 p-5">
      <Avatar className="h-10 w-10">
        <AvatarImage src={discussion.authorAvatarUrl || undefined} />
        <AvatarFallback>{getInitials(discussion.authorDisplayName)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">{discussion.authorDisplayName}</span>
          {discussion.authorRole === "instructor" ? (
            <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              Instructor
            </Badge>
          ) : null}
          {discussion.isPinned ? (
            <Badge variant="outline" className="gap-1">
              <Pin className="h-3 w-3" />
              Pinned
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">
            · {formatRelative(discussion.createdAt)}
          </span>
        </div>

        {discussion.title ? (
          <p className="mt-1 text-base font-semibold text-foreground">{discussion.title}</p>
        ) : null}
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
          {discussion.body}
        </p>

        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setShowReplies((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted/60"
          >
            <MessageCircle className="h-4 w-4" />
            {discussion.replyCount} {discussion.replyCount === 1 ? "reply" : "replies"}
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setShowReplyComposer(true);
                setShowReplies(true);
              }}
              className="rounded-md px-2 py-1 hover:bg-muted/60"
            >
              Reply
            </button>
          ) : null}
        </div>

        {showReplies ? (
          <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
            {repliesQuery.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              repliesQuery.data?.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.authorAvatarUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(reply.authorDisplayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {reply.authorDisplayName}
                      </span>
                      {reply.isInstructorReply ? (
                        <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
                          <ShieldCheck className="h-3 w-3" />
                          Instructor
                        </Badge>
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        · {formatRelative(reply.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                      {reply.body}
                    </p>
                  </div>
                </div>
              ))
            )}
            {showReplyComposer ? (
              <ReplyComposer
                discussionId={discussion.id}
                onCancel={() => setShowReplyComposer(false)}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default function CourseDiscussionsSection({
  courseId,
  defaultTargetType = "course",
  sectionId,
  lectureId,
}: CourseDiscussionsSectionProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "top">("latest");
  const [page, setPage] = useState(1);

  const targetType: DiscussionTargetType = lectureId
    ? "lecture"
    : sectionId
      ? "section"
      : defaultTargetType;

  const discussionsQuery = useQuery({
    queryKey: ["course-discussions", courseId, targetType, sectionId, lectureId, search, sort, page],
    queryFn: () =>
      discussionApi.list({
        courseId,
        sectionId,
        lectureId,
        targetType,
        search: search.trim() || undefined,
        sort,
        page,
        limit: 10,
      }),
    enabled: Boolean(courseId),
  });

  const items = discussionsQuery.data?.items ?? [];
  const meta = discussionsQuery.data?.meta;

  return (
    <section className="space-y-4">
      <NewQuestionForm
        courseId={courseId}
        targetType={targetType}
        sectionId={sectionId}
        lectureId={lectureId}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search questions…"
            className="w-72 pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {meta?.total ?? 0} questions
          </span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="latest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="top">Most upvoted</option>
          </select>
        </div>
      </div>

      <ul className={cn("divide-y divide-border rounded-xl border border-border bg-card")}>
        {discussionsQuery.isLoading ? (
          <li className="p-5">
            <Skeleton className="h-20 w-full" />
          </li>
        ) : items.length === 0 ? (
          <li className="p-8 text-center text-sm text-muted-foreground">
            No questions yet — be the first to ask.
          </li>
        ) : (
          items.map((discussion) => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))
        )}
      </ul>

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrev}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNext}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
