import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CourseLevel, CourseStatus, CourseStatusActorType } from '../../common/prisma/prisma-client';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import type { PrismaService } from '../../common/prisma/prisma.service';
import type { MinioService } from '../../common/storage/minio.service';
import type { JobsService } from '../jobs/jobs.service';
import type { CourseStatusHistoryService } from './moderation/course-status-history.service';
import { CoursesService } from './courses.service';

function createPrismaMock() {
  const course = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const lecture = {
    updateMany: jest.fn(),
    aggregate: jest.fn(),
  };
  const courseReviewSubmission = {
    findFirst: jest.fn(),
    update: jest.fn(),
  };

  return {
    course,
    lecture,
    courseReviewSubmission,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          course,
          lecture,
          courseReviewSubmission,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('CoursesService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let jobsService: { enqueueCourseStatsRecompute: jest.Mock };
  let statusHistory: { log: jest.Mock };
  let storage: MinioService;
  let service: CoursesService;

  const instructorUser: JwtPayload = {
    sub: 'instructor-1',
    email: 'instructor@example.com',
    role: 'instructor',
    roles: ['instructor', 'student'],
    displayName: 'Instructor One',
  };

  const adminUser: JwtPayload = {
    sub: 'admin-1',
    email: 'admin@example.com',
    role: 'admin',
    roles: ['admin'],
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    jobsService = {
      enqueueCourseStatsRecompute: jest.fn(),
    };
    statusHistory = {
      log: jest.fn().mockResolvedValue(undefined),
    };
    storage = {} as MinioService;

    service = new CoursesService(
      prisma as unknown as PrismaService,
      jobsService as unknown as JobsService,
      statusHistory as unknown as CourseStatusHistoryService,
      storage,
    );
  });

  it('creates a draft course for the instructor', async () => {
    prisma.course.findUnique.mockResolvedValue(null);
    prisma.course.create.mockResolvedValue({
      id: 'course-1',
      title: 'NestJS Mastery',
      slug: 'nestjs-mastery',
      status: CourseStatus.draft,
      level: CourseLevel.Beginner,
      instructors: [{ instructorId: 'instructor-1', isPrimary: true }],
      subcategory: null,
      assets: [],
    });

    const result = await service.createDraft(instructorUser, {
      title: '  NestJS Mastery  ',
      price: 1_200_000,
      compareAtPrice: 1_500_000,
    });

    expect(result.status).toBe(CourseStatus.draft);
    expect(prisma.course.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'NestJS Mastery',
          slug: 'nestjs-mastery',
          status: CourseStatus.draft,
          createdBy: 'instructor-1',
          updatedBy: 'instructor-1',
          price: 1_200_000,
          compareAtPrice: 1_500_000,
          instructors: {
            create: [
              expect.objectContaining({
                instructorId: 'instructor-1',
                isPrimary: true,
              }),
            ],
          },
        }),
      }),
    );
    expect(statusHistory.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        courseId: 'course-1',
        fromStatus: null,
        toStatus: CourseStatus.draft,
        actorType: CourseStatusActorType.instructor,
      }),
    );
  });

  it('rejects duplicate course titles for the same instructor when creating a draft', async () => {
    prisma.course.findFirst.mockResolvedValue({
      id: 'course-existing',
    });

    await expect(
      service.createDraft(instructorUser, {
        title: 'NestJS Mastery',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.course.create).not.toHaveBeenCalled();
  });

  it('rejects duplicate course titles for the same instructor when updating a draft', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      title: 'Existing Course',
      instructors: [{ instructorId: 'instructor-1' }],
    });
    prisma.course.findFirst.mockResolvedValue({
      id: 'course-existing',
    });

    await expect(
      service.updateDraft('course-1', instructorUser, {
        title: 'NestJS Mastery',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.course.update).not.toHaveBeenCalled();
  });

  it('prevents instructors from editing another instructor course', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      title: 'Existing Course',
      instructors: [{ instructorId: 'someone-else' }],
    });

    await expect(
      service.updateDraft('course-1', instructorUser, {
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not allow direct publish from draft', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
    });

    await expect(service.publishCourse('course-1', adminUser)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('approves a pending review course as admin', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.pending_review,
    });
    prisma.course.update.mockResolvedValue({
      id: 'course-1',
      status: CourseStatus.approved,
    });
    prisma.courseReviewSubmission.findFirst.mockResolvedValue(null);

    const result = await service.approveCourse('course-1', adminUser);

    expect(result.status).toBe(CourseStatus.approved);
    expect(prisma.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'course-1' },
        data: expect.objectContaining({
          status: CourseStatus.approved,
          rejectedReason: null,
          changesRequested: null,
          updatedBy: 'admin-1',
        }),
      }),
    );
    expect(statusHistory.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        courseId: 'course-1',
        fromStatus: CourseStatus.pending_review,
        toStatus: CourseStatus.approved,
        actorType: CourseStatusActorType.admin,
      }),
    );
  });

  it('rejects a pending review course with a reason', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.pending_review,
    });
    prisma.course.update.mockResolvedValue({
      id: 'course-1',
      status: CourseStatus.rejected,
      rejectedReason: 'Need better curriculum coverage.',
    });
    prisma.courseReviewSubmission.findFirst.mockResolvedValue(null);

    const result = await service.rejectCourse('course-1', adminUser, {
      reason: 'Need better curriculum coverage.',
    });

    expect(result.status).toBe(CourseStatus.rejected);
    expect(prisma.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: CourseStatus.rejected,
          rejectedReason: 'Need better curriculum coverage.',
          approvedAt: null,
          publishedAt: null,
        }),
      }),
    );
  });

  it('publishes a course only after it has been approved', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.approved,
    });
    prisma.lecture.updateMany.mockResolvedValue({ count: 3 });
    prisma.lecture.aggregate.mockResolvedValue({
      _sum: { durationSec: 3_600 },
    });
    prisma.course.update
      .mockResolvedValueOnce({ id: 'course-1', totalDurationSec: 3_600 })
      .mockResolvedValueOnce({
        id: 'course-1',
        status: CourseStatus.published,
        publishedAt: new Date(),
      });
    prisma.courseReviewSubmission.findFirst.mockResolvedValue(null);

    const result = await service.publishCourse('course-1', adminUser);

    expect(result.status).toBe(CourseStatus.published);
    expect(prisma.lecture.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { section: { courseId: 'course-1' } },
        data: { isPublished: true },
      }),
    );
  });
});
