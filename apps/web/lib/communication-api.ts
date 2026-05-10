import { apiRequest } from "./api-client";

export { ApiError } from "./api-client";

export type ConversationType = "direct" | "course" | "support";
export type ParticipantRole = "member" | "owner" | "moderator";
export type MessageType = "text" | "system" | "attachment";

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  userRole: string;
  participantRole: ParticipantRole;
  lastReadMessageId?: string | null;
  lastReadAt?: string | null;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  joinedAt: string;
  leftAt?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  senderRole: string;
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown> | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  courseId?: string | null;
  lastMessageAt?: string | null;
  lastMessageId?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
}

export interface ConversationListItem {
  conversation: Conversation;
  myParticipant: ConversationParticipant;
  lastMessage: ChatMessage | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type DiscussionTargetType = "course" | "section" | "lecture";
export type DiscussionStatus = "open" | "resolved" | "closed";

export interface Discussion {
  id: string;
  courseId: string;
  targetType: DiscussionTargetType;
  sectionId?: string | null;
  lectureId?: string | null;
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl: string;
  authorRole: string;
  title: string;
  body: string;
  status: DiscussionStatus;
  isPinned: boolean;
  upvotes: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  parentReplyId?: string | null;
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl: string;
  authorRole: string;
  isInstructorReply: boolean;
  body: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  rating: number;
  title: string;
  content: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRatingAggregate {
  courseId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string | number, number>;
  ratingPercentages: Record<string | number, number>;
}

export interface InstructorPerformanceCourse {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  status?: string;
  totalStudents?: number;
  averageRating?: number;
  totalReviews?: number;
  isPrimary?: boolean;
}

export interface InstructorPerformanceOverview {
  totals: {
    totalCourses: number;
    totalStudents: number;
    totalReviews: number;
    averageRating: number;
  };
  ratingDistribution: Record<string | number, number>;
  ratingPercentages: Record<string | number, number>;
  topCourses: Array<{
    courseId: string;
    title: string;
    students: number;
    averageRating: number;
    totalReviews: number;
  }>;
  courseBreakdown: Array<{
    courseId: string;
    title: string;
    students: number;
    averageRating: number;
    totalReviews: number;
  }>;
  recentReviews: Array<CourseReview & { courseTitle: string }>;
}

export interface InstructorStudentRow {
  userId: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  status: string;
  progressPercent?: number;
  completedAt?: string | null;
}

function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, String(value));
  }
  const result = search.toString();
  return result ? `?${result}` : "";
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export const chatApi = {
  listConversations(
    accessToken: string,
    params: {
      page?: number;
      limit?: number;
      type?: ConversationType;
      courseId?: string;
      search?: string;
      includeArchived?: boolean;
      unreadOnly?: boolean;
    } = {},
  ) {
    return apiRequest<Paginated<ConversationListItem>>(
      `/api/conversations${buildQuery({
        page: params.page,
        limit: params.limit,
        type: params.type,
        courseId: params.courseId,
        search: params.search,
        includeArchived: params.includeArchived ? "true" : undefined,
        unreadOnly: params.unreadOnly ? "true" : undefined,
      })}`,
      { accessToken },
    );
  },

  unreadSummary(accessToken: string) {
    return apiRequest<{
      totalUnread: number;
      conversationsWithUnread: number;
      perConversation: Array<{ conversationId: string; unreadCount: number }>;
    }>("/api/conversations/unread-summary", { accessToken });
  },

  getConversation(accessToken: string, conversationId: string) {
    return apiRequest<Conversation>(
      `/api/conversations/${encodeURIComponent(conversationId)}`,
      { accessToken },
    );
  },

  listMessages(
    accessToken: string,
    conversationId: string,
    params: { page?: number; limit?: number; before?: string } = {},
  ) {
    return apiRequest<Paginated<ChatMessage>>(
      `/api/conversations/${encodeURIComponent(conversationId)}/messages${buildQuery({
        page: params.page,
        limit: params.limit,
        before: params.before,
      })}`,
      { accessToken },
    );
  },

  sendMessage(
    accessToken: string,
    conversationId: string,
    body: { content: string; type?: MessageType; metadata?: Record<string, unknown> },
  ) {
    return apiRequest<ChatMessage>(
      `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
      { method: "POST", body, accessToken },
    );
  },

  markRead(accessToken: string, conversationId: string, upToMessageId?: string) {
    return apiRequest<{ unreadCount: number; upToMessageId?: string }>(
      `/api/conversations/${encodeURIComponent(conversationId)}/read`,
      { method: "POST", body: { upToMessageId }, accessToken },
    );
  },

  createConversation(
    accessToken: string,
    body: {
      type?: ConversationType;
      title?: string;
      courseId?: string;
      participantIds: string[];
      initialMessage?: string;
    },
  ) {
    return apiRequest<Conversation>("/api/conversations", {
      method: "POST",
      body,
      accessToken,
    });
  },

  getOrCreateDirect(accessToken: string, otherUserId: string) {
    return apiRequest<Conversation>(
      `/api/conversations/direct/${encodeURIComponent(otherUserId)}`,
      { method: "POST", accessToken },
    );
  },

  archive(accessToken: string, conversationId: string) {
    return apiRequest<ConversationParticipant>(
      `/api/conversations/${encodeURIComponent(conversationId)}/archive`,
      { method: "PATCH", accessToken },
    );
  },

  unarchive(accessToken: string, conversationId: string) {
    return apiRequest<ConversationParticipant>(
      `/api/conversations/${encodeURIComponent(conversationId)}/unarchive`,
      { method: "PATCH", accessToken },
    );
  },

  deleteMessage(accessToken: string, messageId: string) {
    return apiRequest<ChatMessage>(
      `/api/conversations/messages/${encodeURIComponent(messageId)}`,
      { method: "DELETE", accessToken },
    );
  },
};

// ─── Discussions ─────────────────────────────────────────────────────────────

export const discussionApi = {
  list(params: {
    courseId?: string;
    sectionId?: string;
    lectureId?: string;
    targetType?: DiscussionTargetType;
    status?: DiscussionStatus;
    search?: string;
    sort?: "latest" | "oldest" | "top";
    page?: number;
    limit?: number;
  }) {
    return apiRequest<Paginated<Discussion>>(`/api/discussions${buildQuery(params)}`);
  },

  detail(discussionId: string) {
    return apiRequest<Discussion>(`/api/discussions/${encodeURIComponent(discussionId)}`);
  },

  listReplies(discussionId: string) {
    return apiRequest<DiscussionReply[]>(
      `/api/discussions/${encodeURIComponent(discussionId)}/replies`,
    );
  },

  create(
    accessToken: string,
    body: {
      courseId: string;
      targetType?: DiscussionTargetType;
      sectionId?: string;
      lectureId?: string;
      title?: string;
      body: string;
    },
  ) {
    return apiRequest<Discussion>("/api/discussions", {
      method: "POST",
      body,
      accessToken,
    });
  },

  reply(
    accessToken: string,
    discussionId: string,
    body: { body: string; parentReplyId?: string },
  ) {
    return apiRequest<DiscussionReply>(
      `/api/discussions/${encodeURIComponent(discussionId)}/replies`,
      { method: "POST", body, accessToken },
    );
  },

  update(
    accessToken: string,
    discussionId: string,
    body: {
      title?: string;
      body?: string;
      status?: DiscussionStatus;
      isPinned?: boolean;
    },
  ) {
    return apiRequest<Discussion>(
      `/api/discussions/${encodeURIComponent(discussionId)}`,
      { method: "PATCH", body, accessToken },
    );
  },

  remove(accessToken: string, discussionId: string) {
    return apiRequest<Discussion>(
      `/api/discussions/${encodeURIComponent(discussionId)}`,
      { method: "DELETE", accessToken },
    );
  },

  removeReply(accessToken: string, replyId: string) {
    return apiRequest<DiscussionReply>(
      `/api/discussions/replies/${encodeURIComponent(replyId)}`,
      { method: "DELETE", accessToken },
    );
  },
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewApi = {
  list(courseId: string, params: { page?: number; limit?: number; rating?: number; search?: string; sort?: string } = {}) {
    return apiRequest<Paginated<CourseReview>>(
      `/api/reviews/courses/${encodeURIComponent(courseId)}${buildQuery(params)}`,
    );
  },

  aggregate(courseId: string) {
    return apiRequest<CourseRatingAggregate>(
      `/api/reviews/courses/${encodeURIComponent(courseId)}/aggregate`,
    );
  },

  getMine(accessToken: string, courseId: string) {
    return apiRequest<CourseReview | null>(
      `/api/reviews/courses/${encodeURIComponent(courseId)}/me`,
      { accessToken },
    );
  },

  upsert(
    accessToken: string,
    courseId: string,
    body: { rating: number; title?: string; content?: string },
  ) {
    return apiRequest<CourseReview>(
      `/api/reviews/courses/${encodeURIComponent(courseId)}/me`,
      { method: "PUT", body, accessToken },
    );
  },

  removeMine(accessToken: string, courseId: string) {
    return apiRequest<CourseReview>(
      `/api/reviews/courses/${encodeURIComponent(courseId)}/me`,
      { method: "DELETE", accessToken },
    );
  },
};

// ─── Instructor Performance ──────────────────────────────────────────────────

export const instructorPerformanceApi = {
  overview(accessToken: string) {
    return apiRequest<InstructorPerformanceOverview>(
      "/api/instructor/performance/overview",
      { accessToken },
    );
  },

  myCourses(accessToken: string) {
    return apiRequest<InstructorPerformanceCourse[]>(
      "/api/instructor/performance/courses",
      { accessToken },
    );
  },

  students(
    accessToken: string,
    params: { page?: number; limit?: number; courseId?: string; search?: string } = {},
  ) {
    return apiRequest<Paginated<InstructorStudentRow>>(
      `/api/instructor/performance/students${buildQuery(params)}`,
      { accessToken },
    );
  },

  reviews(
    accessToken: string,
    params: {
      page?: number;
      limit?: number;
      courseId?: string;
      rating?: number;
      search?: string;
      sort?: string;
    } = {},
  ) {
    return apiRequest<Paginated<CourseReview>>(
      `/api/instructor/performance/reviews${buildQuery(params)}`,
      { accessToken },
    );
  },

  ratingDistribution(accessToken: string, courseId?: string) {
    return apiRequest<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<string | number, number>;
      ratingPercentages: Record<string | number, number>;
    }>(
      `/api/instructor/performance/rating-distribution${buildQuery({ courseId })}`,
      { accessToken },
    );
  },

  inboxConversations(
    accessToken: string,
    params: { page?: number; limit?: number; search?: string; unreadOnly?: boolean } = {},
  ) {
    return apiRequest<Paginated<ConversationListItem>>(
      `/api/instructor/communication/conversations${buildQuery({
        page: params.page,
        limit: params.limit,
        search: params.search,
        unreadOnly: params.unreadOnly ? "true" : undefined,
      })}`,
      { accessToken },
    );
  },
};
