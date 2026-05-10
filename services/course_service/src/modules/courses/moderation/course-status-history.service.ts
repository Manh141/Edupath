import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../common/prisma/prisma-client';
import {
  CourseStatus,
  CourseStatusActorType,
} from '../../../common/prisma/prisma-client';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type StatusTransitionInput = {
  courseId: string;
  fromStatus: CourseStatus | null;
  toStatus: CourseStatus;
  actorType: CourseStatusActorType;
  actorId: string | null;
  reason?: string | null;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class CourseStatusHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  log(tx: Prisma.TransactionClient | PrismaService, input: StatusTransitionInput) {
    return tx.courseStatusHistory.create({
      data: {
        courseId: input.courseId,
        fromStatus: input.fromStatus ?? undefined,
        toStatus: input.toStatus,
        actorType: input.actorType,
        actorId: input.actorId ?? undefined,
        reason: input.reason ?? undefined,
        metadata: input.metadata ?? undefined,
      },
    });
  }

  async listForCourse(courseId: string) {
    return this.prisma.courseStatusHistory.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
