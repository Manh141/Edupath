import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import type { CourseClient } from '../external/course.client';
import type { PrismaService } from '../../common/prisma/prisma.service';

function createPrismaMock() {
  const discussion = {
    count: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const discussionReply = {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  };
  return {
    discussion,
    discussionReply,
    $transaction: jest.fn((arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({ discussion, discussionReply });
      }
      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('DiscussionsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let courseClient: { isInstructorOfCourse: jest.Mock };
  let service: DiscussionsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    courseClient = { isInstructorOfCourse: jest.fn() };
    service = new DiscussionsService(
      prisma as unknown as PrismaService,
      courseClient as unknown as CourseClient,
    );
  });

  it('list rejects when no scope is provided', async () => {
    await expect(service.list(undefined, {})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('detail throws NotFound when missing', async () => {
    prisma.discussion.findFirst.mockResolvedValue(null);
    await expect(service.detail('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('only owner / instructor / admin can update', async () => {
    prisma.discussion.findFirst.mockResolvedValue({
      id: 'd1',
      authorId: 'u1',
      courseId: 'c1',
      deletedAt: null,
    });
    courseClient.isInstructorOfCourse.mockResolvedValue(false);

    await expect(
      service.update(
        { sub: 'someone-else', email: 'x@y.com', role: 'student' },
        'd1',
        { title: 'x' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('reply increments replyCount and flags instructor reply', async () => {
    prisma.discussion.findFirst.mockResolvedValue({
      id: 'd1',
      courseId: 'c1',
      status: 'open',
      deletedAt: null,
    });
    courseClient.isInstructorOfCourse.mockResolvedValue(true);
    prisma.discussionReply.create.mockResolvedValue({
      id: 'r1',
      discussionId: 'd1',
      isInstructorReply: true,
    });
    prisma.discussion.update.mockResolvedValue({});

    const reply = await service.createReply(
      { sub: 'instructor-1', email: 'i@e.com', role: 'instructor' },
      'd1',
      { body: 'Answer here.' },
    );

    expect(reply.id).toBe('r1');
    expect(prisma.discussion.update).toHaveBeenCalled();
  });
});
