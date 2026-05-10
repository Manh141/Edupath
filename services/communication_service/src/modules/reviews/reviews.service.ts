import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hasAnyRole, ROLES } from '../../common/constants/roles.constant';
import {
  buildPaginationMeta,
  normalizePagination,
  PaginatedResult,
} from '../../common/utils/pagination';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CourseClient } from '../external/course.client';
import { EnrollmentClient } from '../external/enrollment.client';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { SetReviewVisibilityDto } from './dto/set-visibility.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';

@Injectable()
export class ReviewsService {
  private readonly requireEnrollment: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentClient: EnrollmentClient,
    private readonly courseClient: CourseClient,
    config: ConfigService,
  ) {
    this.requireEnrollment =
      (config.get<string>('REVIEW_REQUIRE_ENROLLMENT') ?? 'true').toLowerCase() === 'true';
  }

  async listForCourse(courseId: string, dto: ListReviewsDto): Promise<
    PaginatedResult<Prisma.CourseReviewGetPayload<Record<string, never>>>
  > {
    const { page, limit, skip, take } = normalizePagination(dto);

    const where: Prisma.CourseReviewWhereInput = {
      courseId,
      isVisible: true,
      deletedAt: null,
      ...(dto.rating ? { rating: dto.rating } : {}),
      ...(dto.search
        ? {
            OR: [
              { title: { contains: dto.search, mode: 'insensitive' } },
              { content: { contains: dto.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy = this.resolveSort(dto.sort);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.courseReview.count({ where }),
      this.prisma.courseReview.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getMyReview(currentUser: JwtPayload, courseId: string) {
    const review = await this.prisma.courseReview.findFirst({
      where: {
        courseId,
        userId: currentUser.sub,
        deletedAt: null,
      },
    });
    return review ?? null;
  }

  async upsert(currentUser: JwtPayload, courseId: string, dto: UpsertReviewDto) {
    const course = await this.courseClient.findCourse(courseId);
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (this.requireEnrollment) {
      const enrolled = await this.enrollmentClient.isEnrolled(currentUser.sub, courseId);
      if (!enrolled) {
        throw new ForbiddenException('You must be enrolled in this course to leave a review.');
      }
    }

    const existing = await this.prisma.courseReview.findUnique({
      where: { courseId_userId: { courseId, userId: currentUser.sub } },
    });

    if (existing && existing.deletedAt) {
      throw new BadRequestException('Your previous review was deleted; contact support.');
    }

    const data = {
      rating: dto.rating,
      title: dto.title ?? '',
      content: dto.content ?? '',
      userDisplayName: currentUser.displayName ?? currentUser.email ?? 'User',
      userAvatarUrl: currentUser.avatarUrl ?? '',
    };

    const review = await this.prisma.$transaction(async (tx) => {
      const upserted = await tx.courseReview.upsert({
        where: { courseId_userId: { courseId, userId: currentUser.sub } },
        update: data,
        create: {
          ...data,
          courseId,
          userId: currentUser.sub,
        },
      });
      await this.recomputeAggregateInTx(tx, courseId);
      return upserted;
    });

    return review;
  }

  async deleteMine(currentUser: JwtPayload, courseId: string) {
    const review = await this.prisma.courseReview.findUnique({
      where: { courseId_userId: { courseId, userId: currentUser.sub } },
    });
    if (!review || review.deletedAt) {
      throw new NotFoundException('Review not found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.courseReview.update({
        where: { id: review.id },
        data: { deletedAt: new Date(), isVisible: false },
      });
      await this.recomputeAggregateInTx(tx, courseId);
      return deleted;
    });
  }

  async setVisibility(
    currentUser: JwtPayload,
    reviewId: string,
    dto: SetReviewVisibilityDto,
  ) {
    if (!hasAnyRole(currentUser, [ROLES.ADMIN])) {
      throw new ForbiddenException('Only admin can moderate reviews.');
    }

    const review = await this.prisma.courseReview.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.courseReview.update({
        where: { id: reviewId },
        data: { isVisible: dto.isVisible },
      });
      await this.recomputeAggregateInTx(tx, updated.courseId);
      return updated;
    });
  }

  async getAggregate(courseId: string) {
    const aggregate = await this.prisma.courseRatingAggregate.findUnique({
      where: { courseId },
    });
    if (!aggregate) {
      return {
        courseId,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    return this.serializeAggregate(aggregate);
  }

  async listForInstructor(currentUser: JwtPayload, dto: ListReviewsDto, courseIdFilter?: string) {
    if (!hasAnyRole(currentUser, [ROLES.INSTRUCTOR, ROLES.ADMIN])) {
      throw new ForbiddenException('Instructor or admin role required.');
    }

    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);

    let allowedCourseIds: string[] = [];
    if (isAdmin) {
      allowedCourseIds = courseIdFilter ? [courseIdFilter] : [];
    } else {
      const courses = await this.courseClient.listCoursesByInstructor(currentUser.sub);
      const ownedIds = courses.map((course) => course.id);
      if (courseIdFilter) {
        if (!ownedIds.includes(courseIdFilter)) {
          throw new ForbiddenException('You do not own this course.');
        }
        allowedCourseIds = [courseIdFilter];
      } else {
        allowedCourseIds = ownedIds;
      }
      if (allowedCourseIds.length === 0 && !isAdmin) {
        return {
          items: [],
          meta: buildPaginationMeta(0, dto.page ?? 1, dto.limit ?? 20),
        };
      }
    }

    const { page, limit, skip, take } = normalizePagination(dto);

    const where: Prisma.CourseReviewWhereInput = {
      deletedAt: null,
      ...(allowedCourseIds.length > 0 ? { courseId: { in: allowedCourseIds } } : {}),
      ...(dto.rating ? { rating: dto.rating } : {}),
      ...(dto.search
        ? {
            OR: [
              { title: { contains: dto.search, mode: 'insensitive' } },
              { content: { contains: dto.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy = this.resolveSort(dto.sort);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.courseReview.count({ where }),
      this.prisma.courseReview.findMany({ where, orderBy, skip, take }),
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async recomputeAggregate(courseId: string) {
    return this.recomputeAggregateInTx(this.prisma, courseId);
  }

  private async recomputeAggregateInTx(
    tx: Prisma.TransactionClient | PrismaService,
    courseId: string,
  ) {
    const counts = await tx.courseReview.groupBy({
      by: ['rating'],
      where: { courseId, isVisible: true, deletedAt: null },
      _count: { rating: true },
    });

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let weighted = 0;

    for (const entry of counts) {
      const rating = entry.rating;
      const count = entry._count.rating;
      distribution[rating] = count;
      total += count;
      weighted += rating * count;
    }

    const averageRating = total > 0 ? Number((weighted / total).toFixed(2)) : 0;

    await tx.courseRatingAggregate.upsert({
      where: { courseId },
      update: {
        averageRating,
        totalReviews: total,
        ratingOne: distribution[1] ?? 0,
        ratingTwo: distribution[2] ?? 0,
        ratingThree: distribution[3] ?? 0,
        ratingFour: distribution[4] ?? 0,
        ratingFive: distribution[5] ?? 0,
      },
      create: {
        courseId,
        averageRating,
        totalReviews: total,
        ratingOne: distribution[1] ?? 0,
        ratingTwo: distribution[2] ?? 0,
        ratingThree: distribution[3] ?? 0,
        ratingFour: distribution[4] ?? 0,
        ratingFive: distribution[5] ?? 0,
      },
    });

    return { courseId, averageRating, totalReviews: total, ratingDistribution: distribution };
  }

  private resolveSort(
    sort?: ListReviewsDto['sort'],
  ): Prisma.CourseReviewOrderByWithRelationInput[] {
    switch (sort) {
      case 'oldest':
        return [{ createdAt: 'asc' }];
      case 'rating_desc':
        return [{ rating: 'desc' }, { createdAt: 'desc' }];
      case 'rating_asc':
        return [{ rating: 'asc' }, { createdAt: 'desc' }];
      case 'latest':
      default:
        return [{ createdAt: 'desc' }];
    }
  }

  private serializeAggregate(
    aggregate: Prisma.CourseRatingAggregateGetPayload<Record<string, never>>,
  ) {
    const distribution: Record<number, number> = {
      1: aggregate.ratingOne,
      2: aggregate.ratingTwo,
      3: aggregate.ratingThree,
      4: aggregate.ratingFour,
      5: aggregate.ratingFive,
    };
    const total = aggregate.totalReviews;
    const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (total > 0) {
      for (const rating of [1, 2, 3, 4, 5]) {
        percentages[rating] = Number(((distribution[rating] / total) * 100).toFixed(1));
      }
    }

    return {
      courseId: aggregate.courseId,
      averageRating: aggregate.averageRating,
      totalReviews: aggregate.totalReviews,
      ratingDistribution: distribution,
      ratingPercentages: percentages,
      updatedAt: aggregate.updatedAt,
    };
  }
}
