import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CourseClient } from '../external/course.client';
import type { EnrollmentClient } from '../external/enrollment.client';
import type { PrismaService } from '../../common/prisma/prisma.service';
import { ReviewsService } from './reviews.service';

type Stub<T> = { [K in keyof T]?: jest.Mock | unknown };

function createPrismaMock() {
  const courseReview = {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  };

  const courseRatingAggregate = {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  };

  return {
    courseReview,
    courseRatingAggregate,
    $transaction: jest.fn((arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          courseReview,
          courseRatingAggregate,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('ReviewsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let courseClient: Stub<CourseClient>;
  let enrollmentClient: Stub<EnrollmentClient>;
  let service: ReviewsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    courseClient = {
      findCourse: jest.fn(),
      isInstructorOfCourse: jest.fn(),
      listCoursesByInstructor: jest.fn(),
    };
    enrollmentClient = {
      isEnrolled: jest.fn(),
    };
    const config = {
      get: jest.fn().mockReturnValue('true'),
    } as unknown as ConfigService;

    service = new ReviewsService(
      prisma as unknown as PrismaService,
      enrollmentClient as unknown as EnrollmentClient,
      courseClient as unknown as CourseClient,
      config,
    );
  });

  it('throws NotFound when the course is missing', async () => {
    (courseClient.findCourse as jest.Mock).mockResolvedValue(null);

    await expect(
      service.upsert(
        { sub: 'user-1', email: 'user@example.com' },
        'course-1',
        { rating: 5 },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects reviews from users who are not enrolled', async () => {
    (courseClient.findCourse as jest.Mock).mockResolvedValue({ id: 'course-1', title: 'Course' });
    (enrollmentClient.isEnrolled as jest.Mock).mockResolvedValue(false);

    await expect(
      service.upsert(
        { sub: 'user-1', email: 'user@example.com' },
        'course-1',
        { rating: 5 },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('upserts a review and recomputes aggregate values', async () => {
    (courseClient.findCourse as jest.Mock).mockResolvedValue({ id: 'course-1', title: 'Course' });
    (enrollmentClient.isEnrolled as jest.Mock).mockResolvedValue(true);
    prisma.courseReview.findUnique.mockResolvedValue(null);
    prisma.courseReview.upsert.mockResolvedValue({
      id: 'review-1',
      courseId: 'course-1',
      userId: 'user-1',
      rating: 5,
      title: 'Excellent',
      content: 'Great course',
      isVisible: true,
      deletedAt: null,
    });
    prisma.courseReview.groupBy.mockResolvedValue([
      { rating: 5, _count: { rating: 2 } },
      { rating: 4, _count: { rating: 1 } },
    ]);
    prisma.courseRatingAggregate.upsert.mockResolvedValue({});

    const result = await service.upsert(
      {
        sub: 'user-1',
        email: 'user@example.com',
        displayName: 'User One',
        avatarUrl: 'https://cdn.example.com/avatar.png',
      },
      'course-1',
      { rating: 5, title: 'Excellent', content: 'Great course' },
    );

    expect(result.id).toBe('review-1');
    expect(prisma.courseRatingAggregate.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { courseId: 'course-1' },
        update: expect.objectContaining({
          averageRating: 4.67,
          totalReviews: 3,
          ratingFour: 1,
          ratingFive: 2,
        }),
      }),
    );
  });

  it('rejects upsert when a previous review was deleted', async () => {
    (courseClient.findCourse as jest.Mock).mockResolvedValue({ id: 'course-1', title: 'Course' });
    (enrollmentClient.isEnrolled as jest.Mock).mockResolvedValue(true);
    prisma.courseReview.findUnique.mockResolvedValue({
      id: 'review-1',
      courseId: 'course-1',
      userId: 'user-1',
      deletedAt: new Date(),
    });

    await expect(
      service.upsert(
        { sub: 'user-1', email: 'user@example.com' },
        'course-1',
        { rating: 4 },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows only admins to change review visibility', async () => {
    await expect(
      service.setVisibility(
        { sub: 'user-1', email: 'user@example.com', role: 'student', roles: ['student'] },
        'review-1',
        { isVisible: false },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
