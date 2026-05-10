import { BadRequestException } from '@nestjs/common';
import { CourseStatus } from '../../common/prisma/prisma-client';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import type { PrismaService } from '../../common/prisma/prisma.service';
import type { JobsService } from '../jobs/jobs.service';
import { SectionsService } from './sections.service';

function createPrismaMock() {
  const course = {
    findUnique: jest.fn(),
  };
  const section = {
    findMany: jest.fn(),
    update: jest.fn(),
  };

  return {
    course,
    section,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          section,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('SectionsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: SectionsService;

  const instructorUser: JwtPayload = {
    sub: 'instructor-1',
    email: 'instructor@example.com',
    role: 'instructor',
    roles: ['instructor', 'student'],
  };

  beforeEach(() => {
    prisma = createPrismaMock();

    service = new SectionsService(
      prisma as unknown as PrismaService,
      { enqueueCourseStatsRecompute: jest.fn() } as unknown as JobsService,
    );
  });

  it('rejects section reorder payloads with duplicate ids', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.draft,
      instructors: [{ instructorId: 'instructor-1' }],
    });
    prisma.section.findMany.mockResolvedValue([
      { id: 'section-1' },
      { id: 'section-2' },
    ]);

    await expect(
      service.reorderSections('course-1', instructorUser, {
        items: [
          { id: 'section-1', order: 1 },
          { id: 'section-1', order: 2 },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reorders sections into contiguous positions', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-1',
      deletedAt: null,
      status: CourseStatus.in_progress,
      instructors: [{ instructorId: 'instructor-1' }],
    });
    prisma.section.findMany
      .mockResolvedValueOnce([
        { id: 'section-1' },
        { id: 'section-2' },
        { id: 'section-3' },
      ])
      .mockResolvedValueOnce([
        { id: 'section-2', order: 1 },
        { id: 'section-3', order: 2 },
        { id: 'section-1', order: 3 },
      ]);

    const result = await service.reorderSections('course-1', instructorUser, {
      items: [
        { id: 'section-1', order: 99 },
        { id: 'section-2', order: 10 },
        { id: 'section-3', order: 11 },
      ],
    });

    expect(prisma.section.update).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        where: { id: 'section-2' },
        data: { order: 1 },
      }),
    );
    expect(result).toEqual([
      { id: 'section-2', order: 1 },
      { id: 'section-3', order: 2 },
      { id: 'section-1', order: 3 },
    ]);
  });
});
