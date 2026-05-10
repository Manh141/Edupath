import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ROLES } from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CourseStatus, Prisma } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';

type Period = '7d' | '30d' | '90d';

const DEFAULT_PERIOD: Period = '30d';
const DEFAULT_INSTRUCTOR_SHARE_BPS = 7000;
const PERIOD_DAYS: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};
const REVIEW_QUEUE_STATUSES = new Set<CourseStatus>([
  CourseStatus.pending_review,
  CourseStatus.changes_requested,
  CourseStatus.approved,
]);
const instructorOverviewCourseInclude = {
  instructors: {
    orderBy: { isPrimary: 'desc' },
  },
  subcategory: {
    include: { category: true },
  },
} satisfies Prisma.CourseInclude;

type InstructorOverviewCourse = Prisma.CourseGetPayload<{
  include: typeof instructorOverviewCourseInclude;
}>;

type EnrollmentAnalytics = {
  totalStudents: number;
  completedStudents: number;
  averageProgress: number;
  currentEnrollments: number;
  previousEnrollments: number;
  enrollmentDeltaPercent: number;
  series: Array<{ date: string; label: string; value: number }>;
  byCourse: Array<{ courseId: string; students: number }>;
  recentEnrollments: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    userId: string;
    enrolledAt: string;
    status: string;
  }>;
};

type SalesAnalytics = {
  currency: string;
  instructorShareBps: number;
  grossRevenue: number;
  previousGrossRevenue: number;
  revenueDeltaPercent: number;
  instructorEarnings: number;
  platformFee: number;
  currentSales: number;
  previousSales: number;
  salesDeltaPercent: number;
  series: Array<{
    date: string;
    label: string;
    grossRevenue: number;
    instructorEarnings: number;
    platformFee: number;
    sales: number;
  }>;
  byCourse: Array<{
    courseId: string;
    title: string;
    sales: number;
    grossRevenue: number;
    instructorEarnings: number;
    platformFee: number;
  }>;
  recentSales: Array<{
    id: string;
    orderId: string;
    courseId: string;
    courseTitle: string;
    grossRevenue: number;
    instructorEarnings: number;
    platformFee: number;
    currency: string;
    paidAt: string;
  }>;
};

@Injectable()
export class InstructorAnalyticsService {
  private readonly logger = new Logger(InstructorAnalyticsService.name);
  private readonly enrollmentBaseUrl: string;
  private readonly paymentBaseUrl: string;
  private readonly internalSecret: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.enrollmentBaseUrl = (
      config.get<string>('ENROLLMENT_SERVICE_INTERNAL_URL') ?? ''
    ).replace(/\/$/, '');
    this.paymentBaseUrl = (config.get<string>('PAYMENT_SERVICE_INTERNAL_URL') ?? '').replace(
      /\/$/,
      '',
    );
    this.internalSecret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.timeoutMs = Number(config.get<string>('PAYMENT_SERVICE_TIMEOUT_MS') ?? 3000);
  }

  async getOverview(currentUser: JwtPayload, rawPeriod?: string) {
    const period = this.normalizePeriod(rawPeriod);
    const days = PERIOD_DAYS[period];
    const isAdmin = this.hasRole(currentUser, ROLES.ADMIN);
    const courseWhere = {
      deletedAt: null,
      ...(isAdmin
        ? {}
        : {
            instructors: {
              some: {
                instructorId: currentUser.sub,
              },
            },
          }),
    };

    const courses = await this.prisma.course.findMany({
      where: courseWhere,
      include: instructorOverviewCourseInclude,
      orderBy: [{ totalStudents: 'desc' }, { updatedAt: 'desc' }],
    });
    const courseIds = courses.map((course) => course.id);

    const [enrollments, sales] = await Promise.all([
      this.fetchEnrollmentAnalytics(courseIds, days),
      this.fetchSalesAnalytics(courseIds, days, DEFAULT_INSTRUCTOR_SHARE_BPS),
    ]);

    const publishedCourses = courses.filter((course) => course.status === CourseStatus.published)
      .length;
    const reviewQueueCourses = courses.filter((course) =>
      REVIEW_QUEUE_STATUSES.has(course.status),
    ).length;
    const totalReviews = courses.reduce((sum, course) => sum + course.totalReviews, 0);
    const weightedRating =
      totalReviews > 0
        ? courses.reduce((sum, course) => sum + course.averageRating * course.totalReviews, 0) /
          totalReviews
        : 0;

    return {
      period,
      days,
      generatedAt: new Date().toISOString(),
      sharePolicy: this.getSharePolicy(),
      totals: {
        courses: courses.length,
        publishedCourses,
        reviewQueueCourses,
        totalStudents: enrollments.totalStudents,
        completedStudents: enrollments.completedStudents,
        averageProgress: enrollments.averageProgress,
        averageRating: Number(weightedRating.toFixed(2)),
        totalReviews,
        grossRevenue: sales.grossRevenue,
        instructorEarnings: sales.instructorEarnings,
        platformFee: sales.platformFee,
        currentSales: sales.currentSales,
        newEnrollments: enrollments.currentEnrollments,
        currency: sales.currency,
      },
      deltas: {
        revenue: sales.revenueDeltaPercent,
        sales: sales.salesDeltaPercent,
        enrollments: enrollments.enrollmentDeltaPercent,
      },
      series: this.mergeSeries(enrollments.series, sales.series, days),
      topCourses: this.buildTopCourses(courses, enrollments, sales),
      recentActivity: this.buildRecentActivity(enrollments, sales),
    };
  }

  private normalizePeriod(period?: string): Period {
    if (period === '7d' || period === '30d' || period === '90d') {
      return period;
    }

    return DEFAULT_PERIOD;
  }

  private getSharePolicy() {
    return {
      activePlan: 'EduPath Marketplace Standard',
      instructorShareBps: DEFAULT_INSTRUCTOR_SHARE_BPS,
      instructorSharePercent: DEFAULT_INSTRUCTOR_SHARE_BPS / 100,
      platformSharePercent: (10000 - DEFAULT_INSTRUCTOR_SHARE_BPS) / 100,
      notes:
        'Applied to paid order item final price after discounts and excluding refunded orders.',
      benchmark: {
        provider: 'Udemy',
        marketplaceInstructorSharePercent: 37,
        instructorPromotionSharePercent: 97,
      },
      recommendedTiers: [
        {
          channel: 'EduPath marketplace discovery',
          instructorSharePercent: 70,
          platformSharePercent: 30,
        },
        {
          channel: 'Instructor referral or coupon',
          instructorSharePercent: 90,
          platformSharePercent: 10,
        },
        {
          channel: 'EduPath paid acquisition',
          instructorSharePercent: 50,
          platformSharePercent: 50,
        },
      ],
    };
  }

  private async fetchEnrollmentAnalytics(courseIds: string[], days: number): Promise<EnrollmentAnalytics> {
    if (!this.enrollmentBaseUrl || !this.internalSecret) {
      return this.emptyEnrollmentAnalytics();
    }

    try {
      return await this.requestInternal<EnrollmentAnalytics>(
        this.enrollmentBaseUrl,
        '/api/internal/enrollments/analytics/course-enrollments',
        { courseIds, days },
      );
    } catch (error) {
      this.logger.warn(`Enrollment analytics unavailable: ${(error as Error).message}`);
      return this.emptyEnrollmentAnalytics();
    }
  }

  private async fetchSalesAnalytics(
    courseIds: string[],
    days: number,
    instructorShareBps: number,
  ): Promise<SalesAnalytics> {
    if (!this.paymentBaseUrl || !this.internalSecret) {
      return this.emptySalesAnalytics(instructorShareBps);
    }

    try {
      return await this.requestInternal<SalesAnalytics>(
        this.paymentBaseUrl,
        '/api/internal/payments/analytics/course-sales',
        { courseIds, days, instructorShareBps },
      );
    } catch (error) {
      this.logger.warn(`Payment analytics unavailable: ${(error as Error).message}`);
      return this.emptySalesAnalytics(instructorShareBps);
    }
  }

  private async requestInternal<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'content-type': 'application/json',
          'x-internal-service-secret': this.internalSecret,
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json().catch(() => null)) as { data?: T } | T | null;

      if (!response.ok || !payload) {
        throw new Error(`HTTP ${response.status}`);
      }

      return ((payload as { data?: T }).data ?? payload) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private mergeSeries(
    enrollmentSeries: EnrollmentAnalytics['series'],
    salesSeries: SalesAnalytics['series'],
    days: number,
  ) {
    const salesMap = new Map(salesSeries.map((item) => [item.date, item]));
    const enrollmentMap = new Map(enrollmentSeries.map((item) => [item.date, item]));
    const today = new Date();

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - index - 1));
      const key = date.toISOString().slice(0, 10);
      const sales = salesMap.get(key);
      const enrollments = enrollmentMap.get(key);

      return {
        date: key,
        label:
          sales?.label ??
          enrollments?.label ??
          date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        grossRevenue: sales?.grossRevenue ?? 0,
        instructorEarnings: sales?.instructorEarnings ?? 0,
        platformFee: sales?.platformFee ?? 0,
        sales: sales?.sales ?? 0,
        enrollments: enrollments?.value ?? 0,
      };
    });
  }

  private buildTopCourses(
    courses: InstructorOverviewCourse[],
    enrollments: EnrollmentAnalytics,
    sales: SalesAnalytics,
  ) {
    const enrollmentMap = new Map(enrollments.byCourse.map((item) => [item.courseId, item]));
    const salesMap = new Map(sales.byCourse.map((item) => [item.courseId, item]));

    return courses
      .map((course) => {
        const enrollment = enrollmentMap.get(course.id);
        const sale = salesMap.get(course.id);

        return {
          courseId: course.id,
          title: course.title,
          status: course.status,
          students: enrollment?.students ?? course.totalStudents,
          sales: sale?.sales ?? 0,
          grossRevenue: sale?.grossRevenue ?? 0,
          instructorEarnings: sale?.instructorEarnings ?? 0,
          platformFee: sale?.platformFee ?? 0,
          averageRating: course.averageRating,
          totalReviews: course.totalReviews,
          categoryName: course.subcategory?.category?.name,
          instructorName:
            course.instructors.find((instructor) => instructor.isPrimary)?.displayName ??
            course.instructors[0]?.displayName,
        };
      })
      .sort(
        (left, right) =>
          right.grossRevenue - left.grossRevenue ||
          right.students - left.students ||
          right.averageRating - left.averageRating,
      )
      .slice(0, 8);
  }

  private buildRecentActivity(enrollments: EnrollmentAnalytics, sales: SalesAnalytics) {
    const enrollmentEvents = enrollments.recentEnrollments.map((item) => ({
      id: `enrollment-${item.id}`,
      type: 'enrollment' as const,
      courseId: item.courseId,
      courseTitle: item.courseTitle,
      description: `New enrollment in ${item.courseTitle}`,
      occurredAt: item.enrolledAt,
    }));
    const saleEvents = sales.recentSales.map((item) => ({
      id: `sale-${item.id}`,
      type: 'sale' as const,
      courseId: item.courseId,
      courseTitle: item.courseTitle,
      description: `Paid sale for ${item.courseTitle}`,
      occurredAt: item.paidAt,
      grossRevenue: item.grossRevenue,
      instructorEarnings: item.instructorEarnings,
      currency: item.currency,
    }));

    return [...saleEvents, ...enrollmentEvents]
      .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
      .slice(0, 8);
  }

  private emptyEnrollmentAnalytics(): EnrollmentAnalytics {
    return {
      totalStudents: 0,
      completedStudents: 0,
      averageProgress: 0,
      currentEnrollments: 0,
      previousEnrollments: 0,
      enrollmentDeltaPercent: 0,
      series: [],
      byCourse: [],
      recentEnrollments: [],
    };
  }

  private emptySalesAnalytics(instructorShareBps: number): SalesAnalytics {
    return {
      currency: 'VND',
      instructorShareBps,
      grossRevenue: 0,
      previousGrossRevenue: 0,
      revenueDeltaPercent: 0,
      instructorEarnings: 0,
      platformFee: 0,
      currentSales: 0,
      previousSales: 0,
      salesDeltaPercent: 0,
      series: [],
      byCourse: [],
      recentSales: [],
    };
  }

  private hasRole(currentUser: JwtPayload, role: string): boolean {
    return currentUser.role === role || Boolean(currentUser.roles?.includes(role));
  }
}
