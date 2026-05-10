import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseStatus } from '../../common/prisma/prisma-client';
import { ROLES } from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { SetReviewVisibilityDto } from './dto/set-review-visibility.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async listVisibleReviews(courseId: string) {
    return this.prisma.courseReview.findMany({
      where: {
        courseId,
        isVisible: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertReview(courseId: string, currentUser: JwtPayload, dto: UpsertReviewDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    if (course.status !== CourseStatus.published) {
      throw new BadRequestException('Only published courses can be reviewed.');
    }

    const review = await this.prisma.courseReview.upsert({
      where: {
        courseId_userId: {
          courseId,
          userId: currentUser.sub,
        },
      },
      update: {
        rating: dto.rating,
        title: dto.title ?? '',
        comment: dto.comment ?? '',
      },
      create: {
        courseId,
        userId: currentUser.sub,
        userDisplayName: currentUser.displayName ?? currentUser.email,
        userAvatarUrl: currentUser.avatarUrl ?? '',
        rating: dto.rating,
        title: dto.title ?? '',
        comment: dto.comment ?? '',
      },
    });

    await this.jobsService.enqueueCourseStatsRecompute(courseId);
    return review;
  }

  async setVisibility(reviewId: string, currentUser: JwtPayload, dto: SetReviewVisibilityDto) {
    const userRoles = new Set([
      ...(currentUser.roles ?? []),
      ...(currentUser.role ? [currentUser.role] : []),
    ]);

    if (!userRoles.has(ROLES.ADMIN)) {
      throw new ForbiddenException('Only admin can moderate reviews.');
    }

    const review = await this.prisma.courseReview.update({
      where: { id: reviewId },
      data: {
        isVisible: dto.isVisible,
      },
    });

    await this.jobsService.enqueueCourseStatsRecompute(review.courseId);
    return review;
  }
}
