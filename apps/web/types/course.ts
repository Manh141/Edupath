// ─── Enums kept in sync with services/course_service/prisma/schema.prisma ─────

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "AllLevels";

export type CourseStatus =
  | "draft"
  | "in_progress"
  | "pending_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "rejected"
  | "archived";

export type CourseStatusValue = CourseStatus;

export type LectureType = "video" | "article" | "resource";

export type CourseAssetType =
  | "thumbnail"
  | "promo_video"
  | "lecture_video"
  | "lecture_resource";

export type CourseAssetStatus =
  | "uploaded"
  | "processing"
  | "ready"
  | "failed"
  | "deleted";

export type CourseReviewSubmissionStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "changes_requested"
  | "rejected"
  | "superseded";

// Statuses where instructors are allowed to fully edit the course.
export const EDITABLE_STATUSES: CourseStatus[] = [
  "draft",
  "in_progress",
  "changes_requested",
];

export function isEditableStatus(status?: string | null): boolean {
  return Boolean(status) && EDITABLE_STATUSES.includes(status as CourseStatus);
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  slug?: string;
  description?: string;
  category?: Category;
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

export interface LectureAsset {
  id: string;
  lectureId?: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number | null;
  storageProvider?: string;
  bucket?: string | null;
  storageKey?: string | null;
  mimeType?: string;
  durationSec?: number | null;
  status?: CourseAssetStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLecture {
  id: string;
  sectionId?: string;
  title: string;
  slug?: string;
  description?: string;
  type: LectureType;
  videoUrl?: string;
  articleContent?: string;
  transcript?: string;
  durationSec: number;
  isPreview: boolean;
  isPublished: boolean;
  order: number;
  assets?: LectureAsset[];
  createdAt?: string;
  updatedAt?: string;

  // Legacy aliases kept for catalog/learning pages already in the codebase.
  duration?: number;
  isFree?: boolean;
  position?: number;
}

export interface CourseSection {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  order: number;
  lectures: CourseLecture[];
  createdAt?: string;
  updatedAt?: string;

  // Legacy alias.
  position?: number;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface CourseFaq {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

export interface CourseInstructor {
  id?: string;
  instructorId?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isPrimary?: boolean;
}

export interface CourseAsset {
  id: string;
  courseId: string;
  type: CourseAssetType;
  status: CourseAssetStatus;
  storageProvider?: string;
  bucket?: string | null;
  storageKey: string;
  publicUrl: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number | null;
  durationSec?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseMessage {
  welcomeMessage?: string;
  congratulationsMessage?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string | null;
  trailerUrl?: string | null;
  language?: string;
  subtitleLanguages?: string[];
  level?: CourseLevel | string;
  price?: number;
  compareAtPrice?: number | null;
  currency?: string;
  status?: CourseStatus | string;

  publishedAt?: string | null;
  approvedAt?: string | null;
  submittedAt?: string | null;
  rejectedReason?: string | null;
  changesRequested?: string | null;

  objectives?: string[];
  requirements?: string[];
  targetAudiences?: string[];
  faqs?: CourseFaq[];
  message?: CourseMessage | null;
  sections?: CourseSection[];
  assets?: CourseAsset[];

  totalStudents?: number;
  studentsCount?: number;
  averageRating?: number;
  totalReviews?: number;
  totalRatings?: number;
  totalLectures?: number;
  totalDuration?: number;
  totalDurationSec?: number;
  durationHours?: number;

  instructorId?: string;
  instructorName?: string;
  instructors?: CourseInstructor[];
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  subcategory?: Subcategory;

  createdAt?: string;
  updatedAt?: string;
}

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  thumbnailUrl?: string | null;
  price?: number;
  compareAtPrice?: number | null;
  level?: string;
  status?: CourseStatus | string;
  publishedAt?: string | null;
  approvedAt?: string | null;
  submittedAt?: string | null;
  rejectedReason?: string | null;
  changesRequested?: string | null;
  totalStudents?: number;
  studentsCount?: number;
  averageRating?: number;
  totalLectures?: number;
  totalDuration?: number;
  totalDurationSec?: number;
  durationHours?: number;
  instructorName?: string;
  instructors?: CourseInstructor[];
  categoryName?: string;
  categorySlug?: string;
  categoryId?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  subcategory?: Subcategory;
  updatedAt?: string;
  createdAt?: string;
}

export interface CourseListResponse {
  items?: CourseListItem[];
  data?: CourseListItem[];
  total?: number;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  page?: number;
  limit?: number;
}

// ─── Reviews (student feedback, kept for catalog pages) ───────────────────────

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  comment?: string;
  userDisplayName?: string;
  userAvatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isVisible?: boolean;
  user?: {
    id: string;
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

// ─── Query / DTO types used by the FE → BE contract ──────────────────────────

export interface QueryCoursesParams {
  search?: string;
  category?: string;
  subcategory?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface CreateCourseDto {
  title?: string;
  subcategoryId?: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  level?: CourseLevel | string;
  price?: number;
  compareAtPrice?: number | null;
  currency?: string;
  language?: string;
  subtitleLanguages?: string[];
  thumbnailUrl?: string;
  trailerUrl?: string;
}

export type UpdateCourseDto = Partial<CreateCourseDto>;

export interface CreateSectionDto {
  title: string;
  description?: string;
}
export type UpdateSectionDto = Partial<CreateSectionDto>;

export interface CreateLectureDto {
  title: string;
  description?: string;
  type?: LectureType;
  videoUrl?: string;
  articleContent?: string;
  transcript?: string;
  durationSec?: number;
  isPreview?: boolean;
  isPublished?: boolean;
}
export type UpdateLectureDto = Partial<CreateLectureDto>;

export interface ReorderItem {
  id: string;
  order: number;
}

export interface UpsertCourseMessageDto {
  welcomeMessage?: string;
  congratulationsMessage?: string;
}

// ─── Validation / checklist ──────────────────────────────────────────────────

export type CourseChecklistGroup =
  | "basicInfo"
  | "intendedLearners"
  | "curriculum"
  | "media"
  | "pricing"
  | "ownership";

export type CourseChecklistSeverity = "error" | "warning";

export interface CourseChecklistItem {
  group: CourseChecklistGroup;
  code: string;
  label: string;
  passed: boolean;
  severity: CourseChecklistSeverity;
  hint?: string;
}

export interface CourseChecklistIssue {
  group: CourseChecklistGroup;
  code: string;
  message: string;
  field?: string;
  severity: CourseChecklistSeverity;
}

export interface CourseChecklistGroupSummary {
  group: CourseChecklistGroup;
  total: number;
  passed: number;
}

export interface CourseChecklistReport {
  courseId: string;
  canSubmit: boolean;
  completionPercent: number;
  totals: {
    requiredItems: number;
    passedRequiredItems: number;
    errors: number;
    warnings: number;
  };
  groups: CourseChecklistGroupSummary[];
  items: CourseChecklistItem[];
  issues: CourseChecklistIssue[];
  warnings: CourseChecklistIssue[];
  generatedAt: string;
}

// ─── Moderation history & submissions ────────────────────────────────────────

export interface CourseStatusHistoryEntry {
  id: string;
  courseId: string;
  fromStatus: CourseStatus | null;
  toStatus: CourseStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  actorType: "instructor" | "admin" | "system";
  actorId: string | null;
  createdAt: string;
}

export interface CourseReviewSubmissionSnapshotLecture {
  id: string;
  type: LectureType;
  title: string;
  videoUrl: string;
  articleContent: string;
  durationSec: number;
  order: number;
  assets: { id: string }[];
}

export interface CourseReviewSubmissionSnapshotSection {
  id: string;
  title: string;
  order: number;
  lectures: CourseReviewSubmissionSnapshotLecture[];
}

export interface CourseReviewSubmissionSnapshot {
  capturedAt: string;
  submissionNote?: string | null;
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  language?: string;
  level?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  thumbnailUrl?: string;
  trailerUrl?: string;
  counts?: {
    objectives?: number;
    requirements?: number;
    targetAudiences?: number;
    sections?: number;
    lectures?: number;
  };
  pricing?: {
    tier?: string;
    price?: number;
    currency?: string;
  } | null;
  sections?: CourseReviewSubmissionSnapshotSection[];
}

export interface CourseReviewSubmissionEntry {
  id: string;
  courseId: string;
  version: number;
  status: CourseReviewSubmissionStatus;
  submittedBy: string;
  submittedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  decisionNote: string | null;
  contentSnapshot?: CourseReviewSubmissionSnapshot | null;
  validationReport?: CourseChecklistReport | null;
}

export interface SubmitForReviewResponse {
  course: Course;
  submission: {
    id: string;
    version: number;
    status: CourseReviewSubmissionStatus;
    submittedAt: string;
  };
  report: CourseChecklistReport;
}

export type InstructorOverviewPeriod = "7d" | "30d" | "90d";

export interface InstructorOverviewSeriesPoint {
  date: string;
  label: string;
  grossRevenue: number;
  instructorEarnings: number;
  platformFee: number;
  sales: number;
  enrollments: number;
}

export interface InstructorOverviewTopCourse {
  courseId: string;
  title: string;
  status: CourseStatus | string;
  students: number;
  sales: number;
  grossRevenue: number;
  instructorEarnings: number;
  platformFee: number;
  averageRating: number;
  totalReviews: number;
  categoryName?: string;
  instructorName?: string;
}

export interface InstructorOverviewActivity {
  id: string;
  type: "sale" | "enrollment";
  courseId: string;
  courseTitle: string;
  description: string;
  occurredAt: string;
  grossRevenue?: number;
  instructorEarnings?: number;
  currency?: string;
}

export interface InstructorShareTier {
  channel: string;
  instructorSharePercent: number;
  platformSharePercent: number;
}

export interface InstructorOverviewStats {
  period: InstructorOverviewPeriod;
  days: number;
  generatedAt: string;
  sharePolicy: {
    activePlan: string;
    instructorShareBps: number;
    instructorSharePercent: number;
    platformSharePercent: number;
    notes: string;
    benchmark: {
      provider: string;
      marketplaceInstructorSharePercent: number;
      instructorPromotionSharePercent: number;
    };
    recommendedTiers: InstructorShareTier[];
  };
  totals: {
    courses: number;
    publishedCourses: number;
    reviewQueueCourses: number;
    totalStudents: number;
    completedStudents: number;
    averageProgress: number;
    averageRating: number;
    totalReviews: number;
    grossRevenue: number;
    instructorEarnings: number;
    platformFee: number;
    currentSales: number;
    newEnrollments: number;
    currency: string;
  };
  deltas: {
    revenue: number;
    sales: number;
    enrollments: number;
  };
  series: InstructorOverviewSeriesPoint[];
  topCourses: InstructorOverviewTopCourse[];
  recentActivity: InstructorOverviewActivity[];
}
