import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hasAnyRole, ROLES } from '../../common/constants/roles.constant';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../../common/utils/pagination';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CourseClient, CourseSummary } from '../external/course.client';
import { EnrollmentClient } from '../external/enrollment.client';
import { UserClient } from '../external/user.client';
import { ReviewsService } from '../reviews/reviews.service';
import { ListStudentsDto } from './dto/list-students.dto';

export interface StudentRow {
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

@Injectable()
export class InstructorPerformanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseClient: CourseClient,
    private readonly enrollmentClient: EnrollmentClient,
    private readonly userClient: UserClient,
    private readonly reviewsService: ReviewsService,
  ) {}

  async getOverview(currentUser: JwtPayload) {
    this.assertInstructorOrAdmin(currentUser);
    const courses = await this.courseClient.listCoursesByInstructor(currentUser.sub);
    const courseIds = courses.map((course) => course.id);

    if (courseIds.length === 0) {
      return {
        totals: this.emptyTotals(),
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        topCourses: [],
        courseBreakdown: [],
        recentReviews: [],
      };
    }

    const aggregates = await this.prisma.courseRatingAggregate.findMany({
      where: { courseId: { in: courseIds } },
    });
    const aggregateMap = new Map(aggregates.map((aggregate) => [aggregate.courseId, aggregate]));

    let totalReviews = 0;
    let weightedSum = 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const aggregate of aggregates) {
      totalReviews += aggregate.totalReviews;
      weightedSum += aggregate.averageRating * aggregate.totalReviews;
      distribution[1] += aggregate.ratingOne;
      distribution[2] += aggregate.ratingTwo;
      distribution[3] += aggregate.ratingThree;
      distribution[4] += aggregate.ratingFour;
      distribution[5] += aggregate.ratingFive;
    }

    const averageRating = totalReviews > 0 ? Number((weightedSum / totalReviews).toFixed(2)) : 0;
    const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (totalReviews > 0) {
      for (const rating of [1, 2, 3, 4, 5] as const) {
        percentages[rating] = Number(((distribution[rating] / totalReviews) * 100).toFixed(1));
      }
    }

    const totalStudents = courses.reduce(
      (sum, course) => sum + (course.totalStudents ?? 0),
      0,
    );
    const totalCourses = courses.length;
    const courseBreakdown = courses
      .map((course) => {
        const aggregate = aggregateMap.get(course.id);
        return {
          courseId: course.id,
          title: course.title,
          students: course.totalStudents ?? 0,
          averageRating: aggregate?.averageRating ?? course.averageRating ?? 0,
          totalReviews: aggregate?.totalReviews ?? course.totalReviews ?? 0,
        };
      })
      .sort((left, right) => right.students - left.students || right.averageRating - left.averageRating);

    const topCourses = courseBreakdown.slice(0, 5);

    const recentReviews = await this.prisma.courseReview.findMany({
      where: {
        courseId: { in: courseIds },
        deletedAt: null,
        isVisible: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
    const courseTitleMap = new Map(courses.map((course) => [course.id, course.title]));
    const recentReviewsWithTitle = recentReviews.map((review) => ({
      ...review,
      courseTitle: courseTitleMap.get(review.courseId) ?? '',
    }));

    return {
      totals: {
        totalCourses,
        totalStudents,
        totalReviews,
        averageRating,
      },
      ratingDistribution: distribution,
      ratingPercentages: percentages,
      topCourses,
      courseBreakdown,
      recentReviews: recentReviewsWithTitle,
    };
  }

  async listMyCourses(currentUser: JwtPayload): Promise<CourseSummary[]> {
    this.assertInstructorOrAdmin(currentUser);
    return this.courseClient.listCoursesByInstructor(currentUser.sub);
  }

  async listStudents(currentUser: JwtPayload, dto: ListStudentsDto) {
    this.assertInstructorOrAdmin(currentUser);
    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);

    const courses = isAdmin
      ? dto.courseId
        ? await this.courseClient.findCourse(dto.courseId).then((course) => (course ? [course] : []))
        : []
      : await this.courseClient.listCoursesByInstructor(currentUser.sub);

    const ownedIds = courses.map((course) => course.id);

    let targetCourseIds = ownedIds;
    if (dto.courseId) {
      if (!isAdmin && !ownedIds.includes(dto.courseId)) {
        throw new ForbiddenException('You do not own this course.');
      }
      targetCourseIds = [dto.courseId];
    }

    if (targetCourseIds.length === 0) {
      const { page, limit } = normalizePagination(dto);
      return {
        items: [],
        meta: buildPaginationMeta(0, page, limit),
      };
    }

    const courseTitleMap = new Map(courses.map((course) => [course.id, course.title]));

    const enrollmentBatches = await Promise.all(
      targetCourseIds.map((courseId) => this.enrollmentClient.listStudentsForCourse(courseId)),
    );
    const allEnrollments = enrollmentBatches.flat();
    const userIds = Array.from(new Set(allEnrollments.map((enrollment) => enrollment.userId)));
    const profiles = userIds.length > 0 ? await this.userClient.findManyByIds(userIds) : [];
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

    const search = (dto.search ?? '').trim().toLowerCase();

    const filtered: StudentRow[] = allEnrollments
      .map((enrollment): StudentRow => {
        const profile = profileMap.get(enrollment.userId);
        return {
          userId: enrollment.userId,
          displayName: profile?.displayName ?? profile?.fullName ?? 'Student',
          email: profile?.email,
          avatarUrl: profile?.avatarUrl,
          courseId: enrollment.courseId,
          courseTitle: courseTitleMap.get(enrollment.courseId) ?? '',
          enrolledAt: enrollment.enrolledAt,
          status: enrollment.status,
          progressPercent: enrollment.progressPercent,
          completedAt: enrollment.completedAt,
        };
      })
      .filter((row) => {
        if (!search) return true;
        const haystack = `${row.displayName} ${row.email ?? ''}`.toLowerCase();
        return haystack.includes(search);
      })
      .sort((left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime());

    const { page, limit, skip, take } = normalizePagination(dto);
    const items = filtered.slice(skip, skip + take);

    return {
      items,
      meta: buildPaginationMeta(filtered.length, page, limit),
    };
  }

  async listReviews(
    currentUser: JwtPayload,
    listDto: {
      page?: number;
      limit?: number;
      rating?: number;
      search?: string;
      sort?: 'latest' | 'oldest' | 'rating_desc' | 'rating_asc';
    },
    courseId?: string,
  ) {
    this.assertInstructorOrAdmin(currentUser);
    return this.reviewsService.listForInstructor(
      currentUser,
      {
        page: listDto.page,
        limit: listDto.limit,
        rating: listDto.rating,
        search: listDto.search,
        sort: listDto.sort,
      },
      courseId,
    );
  }

  async ratingDistribution(currentUser: JwtPayload, courseId?: string) {
    this.assertInstructorOrAdmin(currentUser);
    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);

    let courseIds: string[];
    if (courseId) {
      if (!isAdmin) {
        const owns = await this.courseClient.isInstructorOfCourse(currentUser.sub, courseId);
        if (!owns) {
          throw new ForbiddenException('You do not own this course.');
        }
      }
      courseIds = [courseId];
    } else {
      const courses = isAdmin ? [] : await this.courseClient.listCoursesByInstructor(currentUser.sub);
      courseIds = courses.map((course) => course.id);
    }

    if (courseIds.length === 0 && !isAdmin) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const aggregates = await this.prisma.courseRatingAggregate.findMany({
      where: courseIds.length > 0 ? { courseId: { in: courseIds } } : {},
    });

    let total = 0;
    let weighted = 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const aggregate of aggregates) {
      total += aggregate.totalReviews;
      weighted += aggregate.averageRating * aggregate.totalReviews;
      distribution[1] += aggregate.ratingOne;
      distribution[2] += aggregate.ratingTwo;
      distribution[3] += aggregate.ratingThree;
      distribution[4] += aggregate.ratingFour;
      distribution[5] += aggregate.ratingFive;
    }
    const averageRating = total > 0 ? Number((weighted / total).toFixed(2)) : 0;
    const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (total > 0) {
      for (const rating of [1, 2, 3, 4, 5] as const) {
        percentages[rating] = Number(((distribution[rating] / total) * 100).toFixed(1));
      }
    }

    return {
      averageRating,
      totalReviews: total,
      ratingDistribution: distribution,
      ratingPercentages: percentages,
    };
  }

  private assertInstructorOrAdmin(currentUser: JwtPayload): void {
    if (!hasAnyRole(currentUser, [ROLES.INSTRUCTOR, ROLES.ADMIN])) {
      throw new ForbiddenException('Instructor or admin role required.');
    }
  }

  private emptyTotals() {
    return {
      totalCourses: 0,
      totalStudents: 0,
      totalReviews: 0,
      averageRating: 0,
    };
  }
}
