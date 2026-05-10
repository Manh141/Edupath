import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DiscussionStatus,
  DiscussionTargetType,
  Prisma,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hasAnyRole, ROLES } from '../../common/constants/roles.constant';
import { buildPaginationMeta, normalizePagination } from '../../common/utils/pagination';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CourseClient } from '../external/course.client';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ListDiscussionsDto } from './dto/list-discussions.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseClient: CourseClient,
  ) {}

  async list(_currentUser: JwtPayload | undefined, dto: ListDiscussionsDto) {
    const { page, limit, skip, take } = normalizePagination(dto);

    if (!dto.courseId && !dto.sectionId && !dto.lectureId) {
      throw new BadRequestException('Provide courseId, sectionId, or lectureId.');
    }

    const where: Prisma.DiscussionWhereInput = {
      deletedAt: null,
      ...(dto.courseId ? { courseId: dto.courseId } : {}),
      ...(dto.sectionId ? { sectionId: dto.sectionId } : {}),
      ...(dto.lectureId ? { lectureId: dto.lectureId } : {}),
      ...(dto.targetType ? { targetType: dto.targetType } : {}),
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.search
        ? {
            OR: [
              { title: { contains: dto.search, mode: 'insensitive' } },
              { body: { contains: dto.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.DiscussionOrderByWithRelationInput[] =
      dto.sort === 'top'
        ? [{ isPinned: 'desc' }, { upvotes: 'desc' }, { createdAt: 'desc' }]
        : dto.sort === 'oldest'
          ? [{ isPinned: 'desc' }, { createdAt: 'asc' }]
          : [{ isPinned: 'desc' }, { createdAt: 'desc' }];

    const [total, items] = await this.prisma.$transaction([
      this.prisma.discussion.count({ where }),
      this.prisma.discussion.findMany({
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

  async detail(discussionId: string) {
    const discussion = await this.prisma.discussion.findFirst({
      where: { id: discussionId, deletedAt: null },
    });
    if (!discussion) {
      throw new NotFoundException('Discussion not found.');
    }
    return discussion;
  }

  async create(currentUser: JwtPayload, dto: CreateDiscussionDto) {
    const targetType = dto.targetType ?? DiscussionTargetType.course;

    if (targetType === DiscussionTargetType.section && !dto.sectionId) {
      throw new BadRequestException('sectionId required when targetType=section.');
    }
    if (targetType === DiscussionTargetType.lecture && !dto.lectureId) {
      throw new BadRequestException('lectureId required when targetType=lecture.');
    }

    return this.prisma.discussion.create({
      data: {
        courseId: dto.courseId,
        targetType,
        sectionId: dto.sectionId ?? null,
        lectureId: dto.lectureId ?? null,
        title: dto.title ?? '',
        body: dto.body,
        authorId: currentUser.sub,
        authorDisplayName: currentUser.displayName ?? currentUser.email ?? 'User',
        authorAvatarUrl: currentUser.avatarUrl ?? '',
        authorRole: currentUser.role ?? 'student',
      },
    });
  }

  async update(currentUser: JwtPayload, discussionId: string, dto: UpdateDiscussionDto) {
    const discussion = await this.detail(discussionId);
    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);
    const isInstructor = hasAnyRole(currentUser, [ROLES.INSTRUCTOR]);

    const isOwner = discussion.authorId === currentUser.sub;
    const isCourseInstructor = isInstructor
      ? await this.courseClient.isInstructorOfCourse(currentUser.sub, discussion.courseId)
      : false;

    if (!isOwner && !isAdmin && !isCourseInstructor) {
      throw new ForbiddenException('You cannot edit this discussion.');
    }

    const data: Prisma.DiscussionUpdateInput = {};
    if (dto.title !== undefined && isOwner) data.title = dto.title;
    if (dto.body !== undefined && isOwner) data.body = dto.body;
    if (dto.status !== undefined && (isAdmin || isCourseInstructor || isOwner)) {
      data.status = dto.status;
    }
    if (dto.isPinned !== undefined && (isAdmin || isCourseInstructor)) {
      data.isPinned = dto.isPinned;
    }

    return this.prisma.discussion.update({
      where: { id: discussion.id },
      data,
    });
  }

  async softDelete(currentUser: JwtPayload, discussionId: string) {
    const discussion = await this.detail(discussionId);
    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);
    const isInstructor = hasAnyRole(currentUser, [ROLES.INSTRUCTOR]);
    const isOwner = discussion.authorId === currentUser.sub;
    const isCourseInstructor = isInstructor
      ? await this.courseClient.isInstructorOfCourse(currentUser.sub, discussion.courseId)
      : false;

    if (!isOwner && !isAdmin && !isCourseInstructor) {
      throw new ForbiddenException('You cannot delete this discussion.');
    }

    return this.prisma.discussion.update({
      where: { id: discussion.id },
      data: { deletedAt: new Date() },
    });
  }

  async listReplies(discussionId: string) {
    await this.detail(discussionId);
    return this.prisma.discussionReply.findMany({
      where: { discussionId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createReply(currentUser: JwtPayload, discussionId: string, dto: CreateReplyDto) {
    const discussion = await this.detail(discussionId);
    if (discussion.status === DiscussionStatus.closed) {
      throw new BadRequestException('Discussion is closed and cannot accept replies.');
    }

    if (dto.parentReplyId) {
      const parent = await this.prisma.discussionReply.findUnique({
        where: { id: dto.parentReplyId },
        select: { id: true, discussionId: true, deletedAt: true },
      });
      if (!parent || parent.deletedAt || parent.discussionId !== discussion.id) {
        throw new NotFoundException('Parent reply not found.');
      }
    }

    const isInstructor = hasAnyRole(currentUser, [ROLES.INSTRUCTOR, ROLES.ADMIN]);
    const isCourseInstructor = isInstructor
      ? await this.courseClient.isInstructorOfCourse(currentUser.sub, discussion.courseId)
      : false;

    return this.prisma.$transaction(async (tx) => {
      const reply = await tx.discussionReply.create({
        data: {
          discussionId: discussion.id,
          parentReplyId: dto.parentReplyId ?? null,
          authorId: currentUser.sub,
          authorDisplayName: currentUser.displayName ?? currentUser.email ?? 'User',
          authorAvatarUrl: currentUser.avatarUrl ?? '',
          authorRole: currentUser.role ?? 'student',
          isInstructorReply: isCourseInstructor || hasAnyRole(currentUser, [ROLES.ADMIN]),
          body: dto.body,
        },
      });

      await tx.discussion.update({
        where: { id: discussion.id },
        data: {
          replyCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      return reply;
    });
  }

  async deleteReply(currentUser: JwtPayload, replyId: string) {
    const reply = await this.prisma.discussionReply.findUnique({
      where: { id: replyId },
      include: { discussion: true },
    });
    if (!reply || reply.deletedAt) {
      throw new NotFoundException('Reply not found.');
    }

    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);
    const isInstructor = hasAnyRole(currentUser, [ROLES.INSTRUCTOR]);
    const isOwner = reply.authorId === currentUser.sub;
    const isCourseInstructor = isInstructor
      ? await this.courseClient.isInstructorOfCourse(currentUser.sub, reply.discussion.courseId)
      : false;

    if (!isOwner && !isAdmin && !isCourseInstructor) {
      throw new ForbiddenException('You cannot delete this reply.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.discussionReply.update({
        where: { id: reply.id },
        data: { deletedAt: new Date() },
      });
      await tx.discussion.update({
        where: { id: reply.discussionId },
        data: { replyCount: { decrement: 1 } },
      });
      return updated;
    });
  }
}
