import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CourseReviewSubmissionStatus,
  CourseStatus,
  CourseStatusActorType,
  Prisma,
} from '../../../common/prisma/prisma-client';
import { ROLES } from '../../../common/constants/roles.constant';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseValidationService } from '../validation/course-validation.service';
import type { CourseValidationInput } from '../validation/rules/types';
import { PricingEligibilityClient } from '../pricing/pricing.eligibility.client';
import { QueryReviewSubmissionsDto } from '../dto/query-review-submissions.dto';
import { CourseStateMachine } from './course-state-machine';
import { CourseStatusHistoryService } from './course-status-history.service';

@Injectable()
export class CourseReviewSubmissionService {
  private readonly logger = new Logger(CourseReviewSubmissionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: CourseValidationService,
    private readonly history: CourseStatusHistoryService,
    private readonly eligibility: PricingEligibilityClient,
    private readonly config: ConfigService,
  ) {}

  async submitForReview(courseId: string, currentUser: JwtPayload, note?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true, pricingConfig: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertOwnership(course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('submit_for_review', course.status);

    const input = await this.validation.loadCourseInput(courseId);
    const report = this.validation.buildReport(input);

    if (!report.canSubmit) {
      throw new BadRequestException({
        message: 'Course is not ready for review.',
        code: 'COURSE_VALIDATION_FAILED',
        report,
      });
    }

    await this.enforceSellerGates(currentUser.sub);

    const fromStatus = course.status;
    const snapshot = this.buildSnapshot(input, note);

    return this.prisma.$transaction(async (tx) => {
      const lastSubmission = await tx.courseReviewSubmission.findFirst({
        where: { courseId },
        orderBy: { version: 'desc' },
      });

      if (lastSubmission && lastSubmission.status === CourseReviewSubmissionStatus.pending) {
        await tx.courseReviewSubmission.update({
          where: { id: lastSubmission.id },
          data: { status: CourseReviewSubmissionStatus.superseded },
        });
      }

      const submission = await tx.courseReviewSubmission.create({
        data: {
          courseId,
          version: (lastSubmission?.version ?? 0) + 1,
          status: CourseReviewSubmissionStatus.pending,
          submittedBy: currentUser.sub,
          submittedAt: new Date(),
          contentSnapshot: snapshot as unknown as Prisma.InputJsonValue,
          validationReport: report as unknown as Prisma.InputJsonValue,
          decisionNote: note ?? null,
        },
      });

      const updatedCourse = await tx.course.update({
        where: { id: courseId },
        data: {
          status: CourseStatus.pending_review,
          submittedAt: new Date(),
          changesRequested: null,
          rejectedReason: null,
          updatedBy: currentUser.sub,
        },
      });

      await this.history.log(tx, {
        courseId,
        fromStatus,
        toStatus: CourseStatus.pending_review,
        actorType: CourseStatusActorType.instructor,
        actorId: currentUser.sub,
        reason: note ?? null,
        metadata: { submissionId: submission.id, version: submission.version },
      });

      return {
        course: updatedCourse,
        submission,
        report,
      };
    });
  }

  async listSubmissions(courseId: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertOwnership(course.instructors, currentUser);

    return this.prisma.courseReviewSubmission.findMany({
      where: { courseId },
      orderBy: { version: 'desc' },
    });
  }

  async listForAdmin(query: QueryReviewSubmissionsDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where: Prisma.CourseReviewSubmissionWhereInput = {
      ...(query.status ? { status: query.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.courseReviewSubmission.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              submittedAt: true,
              thumbnailUrl: true,
              instructors: {
                orderBy: { isPrimary: 'desc' },
              },
            },
          },
        },
      }),
      this.prisma.courseReviewSubmission.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listCourseSubmissionsForAdmin(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, deletedAt: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    return this.prisma.courseReviewSubmission.findMany({
      where: { courseId },
      orderBy: { version: 'desc' },
    });
  }

  /**
   * Enforce pre-instructor registration before a course can enter review.
   *
   * The pricing step uses the same seller eligibility, including public profile,
   * terms, promotional decision and payout account submission.
   */
  private async enforceSellerGates(instructorId: string): Promise<void> {
    const requireIdentityAlways = this.readBool('REQUIRE_INSTRUCTOR_IDENTITY', false);

    const elig = await this.eligibility.getForInstructor(instructorId);

    if (!elig.resolved) {
      // Fail closed because pricing and review submission now require onboarding.
      this.logger.warn(
        `Seller eligibility unresolved for instructor ${instructorId}; ` +
          `blocking submit (reasons=${elig.reasons.join(',')}).`,
      );
      throw new BadRequestException({
        code: 'SELLER_ONBOARDING_UNAVAILABLE',
        message: 'Cannot verify pre-instructor registration right now.',
        onboardingUrl: elig.onboardingUrl,
        reasons: elig.reasons,
      });
    }

    if (requireIdentityAlways && elig.identityStatus !== 'verified') {
      throw new BadRequestException({
        code: 'INSTRUCTOR_IDENTITY_REQUIRED',
        message: 'Identity verification is required before submitting for review.',
        identityFlowUrl: elig.identityFlowUrl,
      });
    }

    if (!elig.canSellPaid) {
      throw new BadRequestException({
        code: 'INSTRUCTOR_ONBOARDING_REQUIRED',
        message: 'Complete pre-instructor registration before submitting for review.',
        onboardingUrl: elig.onboardingUrl,
        reasons: elig.reasons,
      });
    }
  }

  private readBool(key: string, defaultValue: boolean): boolean {
    const raw = this.config.get<string>(key);
    if (raw === undefined || raw === null || raw === '') return defaultValue;
    return String(raw).toLowerCase() === 'true' || raw === '1';
  }

  private assertOwnership(
    instructors: Array<{ instructorId: string }>,
    currentUser: JwtPayload,
  ): void {
    const isAdmin = currentUser.role === ROLES.ADMIN || currentUser.roles?.includes(ROLES.ADMIN);
    if (isAdmin) return;

    const owns = instructors.some((i) => i.instructorId === currentUser.sub);
    if (!owns) {
      throw new ForbiddenException('You can only submit your own courses.');
    }
  }

  private buildSnapshot(input: CourseValidationInput, note?: string) {
    return {
      capturedAt: new Date().toISOString(),
      submissionNote: note ?? null,
      title: input.title,
      subtitle: input.subtitle,
      shortDescription: input.shortDescription,
      description: input.description,
      language: input.language,
      level: input.level,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      thumbnailUrl: input.thumbnailUrl,
      trailerUrl: input.trailerUrl,
      counts: {
        objectives: input.objectivesCount,
        requirements: input.requirementsCount,
        targetAudiences: input.targetAudiencesCount,
        sections: input.sections.length,
        lectures: input.sections.reduce((acc, s) => acc + s.lectures.length, 0),
      },
      pricing: input.pricing,
      sections: input.sections,
    };
  }
}
