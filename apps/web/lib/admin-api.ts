import { apiRequest } from "./api-client";
import type {
  AdminCourseListResponse,
  AdminDashboardStats,
  AdminOrder,
  AdminOrderListResponse,
  AdminRbac,
  CourseStats,
  EnrollmentStats,
  OrderStats,
  UserStats,
} from "@/types/admin";

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }

  const qs = query.toString();
  return `${path}${qs ? `?${qs}` : ""}`;
}

export const adminDashboardApi = {
  async getStats(accessToken: string): Promise<AdminDashboardStats> {
    const [users, courses, enrollments, orders] = await Promise.all([
      apiRequest<UserStats>("/api/admin/users/stats", { accessToken }),
      apiRequest<CourseStats>("/api/admin/courses/stats", { accessToken }),
      apiRequest<EnrollmentStats>("/api/admin/enrollments/stats", {
        accessToken,
      }),
      apiRequest<OrderStats>("/api/admin/orders/stats", { accessToken }),
    ]);

    return { users, courses, enrollments, orders };
  },
};

export const adminOrdersApi = {
  listOrders(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      provider?: string;
    },
    accessToken: string,
  ) {
    return apiRequest<AdminOrderListResponse>(
      withQuery("/api/admin/orders", params),
      { accessToken },
    );
  },

  getOrder(orderId: string, accessToken: string) {
    return apiRequest<AdminOrder>(`/api/admin/orders/${orderId}`, {
      accessToken,
    });
  },

  getStats(accessToken: string) {
    return apiRequest<OrderStats>("/api/admin/orders/stats", { accessToken });
  },
};

export const adminCoursesApi = {
  listCourses(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      categorySlug?: string;
    },
    accessToken: string,
  ) {
    return apiRequest<AdminCourseListResponse>(
      withQuery("/api/admin/courses", params),
      { accessToken },
    );
  },

  getStats(accessToken: string) {
    return apiRequest<CourseStats>("/api/admin/courses/stats", {
      accessToken,
    });
  },
};

export const adminRbacApi = {
  getRbac(accessToken: string) {
    return apiRequest<AdminRbac>("/api/auth/admin/rbac", { accessToken });
  },
};
