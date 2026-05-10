import { apiRequest } from "./api-client";
import type {
  Enrollment,
  EnrollmentListResponse,
  EnrollmentStatusResponse,
  UpdateProgressDto,
  WishlistItem,
  WishlistListResponse,
} from "@/types/enrollment";

export { ApiError } from "./api-client";

type AddToWishlistPayload = {
  courseId: string;
  courseSlug?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string | null;
};

function normalizeWishlistItem(item: WishlistItem): WishlistItem {
  const addedAt = item.addedAt ?? item.createdAt ?? new Date(0).toISOString();
  const course =
    item.course ??
    (item.courseId
      ? {
          id: item.courseId,
          slug: item.courseSlug ?? "",
          title: item.courseTitle ?? "Untitled course",
          thumbnailUrl: item.courseThumbnailUrl ?? null,
        }
      : undefined);

  return {
    ...item,
    addedAt,
    course,
  };
}

function normalizeWishlistResponse(
  response: WishlistListResponse,
): WishlistListResponse {
  const items = (response.items ?? response.data ?? []).map(normalizeWishlistItem);

  return {
    ...response,
    items,
    data: items,
  };
}

function normalizeEnrollment(enrollment: Enrollment): Enrollment {
  const progressPercent =
    enrollment.completionPercent ??
    enrollment.progress ??
    enrollment.courseProgress?.progressPercent ??
    0;
  const course =
    enrollment.course ??
    (enrollment.courseId
      ? {
          id: enrollment.courseId,
          slug: enrollment.courseSlug?.trim() ?? "",
          title: enrollment.courseTitle?.trim() || "Untitled course",
          thumbnailUrl: enrollment.courseThumbnailUrl ?? null,
          totalLectures: enrollment.courseProgress?.totalLectures,
          instructorName: enrollment.instructorName,
        }
      : undefined);

  return {
    ...enrollment,
    completionPercent: progressPercent,
    progress: progressPercent,
    course,
  };
}

function normalizeEnrollmentResponse(
  response: EnrollmentListResponse,
): EnrollmentListResponse {
  const items = (response.items ?? response.data ?? []).map(normalizeEnrollment);

  return {
    ...response,
    items,
    data: items,
  };
}

export const enrollmentApi = {
  listMyEnrollments(
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      sortBy?: string;
    } = {},
    accessToken: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    const qs = query.toString();
    return apiRequest<EnrollmentListResponse>(
      `/api/my/enrollments${qs ? `?${qs}` : ""}`,
      { accessToken },
    ).then(normalizeEnrollmentResponse);
  },

  getEnrollmentByCourse(courseId: string, accessToken: string) {
    return apiRequest<Enrollment>(`/api/my/enrollments/${courseId}`, {
      accessToken,
    }).then(normalizeEnrollment);
  },

  getEnrollmentStatusByCourse(courseId: string, accessToken: string) {
    return apiRequest<EnrollmentStatusResponse>(
      `/api/my/enrollments/status/${courseId}`,
      {
        accessToken,
      },
    );
  },

  updateProgress(dto: UpdateProgressDto, accessToken: string) {
    return apiRequest<Enrollment>("/api/my/enrollments/progress", {
      method: "PATCH",
      body: dto,
      accessToken,
    });
  },

  listMyWishlist(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sort?: string;
    } = {},
    accessToken: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return apiRequest<WishlistListResponse>(
      `/api/my/wishlist${qs ? `?${qs}` : ""}`,
      { accessToken },
    ).then(normalizeWishlistResponse);
  },

  addToWishlist(payload: AddToWishlistPayload, accessToken: string) {
    return apiRequest<WishlistItem>("/api/my/wishlist", {
      method: "POST",
      body: {
        courseId: payload.courseId,
        courseSlug: payload.courseSlug,
        courseTitle: payload.courseTitle,
        courseThumbnailUrl: payload.courseThumbnailUrl ?? undefined,
      },
      accessToken,
    }).then(normalizeWishlistItem);
  },

  removeFromWishlist(courseId: string, accessToken: string) {
    return apiRequest<void>(`/api/my/wishlist/${courseId}`, {
      method: "DELETE",
      accessToken,
    });
  },
};
