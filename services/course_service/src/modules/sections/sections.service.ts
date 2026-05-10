import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLES } from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { Prisma } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CourseStateMachine } from '../courses/moderation/course-state-machine';
import { JobsService } from '../jobs/jobs.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async createSection(courseId: string, currentUser: JwtPayload, dto: CreateSectionDto) {
    await this.assertCourseEditable(courseId, currentUser);

    return this.prisma.$transaction(async (tx) => {
      const maxSection = await tx.section.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });

      const created = await tx.section.create({
        data: {
          courseId,
          title: dto.title,
          description: dto.description ?? '',
          order: (maxSection?.order ?? 0) + 1,
        },
      });

      await this.normalizeSectionOrders(tx, courseId);

      return tx.section.findUniqueOrThrow({
        where: { id: created.id },
      });
    });
  }

  async updateSection(sectionId: string, currentUser: JwtPayload, dto: UpdateSectionDto) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: { include: { instructors: true } } },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    this.assertOwnership(section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', section.course.status);

    return this.prisma.section.update({
      where: { id: sectionId },
      data: dto,
    });
  }

  async deleteSection(sectionId: string, currentUser: JwtPayload) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: { include: { instructors: true } } },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    this.assertOwnership(section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', section.course.status);

    await this.prisma.$transaction(async (tx) => {
      await tx.section.delete({
        where: { id: sectionId },
      });
      await this.normalizeSectionOrders(tx, section.courseId);
    });

    await this.jobsService.enqueueCourseStatsRecompute(section.courseId);
    return { deleted: true };
  }

  async reorderSections(courseId: string, currentUser: JwtPayload, dto: ReorderSectionsDto) {
    await this.assertCourseEditable(courseId, currentUser);
    const sections = await this.prisma.section.findMany({
      where: { courseId },
      select: { id: true },
    });
    const requestedIds = dto.items.map((item) => item.id);
    const requestedIdSet = new Set(requestedIds);

    if (requestedIdSet.size !== requestedIds.length) {
      throw new BadRequestException('Section reorder payload contains duplicate ids.');
    }

    if (
      requestedIds.length !== sections.length ||
      sections.some((section) => !requestedIdSet.has(section.id))
    ) {
      throw new BadRequestException(
        'Section reorder payload must include every section in the course exactly once.',
      );
    }

    const orderedItems = [...dto.items]
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ id: item.id, order: index + 1 }));

    await this.prisma.$transaction(async (tx) => {
      const temporaryOrderBase = -1_000_000_000;
      for (const [index, item] of orderedItems.entries()) {
        await tx.section.update({
          where: { id: item.id },
          data: { order: temporaryOrderBase - index },
        });
      }

      for (const item of orderedItems) {
        await tx.section.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    });

    return this.prisma.section.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  private async normalizeSectionOrders(
    tx: Prisma.TransactionClient,
    courseId: string,
  ): Promise<void> {
    const sections = await tx.section.findMany({
      where: { courseId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true, order: true },
    });

    const isContiguous = sections.every((section, index) => section.order === index + 1);
    if (isContiguous) {
      return;
    }

    const temporaryOrderBase = -1_000_000_000;
    for (const [index, section] of sections.entries()) {
      await tx.section.update({
        where: { id: section.id },
        data: { order: temporaryOrderBase - index },
      });
    }

    for (const [index, section] of sections.entries()) {
      await tx.section.update({
        where: { id: section.id },
        data: { order: index + 1 },
      });
    }
  }

  private async assertCourseEditable(courseId: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertOwnership(course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);
  }

  private assertOwnership(
    instructors: Array<{ instructorId: string }>,
    currentUser: JwtPayload,
  ): void {
    if (currentUser.role === ROLES.ADMIN || currentUser.roles?.includes(ROLES.ADMIN)) {
      return;
    }

    const owns = instructors.some((instructor) => instructor.instructorId === currentUser.sub);
    if (!owns) {
      throw new ForbiddenException('You can only manage your own course sections.');
    }
  }
}
