"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Loader2, MessageSquare, Search, Send } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  chatApi,
  instructorPerformanceApi,
  type ChatMessage,
  type ConversationListItem,
} from "@/lib/communication-api";
import { cn } from "@/lib/utils";

const PUBLIC_API_URL = (
  process.env.NEXT_PUBLIC_COMMUNICATION_WS_URL ??
  process.env.NEXT_PUBLIC_BROWSER_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  ""
).replace(/\/$/, "");

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatRelative(value: string): string {
  const now = new Date();
  const then = new Date(value);
  const diff = (now.getTime() - then.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(then);
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

export default function InstructorCommunicationPage() {
  const { accessToken, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conversationsQuery = useQuery({
    queryKey: ["instructor-conversations", search, unreadOnly],
    queryFn: () =>
      instructorPerformanceApi.inboxConversations(accessToken!, {
        search: search.trim() || undefined,
        unreadOnly,
        limit: 50,
      }),
    enabled: Boolean(accessToken),
    refetchInterval: 30_000,
  });

  const conversations = useMemo(
    () => conversationsQuery.data?.items ?? [],
    [conversationsQuery.data?.items],
  );

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].conversation.id);
    }
  }, [conversations, selectedConversationId]);

  const messagesQuery = useQuery({
    queryKey: ["conversation-messages", selectedConversationId],
    queryFn: () =>
      chatApi.listMessages(accessToken!, selectedConversationId!, { limit: 50 }),
    enabled: Boolean(accessToken && selectedConversationId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      chatApi.sendMessage(accessToken!, selectedConversationId!, { content }),
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: ["conversation-messages", selectedConversationId] });
      void queryClient.invalidateQueries({ queryKey: ["instructor-conversations"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: () => chatApi.markRead(accessToken!, selectedConversationId!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["instructor-conversations"] });
    },
  });

  // Socket.IO connection
  useEffect(() => {
    if (!accessToken) return;

    const socket = io(`${PUBLIC_API_URL || ""}/chat`, {
      auth: { token: accessToken },
      path: "/socket.io",
    });
    socketRef.current = socket;

    socket.on("message.created", (event: { conversationId: string; message: ChatMessage }) => {
      queryClient.setQueryData<{ items: ChatMessage[]; meta?: unknown } | undefined>(
        ["conversation-messages", event.conversationId],
        (prev) => {
          if (!prev) return prev;
          if (prev.items.some((message) => message.id === event.message.id)) return prev;
          return { ...prev, items: [...prev.items, event.message] };
        },
      );
      void queryClient.invalidateQueries({ queryKey: ["instructor-conversations"] });
    });

    socket.on("typing", (event: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (event.userId === currentUser?.id) return;
      if (event.conversationId !== selectedConversationId) return;
      setTypingUsers((prev) => ({ ...prev, [event.userId]: event.isTyping }));
    });

    socket.on("message.deleted", (event: { messageId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
      void event;
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, currentUser?.id, queryClient, selectedConversationId]);

  // Join/leave conversation room
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedConversationId) return;
    socket.emit("conversation.join", { conversationId: selectedConversationId });
    return () => {
      socket.emit("conversation.leave", { conversationId: selectedConversationId });
    };
  }, [selectedConversationId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data?.items.length]);

  const selectedConversation = useMemo<ConversationListItem | undefined>(
    () => conversations.find((item) => item.conversation.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  const otherParticipants = useMemo(() => {
    if (!selectedConversation) return [];
    return selectedConversation.conversation.participants.filter(
      (participant) => participant.userId !== currentUser?.id,
    );
  }, [selectedConversation, currentUser?.id]);

  // Mark conversation as read on selection
  useEffect(() => {
    if (
      !selectedConversationId ||
      !accessToken ||
      !selectedConversation ||
      selectedConversation.myParticipant.unreadCount <= 0
    ) {
      return;
    }
    markReadMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accessToken,
    selectedConversation,
    selectedConversationId,
  ]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content || !selectedConversationId) return;
    sendMessageMutation.mutate(content);
  };

  const handleTyping = (value: string) => {
    setDraft(value);
    if (!socketRef.current || !selectedConversationId) return;
    socketRef.current.emit("typing", {
      conversationId: selectedConversationId,
      isTyping: value.length > 0,
    });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", {
        conversationId: selectedConversationId,
        isTyping: false,
      });
    }, 2000);
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Instructor Studio
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
            Communication
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reply to your students directly. Messages sync in real time across every device.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="min-h-0 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations…"
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setUnreadOnly((value) => !value)}
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
                unreadOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              Unread only
            </button>
          </div>

          <div className="max-h-[38dvh] overflow-y-auto lg:max-h-[calc(100dvh-280px)]">
            {conversationsQuery.isLoading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-10 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet. Students who message you will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {conversations.map((item) => {
                  const peer =
                    item.conversation.participants.find(
                      (participant) => participant.userId !== currentUser?.id,
                    ) ?? item.conversation.participants[0];
                  const isActive = item.conversation.id === selectedConversationId;
                  return (
                    <li key={item.conversation.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedConversationId(item.conversation.id)}
                        className={cn(
                          "flex w-full items-start gap-3 p-3 text-left transition hover:bg-muted/40",
                          isActive && "bg-muted",
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={peer?.userAvatarUrl || undefined} />
                          <AvatarFallback>
                            {getInitials(peer?.userDisplayName ?? "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {peer?.userDisplayName ?? "Student"}
                            </p>
                            {item.conversation.lastMessageAt ? (
                              <span className="shrink-0 text-[11px] text-muted-foreground">
                                {formatRelative(item.conversation.lastMessageAt)}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {item.lastMessage?.content || "No messages yet"}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            {item.myParticipant.unreadCount > 0 ? (
                              <Badge className="h-5 px-1.5 text-[10px]">
                                {item.myParticipant.unreadCount}
                              </Badge>
                            ) : null}
                            {item.conversation.courseId ? (
                              <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                                Course
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="flex h-[62dvh] min-h-[26rem] flex-col overflow-hidden rounded-lg border border-border bg-card sm:h-[68dvh] lg:h-[calc(100dvh-220px)]">
          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Select a conversation to view messages.
              </p>
            </div>
          ) : (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={otherParticipants[0]?.userAvatarUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(otherParticipants[0]?.userDisplayName ?? "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {otherParticipants
                        .map((participant) => participant.userDisplayName)
                        .filter(Boolean)
                        .join(", ") || "Conversation"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {otherParticipants[0]?.userRole ?? "student"}
                    </p>
                  </div>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messagesQuery.isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-3/4" />
                    ))}
                  </div>
                ) : messagesQuery.data?.items.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Say hello to start the conversation.
                  </p>
                ) : (
                  messagesQuery.data?.items.map((message) => {
                    const mine = message.senderId === currentUser?.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex max-w-[88%] flex-col gap-1 sm:max-w-[75%]",
                          mine ? "ml-auto items-end" : "items-start",
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 text-sm shadow-sm",
                            mine
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-muted text-foreground",
                          )}
                        >
                          {message.content}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          {!mine ? <span>{message.senderDisplayName} ·</span> : null}
                          <span>{formatDateTime(message.createdAt)}</span>
                          {mine ? <CheckCheck className="h-3 w-3" /> : null}
                        </div>
                      </div>
                    );
                  })
                )}
                {Object.values(typingUsers).some(Boolean) ? (
                  <p className="text-xs italic text-muted-foreground">typing…</p>
                ) : null}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <textarea
                    value={draft}
                    onChange={(event) => handleTyping(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message…"
                    rows={2}
                    className="min-h-[96px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:min-h-0"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!draft.trim() || sendMessageMutation.isPending}
                    className="w-full gap-1 sm:w-auto"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
