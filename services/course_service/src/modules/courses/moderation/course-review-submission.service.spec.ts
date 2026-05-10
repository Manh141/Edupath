import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CourseReviewSubmissionStatus, CourseStatus, CourseStatusActorType } from '../../../common/prisma/prisma-client';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { PrismaService } from '../../../common/prisma/prisma.service';
import type { CourseValidationService } from '../validation/course-validation.service';
import type { PricingEligibilityClient } from '../pricing/pricing.eligibility.client';
import type { CourseStatusHistoryService } from './course-status-history.service';
import { CourseReviewSubmissionService } from './course-review-submission.service';

function createPrismaMock() {
  const course = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const courseReviewSubmission = {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };

  return {
    course,
    courseReviewSubmission,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          course,
          courseReviewSubmission,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

function createConfigService() {
  return {
    get: jest.fn().mockReturnValue(undefined),
  } as unknown as ConfigService;
}

describe('CourseReviewSubmissionService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let validation: {
    loadCourseInput: jest.Mock;
    buildReport: jest.Mock;
  };
  let history: { log: jest.Mock };
  let eligibility: { getForInstructor: jest.Mock };
  let service: CourseReviewSubmissionService;

  const instructorUser: JwtPayload = {
    sub: 'instructor-1',
    email: 'instructor@example.com',
    role: 'instructor',
    roles: ['instructor', 'student'],
  };

  const validationInput = {
    id: 'course-1',
    title: 'NestJS Mastery',
    subtitle: 'Deep dive',
    shortDescription: 'Short',
    description: 'Long course description',
    language: 'vi',
    level: 'Beginner',
    thumbnailUrl: 'https://cdn.example.com/thumb.png',
    trailerUrl: 'https://cdn.example.com/trailer.mp4',
    subcategoryId: 'sub-1',
    categoryId: 'cat-1',
    objectivesCount: 4,
    requirementsCount: 1,
    targetAudiencesCount: 1,
    primaryInstructorId: 'instructor-1',
    pricing: { tier: 'paid', price: 1000000, currency: 'VND' },
    sellerEligibility: { resolved: true, canSellPaid: true, reasons: [] },
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        order: 1,
        lectures: [
          {
            id: 'lecture-1',
            type: 'video',
            title: 'Intro',
            videoUrl: 'https://cdn.example.com/video.mp4',
            articleContent: '',
            durationSec: 1900,
            order: 1,
            assets: [],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    validation = {
      loadCourseInput: jest.fn().mockResolvedValue(validationInput),
      buildReport: jest.fn().mockReturnValue({ canSubmit: true, checklist: [] }),
    };
    history = {
      log: jest.fn().mockResolvedValue(undefined),
    };
    eligibility = {
      getForInstructor: jest.fn().mockResolvedValue({
        resolved: true,
        canSellPaid: true,
        identityStatus: 'verified',
        reasons: [],
        onboardingUrl: '/instructor/monetization',
        identityFlowUrl: '/instructor/identity',
      }),
    };

    service = new CourseReviewSubmissionService(
      prisma as unknown as PrismaService,
      validation as unknown as CourseValidationService,
      history as unknown as CourseStatusHistoryService,
      eligibility as unknown as PricingEligibilityClient,
      createConfigService(),
    );
  });

  it('submits a draft course for review and moves it to pending_review', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      instructors: [{ instructorId: 'instructor-1' }],
      pricingConfig: null,
    });
    prisma.courseReviewSubmission.findFirst.mockResolvedValue(null);
    prisma.courseReviewSubmission.create.mockResolvedValue({
      id: 'submission-1',
      courseId: 'course-1',
      version: 1,
      status: CourseReviewSubmissionStatus.pending,
    });
    prisma.course.update.mockResolvedValue({
      id: 'course-1',
      status: CourseStatus.pending_review,
    });

    const result = await service.submitForReview('course-1', instructorUser, 'Ready for admin review');

    expect(result.course.status).toBe(CourseStatus.pending_review);
    expect(result.submission).toEqual(
      expect.objectContaining({
        id: 'submission-1',
        version: 1,
        status: CourseReviewSubmissionStatus.pending,
      }),
    );
    expect(history.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        courseId: 'course-1',
        fromStatus: CourseStatus.draft,
        toStatus: CourseStatus.pending_review,
        actorType: CourseStatusActorType.instructor,
      }),
    );
  });

  it('rejects submission when validation report says the course is not ready', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      instructors: [{ instructorId: 'instructor-1' }],
      pricingConfig: null,
    });
    validation.buildReport.mockReturnValue({
      canSubmit: false,
      checklist: [{ code: 'MISSING_LECTURES' }],
    });

    await expect(
      service.submitForReview('course-1', instructorUser),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prevents submitting someone else course for review', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      instructors: [{ instructorId: 'someone-else' }],
      pricingConfig: null,
    });

    await expect(
      service.submitForReview('course-1', instructorUser),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
