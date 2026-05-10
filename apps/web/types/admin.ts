import type { AdminUser } from "./user";
import type { CourseListItem } from "./course";
import type { Order } from "./payment";

export interface SeriesPoint {
  month: string;
  label: string;
  value?: number;
  revenue?: number;
  orders?: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  instructors: number;
  students: number;
  newUsersThisMonth: number;
  newUsersPreviousMonth: number;
  newUsersDeltaPercent: number;
  monthlyNewUsers: SeriesPoint[];
  statusBreakdown: { status: string; value: number }[];
  roleBreakdown: { role: string; members: number }[];
}

export interface CourseStats {
  totalCourses: number;
  liveCourses: number;
  pendingReview: number;
  changesRequested: number;
  totalCategories: number;
  averageRating: number;
  totalReviews: number;
  hiddenReviews: number;
  pendingReviewSubmissions: number;
  newCoursesThisMonth: number;
  newCoursesPreviousMonth: number;
  newCoursesDeltaPercent: number;
  statusBreakdown: { status: string; value: number }[];
  monthlyCreatedCourses: SeriesPoint[];
  categoryShare: { id: string; name: string; slug: string; value: number }[];
  topCourses: CourseListItem[];
}

export interface EnrollmentStats {
  totalEnrollments: number;
  active: number;
  completed: number;
  refunded: number;
  revoked: number;
  completionRate: number;
  averageProgress: number;
  newEnrollmentsThisMonth: number;
  newEnrollmentsPreviousMonth: number;
  newEnrollmentsDeltaPercent: number;
  monthlyNewEnrollments: SeriesPoint[];
  progressBuckets: { label: string; value: number }[];
  statusBreakdown: { status: string; value: number }[];
  topCourses: {
    courseId: string;
    title: string;
    slug: string;
    instructorName: string;
    enrollments: number;
  }[];
}

export interface AdminOrder extends Order {
  subtotalAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  currency?: string;
  provider?: string;
  paymentStatus?: string;
  paymentReference?: string | null;
  courseTitle?: string;
  itemCount?: number;
  createdAt?: string;
  paidAt?: string | null;
}

export interface OrderStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  refundOrders: number;
  revenueThisMonth: number;
  revenuePreviousMonth: number;
  revenueDeltaPercent: number;
  paidOrdersThisMonth: number;
  paidOrdersPreviousMonth: number;
  paidOrdersDeltaPercent: number;
  averageOrderValue: number;
  refundRate: number;
  conversionRate: number;
  funnel: { label: string; value: number }[];
  statusBreakdown: { status: string; value: number }[];
  monthlyRevenue: SeriesPoint[];
  paymentMethods: {
    provider: string;
    transactions: number;
    amount: number;
  }[];
  recentOrders: AdminOrder[];
  topCourses: {
    courseId: string;
    title: string;
    instructorName: string;
    sales: number;
    revenue: number;
  }[];
}

export interface AdminDashboardStats {
  users: UserStats;
  courses: CourseStats;
  enrollments: EnrollmentStats;
  orders: OrderStats;
}

export interface AdminOrderListResponse {
  items?: AdminOrder[];
  data?: AdminOrder[];
  total?: number;
  page?: number;
  limit?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminCourseListResponse {
  items?: CourseListItem[];
  data?: CourseListItem[];
  total?: number;
  page?: number;
  limit?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminRbac {
  roles: {
    role: string;
    description: string;
    members: number;
    inherits: string[];
  }[];
  permissionMatrix: {
    module: string;
    admin: boolean;
    instructor: boolean;
    student: boolean;
  }[];
  generatedAt: string;
}

export interface AdminUserListResponse {
  items?: AdminUser[];
  data?: AdminUser[];
  total?: number;
  page?: number;
  limit?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
