import { apiRequest } from "./api-client";
import type {
  AdminUser,
  AdminUserListResponse,
  UpdateUserProfileDto,
  UpsertInstructorProfileDto,
  UserPreferences,
  UserProfile,
} from "@/types/user";

export { ApiError } from "./api-client";

export const userApi = {
  getMyProfile(accessToken: string) {
    return apiRequest<UserProfile>("/api/users/me", { accessToken });
  },

  updateMyProfile(dto: UpdateUserProfileDto, accessToken: string) {
    return apiRequest<UserProfile>("/api/users/me", {
      method: "PATCH",
      body: dto,
      accessToken,
    });
  },

  updateMyPreferences(dto: UserPreferences, accessToken: string) {
    return apiRequest<UserProfile>("/api/users/me/preferences", {
      method: "PUT",
      body: dto,
      accessToken,
    });
  },

  upsertInstructorProfile(
    dto: UpsertInstructorProfileDto,
    accessToken: string,
  ) {
    return apiRequest<UserProfile>("/api/users/me/instructor", {
      method: "PUT",
      body: dto,
      accessToken,
    });
  },

  getPublicProfile(id: string) {
    return apiRequest<UserProfile>(`/api/users/public/${id}`);
  },

  getPublicInstructorProfile(id: string) {
    return apiRequest<UserProfile>(`/api/users/instructors/${id}`);
  },
};

export const adminUserApi = {
  listUsers(
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      status?: string;
    },
    accessToken: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.searchTerm) query.set("search", params.searchTerm);
    if (params.status) query.set("status", params.status);
    const qs = query.toString();
    return apiRequest<AdminUserListResponse>(
      `/api/admin/users${qs ? `?${qs}` : ""}`,
      { accessToken },
    );
  },

  getUserById(id: string, accessToken: string) {
    return apiRequest<AdminUser>(`/api/admin/users/${id}`, { accessToken });
  },

  updateUserStatus(id: string, status: string, accessToken: string) {
    return apiRequest<AdminUser>(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: { status },
      accessToken,
    });
  },
};
