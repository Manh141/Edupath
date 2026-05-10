import { apiRequest, uploadBinaryToUrl } from "./api-client";
import type {
  Category,
  Course,
  CourseAsset,
  CourseChecklistReport,
  CourseFaq,
  CourseInstructor,
  CourseLecture,
  CourseListItem,
  CourseListResponse,
  CourseReviewSubmissionEntry,
  CourseSection,
  CourseStatusHistoryEntry,
  CreateCourseDto,
  CreateLectureDto,
  CreateSectionDto,
  InstructorOverviewPeriod,
  InstructorOverviewStats,
  LectureAsset,
  QueryCoursesParams,
  ReorderItem,
  Review,
  Subcategory,
  SubmitForReviewResponse,
  UpdateCourseDto,
  UpdateLectureDto,
  UpdateSectionDto,
  UpsertCourseMessageDto,
} from "@/types/course";

export { ApiError } from "./api-client";

type ApiStringItem = string | { content?: string };
type ApiFaqItem = CourseFaq | { question?: string; answer?: string };

type ApiLecture = Partial<CourseLecture> & {
  id: string;
  title: string;
  type?: CourseLecture["type"];
  durationSec?: number;
  order?: number;
  isPreview?: boolean;
  isPublished?: boolean;
  videoUrl?: string;
  articleContent?: string;
  assets?: LectureAsset[];
  // legacy
  duration?: number;
  isFree?: boolean;
  position?: number;
};

type ApiSection = Partial<CourseSection> & {
  id: string;
  title: string;
  order?: number;
  position?: number;
  lectures?: ApiLecture[];
};

type ApiCourse = Partial<Course> & {
  id: string;
  slug: string;
  title: string;
  objectives?: ApiStringItem[];
  requirements?: ApiStringItem[];
  targetAudiences?: ApiStringItem[];
  faqs?: ApiFaqItem[];
  sections?: ApiSection[];
  totalDurationSec?: number;
};

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeStringList(items: ApiStringItem[] | undefined): string[] {
  if (!items) return [];
  return items
    .map((item) => (typeof item === "string" ? item : item.content))
    .filter((item): item is string => Boolean(item));
}

function normalizeFaqs(items: ApiFaqItem[] | undefined): CourseFaq[] {
  if (!items) return [];
  return items
    .map((item) => ({
      question: item.question ?? "",
      answer: item.answer ?? "",
    }))
    .filter((item) => item.question || item.answer);
}

function getPrimaryInstructor(
  instructors: CourseInstructor[] | undefined,
): CourseInstructor | undefined {
  return (
    instructors?.find((instructor) => instructor.isPrimary) ?? instructors?.[0]
  );
}

function normalizeLecture(lecture: ApiLecture): CourseLecture {
  const durationSec = lecture.durationSec ?? lecture.duration ?? 0;
  const order = lecture.order ?? lecture.position ?? 0;
  const isPreview = lecture.isPreview ?? lecture.isFree ?? false;

  return {
    id: lecture.id,
    sectionId: lecture.sectionId,
    title: lecture.title,
    slug: lecture.slug,
    description: lecture.description ?? "",
    type: lecture.type ?? "video",
    videoUrl: lecture.videoUrl ?? "",
    articleContent: lecture.articleContent ?? "",
    transcript: lecture.transcript ?? "",
    durationSec,
    isPreview,
    isPublished: lecture.isPublished ?? false,
    order,
    assets: lecture.assets ?? [],
    createdAt: lecture.createdAt,
    updatedAt: lecture.updatedAt,
    duration: durationSec,
    isFree: isPreview,
    position: order,
  };
}

function normalizeSection(section: ApiSection): CourseSection {
  const order = section.order ?? section.position ?? 0;

  return {
    id: section.id,
    courseId: section.courseId,
    title: section.title,
    description: section.description ?? "",
    order,
    position: order,
    lectures: (section.lectures ?? []).map(normalizeLecture),
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

function normalizeCourseListItem(item: CourseListItem): CourseListItem {
  const primaryInstructor = getPrimaryInstructor(item.instructors);
  const category = item.subcategory?.category;
  const durationSec = item.totalDurationSec ?? item.totalDuration;

  return {
    ...item,
    instructorName: item.instructorName ?? primaryInstructor?.displayName,
    categoryId: item.categoryId ?? category?.id,
    categoryName: item.categoryName ?? category?.name,
    categorySlug: item.categorySlug ?? category?.slug,
    subcategoryId: item.subcategoryId ?? item.subcategory?.id,
    subcategoryName: item.subcategoryName ?? item.subcategory?.name,
    subcategorySlug: item.subcategorySlug ?? item.subcategory?.slug,
    durationHours:
      item.durationHours ??
      (typeof durationSec === "number" && durationSec > 0
        ? Math.ceil(durationSec / 3600)
        : undefined),
  };
}

function normalizeCourse(course: ApiCourse): Course {
  const primaryInstructor = getPrimaryInstructor(course.instructors);
  const category = course.subcategory?.category;
  const totalDurationSec = course.totalDurationSec ?? course.totalDuration ?? 0;

  return {
    ...course,
    instructorName: course.instructorName ?? primaryInstructor?.displayName,
    categoryId: course.categoryId ?? category?.id,
    categoryName: course.categoryName ?? category?.name,
    categorySlug: course.categorySlug ?? category?.slug,
    subcategoryId: course.subcategoryId ?? course.subcategory?.id,
    subcategoryName: course.subcategoryName ?? course.subcategory?.name,
    subcategorySlug: course.subcategorySlug ?? course.subcategory?.slug,
    objectives: normalizeStringList(course.objectives),
    requirements: normalizeStringList(course.requirements),
    targetAudiences: normalizeStringList(course.targetAudiences),
    faqs: normalizeFaqs(course.faqs),
    sections: (course.sections ?? []).map(normalizeSection),
    totalDuration: totalDurationSec,
    totalDurationSec,
    totalRatings: course.totalRatings ?? course.totalReviews,
    durationHours:
      course.durationHours ??
      (totalDurationSec > 0 ? Math.ceil(totalDurationSec / 3600) : undefined),
  } as Course;
}

function normalizeCourseListResponse(
  response: CourseListResponse | CourseListItem[],
): CourseListResponse | CourseListItem[] {
  if (Array.isArray(response)) {
    return response.map(normalizeCourseListItem);
  }

  const items = response.items ?? response.data ?? [];
  const normalizedItems = items.map(normalizeCourseListItem);

  return {
    ...response,
    items: normalizedItems,
    data: normalizedItems,
    total:
      response.total ?? response.pagination?.total ?? normalizedItems.length,
    page: response.page ?? response.pagination?.page,
    limit: response.limit ?? response.pagination?.limit,
  };
}

function normalizeSort(sortBy: string | undefined): string | undefined {
  switch (sortBy) {
    case "price_asc":
      return "priceAsc";
    case "price_desc":
      return "priceDesc";
    default:
      return sortBy;
  }
}

function normalizeReview(review: Review): Review {
  return {
    ...review,
    content: review.content ?? review.comment,
    user: review.user ?? {
      id: review.userId,
      fullName: review.userDisplayName,
      avatarUrl: review.userAvatarUrl,
    },
  };
}

// ─── Public endpoints ─────────────────────────────────────────────────────────

export const courseApi = {
  listCategories() {
    return apiRequest<Category[]>("/api/categories");
  },

  listSubcategories() {
    return apiRequest<Subcategory[]>("/api/categories/subcategories");
  },

  listCourses(params?: QueryCoursesParams) {
    const query = new URLSearchParams();
    if (params?.search) query.set("q", params.search);
    if (params?.category) query.set("categorySlug", params.category);
    if (params?.subcategory) query.set("subcategorySlug", params.subcategory);
    if (params?.level) query.set("level", params.level);
    if (params?.minPrice !== undefined)
      query.set("minPrice", String(params.minPrice));
    if (params?.maxPrice !== undefined)
      query.set("maxPrice", String(params.maxPrice));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const sort = normalizeSort(params?.sortBy);
    if (sort) query.set("sort", sort);
    const qs = query.toString();
    return apiRequest<CourseListResponse | CourseListItem[]>(
      `/api/courses${qs ? `?${qs}` : ""}`,
    ).then(normalizeCourseListResponse);
  },

  getCourseBySlug(slug: string) {
    return apiRequest<ApiCourse>(`/api/courses/${slug}`).then(normalizeCourse);
  },

  getCourseById(id: string, accessToken?: string) {
    return apiRequest<ApiCourse>(
      `/api/courses/${id}`,
      accessToken ? { accessToken } : {},
    ).then(normalizeCourse);
  },

  listReviews(courseId: string) {
    return apiRequest<Review[]>(`/api/courses/${courseId}/reviews`).then(
      (reviews) => reviews.map(normalizeReview),
    );
  },

  upsertReview(
    courseId: string,
    dto: { rating: number; title?: string; content?: string; comment?: string },
    accessToken: string,
  ) {
    return apiRequest<Review>(`/api/courses/${courseId}/reviews/me`, {
      method: "PUT",
      body: { ...dto, comment: dto.comment ?? dto.content },
      accessToken,
    });
  },
};

// ─── Instructor endpoints (matches services/course_service controllers) ──────

const INSTRUCTOR_BASE = "/api/instructor";

export interface UploadProgressOpts {
  onProgress?: (loaded: number, total: number) => void;
}

type DirectUploadTicket = {
  uploadUrl: string;
  method: string;
  headers?: Record<string, string>;
  storageKey: string;
  publicUrl: string;
  expiresInSec: number;
  maxBytes: number;
};

type UploadMetadata = {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

const EXTENSION_MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".zip": "application/zip",
};

function getUploadMetadata(file: File): UploadMetadata {
  const dotIndex = file.name.lastIndexOf(".");
  const extension =
    dotIndex >= 0 ? file.name.slice(dotIndex).toLowerCase() : "";

  return {
    originalName: file.name,
    mimeType:
      file.type ||
      EXTENSION_MIME_TYPES[extension] ||
      "application/octet-stream",
    sizeBytes: file.size,
  };
}

async function uploadWithSignedUrl<T>({
  initiatePath,
  completePath,
  file,
  accessToken,
  onProgress,
  completeExtra,
}: {
  initiatePath: string;
  completePath: string;
  file: File;
  accessToken: string;
  onProgress?: (loaded: number, total: number) => void;
  completeExtra?: Record<string, string | number | undefined | null>;
}): Promise<T> {
  const metadata = getUploadMetadata(file);
  const ticket = await apiRequest<DirectUploadTicket>(initiatePath, {
    method: "POST",
    body: metadata,
    accessToken,
  });

  await uploadBinaryToUrl(ticket.uploadUrl, file, {
    method: ticket.method,
    headers: ticket.headers,
    onProgress,
  });

  return apiRequest<T>(completePath, {
    method: "POST",
    body: {
      ...metadata,
      mimeType: ticket.headers?.["Content-Type"] ?? metadata.mimeType,
      storageKey: ticket.storageKey,
      ...completeExtra,
    },
    accessToken,
  });
}

export const instructorApi = {
  getOverview(period: InstructorOverviewPeriod, accessToken: string) {
    const query = new URLSearchParams({ period });
    return apiRequest<InstructorOverviewStats>(
      `/api/instructor/overview?${query.toString()}`,
      { accessToken },
    );
  },

  listMyCourses(
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
    accessToken: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    const qs = query.toString();
    return apiRequest<{ items: CourseListItem[]; total: number }>(
      `${INSTRUCTOR_BASE}/courses${qs ? `?${qs}` : ""}`,
      { accessToken },
    ).then((res) => ({
      total: res.total,
      items: (res.items ?? []).map(normalizeCourseListItem),
    }));
  },

  getCourse(id: string, accessToken: string) {
    return apiRequest<ApiCourse>(`${INSTRUCTOR_BASE}/courses/${id}`, {
      accessToken,
    }).then(normalizeCourse);
  },

  createCourse(dto: CreateCourseDto, accessToken: string) {
    return apiRequest<ApiCourse>(`${INSTRUCTOR_BASE}/courses`, {
      method: "POST",
      body: dto,
      accessToken,
    }).then(normalizeCourse);
  },

  updateCourse(id: string, dto: UpdateCourseDto, accessToken: string) {
    return apiRequest<ApiCourse>(`${INSTRUCTOR_BASE}/courses/${id}`, {
      method: "PATCH",
      body: dto,
      accessToken,
    }).then(normalizeCourse);
  },

  deleteCourse(id: string, accessToken: string) {
    return apiRequest<void>(`${INSTRUCTOR_BASE}/courses/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },

  // ── Intended learners ─────────────────────────────────────────────────────

  replaceObjectives(id: string, items: string[], accessToken: string) {
    return apiRequest<unknown>(`${INSTRUCTOR_BASE}/courses/${id}/objectives`, {
      method: "PUT",
      body: { items },
      accessToken,
    });
  },

  replaceRequirements(id: string, items: string[], accessToken: string) {
    return apiRequest<unknown>(
      `${INSTRUCTOR_BASE}/courses/${id}/requirements`,
      { method: "PUT", body: { items }, accessToken },
    );
  },

  replaceTargetAudiences(id: string, items: string[], accessToken: string) {
    return apiRequest<unknown>(
      `${INSTRUCTOR_BASE}/courses/${id}/target-audiences`,
      { method: "PUT", body: { items }, accessToken },
    );
  },

  replaceFaqs(
    id: string,
    items: { question: string; answer: string }[],
    accessToken: string,
  ) {
    return apiRequest<CourseFaq[]>(`${INSTRUCTOR_BASE}/courses/${id}/faqs`, {
      method: "PUT",
      body: { items },
      accessToken,
    });
  },

  upsertMessage(id: string, dto: UpsertCourseMessageDto, accessToken: string) {
    return apiRequest<unknown>(`${INSTRUCTOR_BASE}/courses/${id}/message`, {
      method: "PUT",
      body: dto,
      accessToken,
    });
  },

  // ── Curriculum: sections ──────────────────────────────────────────────────

  createSection(courseId: string, dto: CreateSectionDto, accessToken: string) {
    return apiRequest<CourseSection>(
      `${INSTRUCTOR_BASE}/courses/${courseId}/sections`,
      { method: "POST", body: dto, accessToken },
    );
  },

  updateSection(sectionId: string, dto: UpdateSectionDto, accessToken: string) {
    return apiRequest<CourseSection>(
      `${INSTRUCTOR_BASE}/sections/${sectionId}`,
      { method: "PATCH", body: dto, accessToken },
    );
  },

  deleteSection(sectionId: string, accessToken: string) {
    return apiRequest<void>(`${INSTRUCTOR_BASE}/sections/${sectionId}`, {
      method: "DELETE",
      accessToken,
    });
  },

  reorderSections(courseId: string, items: ReorderItem[], accessToken: string) {
    return apiRequest<void>(
      `${INSTRUCTOR_BASE}/courses/${courseId}/sections/reorder`,
      { method: "PUT", body: { items }, accessToken },
    );
  },

  // ── Curriculum: lectures ──────────────────────────────────────────────────

  createLecture(sectionId: string, dto: CreateLectureDto, accessToken: string) {
    return apiRequest<CourseLecture>(
      `${INSTRUCTOR_BASE}/sections/${sectionId}/lectures`,
      { method: "POST", body: dto, accessToken },
    );
  },

  updateLecture(lectureId: string, dto: UpdateLectureDto, accessToken: string) {
    return apiRequest<CourseLecture>(
      `${INSTRUCTOR_BASE}/lectures/${lectureId}`,
      { method: "PATCH", body: dto, accessToken },
    );
  },

  deleteLecture(lectureId: string, accessToken: string) {
    return apiRequest<void>(`${INSTRUCTOR_BASE}/lectures/${lectureId}`, {
      method: "DELETE",
      accessToken,
    });
  },

  reorderLectures(
    sectionId: string,
    items: ReorderItem[],
    accessToken: string,
  ) {
    return apiRequest<void>(
      `${INSTRUCTOR_BASE}/sections/${sectionId}/lectures/reorder`,
      { method: "PUT", body: { items }, accessToken },
    );
  },

  // ── Course assets (thumbnail / promo video) ───────────────────────────────

  uploadThumbnail(
    courseId: string,
    file: File,
    accessToken: string,
    opts?: UploadProgressOpts & { altText?: string },
  ) {
    return uploadWithSignedUrl<{ course: ApiCourse; asset: CourseAsset }>({
      initiatePath: `${INSTRUCTOR_BASE}/courses/${courseId}/assets/thumbnail/upload-url`,
      completePath: `${INSTRUCTOR_BASE}/courses/${courseId}/assets/thumbnail/complete`,
      file,
      accessToken,
      onProgress: opts?.onProgress,
      completeExtra: { altText: opts?.altText },
    }).then(({ course, asset }) => ({
      course: normalizeCourse(course),
      asset,
    }));
  },

  uploadPromoVideo(
    courseId: string,
    file: File,
    accessToken: string,
    opts?: UploadProgressOpts & { durationSec?: number },
  ) {
    return uploadWithSignedUrl<{ course: ApiCourse; asset: CourseAsset }>({
      initiatePath: `${INSTRUCTOR_BASE}/courses/${courseId}/assets/promo-video/upload-url`,
      completePath: `${INSTRUCTOR_BASE}/courses/${courseId}/assets/promo-video/complete`,
      file,
      accessToken,
      onProgress: opts?.onProgress,
      completeExtra: { durationSec: opts?.durationSec },
    }).then(({ course, asset }) => ({
      course: normalizeCourse(course),
      asset,
    }));
  },

  // ── Lecture assets ────────────────────────────────────────────────────────

  uploadLectureVideo(
    lectureId: string,
    file: File,
    accessToken: string,
    opts?: UploadProgressOpts & { durationSec?: number; name?: string },
  ) {
    return uploadWithSignedUrl<{ lecture: ApiLecture; asset: LectureAsset }>({
      initiatePath: `${INSTRUCTOR_BASE}/lectures/${lectureId}/video/upload-url`,
      completePath: `${INSTRUCTOR_BASE}/lectures/${lectureId}/video/complete`,
      file,
      accessToken,
      onProgress: opts?.onProgress,
      completeExtra: {
        durationSec: opts?.durationSec,
        name: opts?.name,
      },
    }).then(({ lecture, asset }) => ({
      lecture: normalizeLecture(lecture),
      asset,
    }));
  },

  uploadLectureResource(
    lectureId: string,
    file: File,
    accessToken: string,
    opts?: UploadProgressOpts & { name?: string },
  ) {
    return uploadWithSignedUrl<LectureAsset>({
      initiatePath: `${INSTRUCTOR_BASE}/lectures/${lectureId}/resources/upload-url`,
      completePath: `${INSTRUCTOR_BASE}/lectures/${lectureId}/resources/complete`,
      file,
      accessToken,
      onProgress: opts?.onProgress,
      completeExtra: { name: opts?.name },
    });
  },

  deleteLectureAsset(assetId: string, accessToken: string) {
    return apiRequest<void>(`${INSTRUCTOR_BASE}/lecture-assets/${assetId}`, {
      method: "DELETE",
      accessToken,
    });
  },

  // ── Review submission flow ────────────────────────────────────────────────

  getChecklist(id: string, accessToken: string) {
    return apiRequest<CourseChecklistReport>(
      `${INSTRUCTOR_BASE}/courses/${id}/checklist`,
      { accessToken },
    );
  },

  submitForReview(
    id: string,
    payload: { note?: string } | undefined,
    accessToken: string,
  ) {
    return apiRequest<SubmitForReviewResponse>(
      `${INSTRUCTOR_BASE}/courses/${id}/submit-review`,
      { method: "POST", body: payload ?? {}, accessToken },
    );
  },

  listStatusHistory(id: string, accessToken: string) {
    return apiRequest<CourseStatusHistoryEntry[]>(
      `${INSTRUCTOR_BASE}/courses/${id}/status-history`,
      { accessToken },
    );
  },

  listReviewSubmissions(id: string, accessToken: string) {
    return apiRequest<CourseReviewSubmissionEntry[]>(
      `${INSTRUCTOR_BASE}/courses/${id}/review-submissions`,
      { accessToken },
    );
  },
};

// ─── Admin endpoints ──────────────────────────────────────────────────────────

export const adminCourseApi = {
  getCourse(id: string, accessToken: string) {
    return apiRequest<ApiCourse>(`/api/admin/courses/${id}`, {
      accessToken,
    }).then(normalizeCourse);
  },

  getStatusHistory(id: string, accessToken: string) {
    return apiRequest<CourseStatusHistoryEntry[]>(
      `/api/admin/courses/${id}/status-history`,
      { accessToken },
    );
  },

  getReviewSubmissions(id: string, accessToken: string) {
    return apiRequest<CourseReviewSubmissionEntry[]>(
      `/api/admin/courses/${id}/review-submissions`,
      { accessToken },
    );
  },

  approveCourse(id: string, accessToken: string) {
    return apiRequest<Course>(`/api/admin/courses/${id}/approve`, {
      method: "POST",
      accessToken,
    });
  },

  approveAndPublishCourse(id: string, accessToken: string) {
    return apiRequest<Course>(`/api/admin/courses/${id}/approve-and-publish`, {
      method: "POST",
      accessToken,
    });
  },

  rejectCourse(id: string, reason: string | undefined, accessToken: string) {
    return apiRequest<Course>(`/api/admin/courses/${id}/reject`, {
      method: "POST",
      body: { reason },
      accessToken,
    });
  },

  publishCourse(id: string, accessToken: string) {
    return apiRequest<Course>(`/api/admin/courses/${id}/publish`, {
      method: "POST",
      accessToken,
    });
  },

  archiveCourse(id: string, accessToken: string) {
    return apiRequest<Course>(`/api/admin/courses/${id}/archive`, {
      method: "POST",
      accessToken,
    });
  },
};
