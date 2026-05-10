import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CourseCatalogService } from '../carts/course-catalog.service';
import {
  CreateEnrollmentRequest,
  EnrollmentServiceClient,
} from './enrollment-service.client';

@Injectable()
export class PaymentFulfillmentService {
  private readonly logger = new Logger(PaymentFulfillmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly courseCatalogService: CourseCatalogService,
    private readonly enrollmentServiceClient: EnrollmentServiceClient,
  ) {}

  async fulfillPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      this.logger.warn(`Skipping fulfillment for missing order ${orderId}`);
      return {
        orderId,
        createdCount: 0,
        skippedCount: 0,
      };
    }

    if (order.status !== OrderStatus.paid) {
      this.logger.warn(`Skipping fulfillment for order ${orderId} with status ${order.status}`);
      return {
        orderId,
        createdCount: 0,
        skippedCount: order.items.length,
      };
    }

    const courseSnapshots = await this.courseCatalogService.getEnrollmentCoursesByIds(
      order.items.map((item) => item.courseId),
    );

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of order.items) {
      const course = courseSnapshots.get(item.courseId);
      if (!course) {
        throw new NotFoundException(`Course ${item.courseId} not found`);
      }

      const existing = await this.enrollmentServiceClient.findByUserAndCourse(
        order.userId,
        item.courseId,
      );

      if (existing && (existing.status === 'active' || existing.status === 'completed')) {
        skippedCount += 1;
        continue;
      }

      const created = await this.enrollmentServiceClient.createEnrollment({
        userId: order.userId,
        courseId: item.courseId,
        courseSlug: course.slug,
        courseTitle: item.courseTitle,
        courseThumbnailUrl: item.courseThumbnailUrl,
        instructorName: item.instructorName,
        orderId: order.id,
        totalLectures: course.totalLectures,
      } satisfies CreateEnrollmentRequest);

      if (created) {
        createdCount += 1;
      } else {
        skippedCount += 1;
      }
    }

    this.logger.log(
      `Fulfilled order ${orderId}: created ${createdCount}, skipped ${skippedCount}`,
    );

    return {
      orderId,
      createdCount,
      skippedCount,
    };
  }

  async revokePayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      this.logger.warn(`Skipping refund sync for missing order ${orderId}`);
      return {
        orderId,
        refundedCount: 0,
        skippedCount: 0,
      };
    }

    if (order.status !== OrderStatus.refunded) {
      this.logger.warn(`Skipping refund sync for order ${orderId} with status ${order.status}`);
      return {
        orderId,
        refundedCount: 0,
        skippedCount: order.items.length,
      };
    }

    let refundedCount = 0;
    let skippedCount = 0;

    for (const item of order.items) {
      const existing = await this.enrollmentServiceClient.findByUserAndCourse(
        order.userId,
        item.courseId,
      );

      if (!existing) {
        skippedCount += 1;
        continue;
      }

      if (existing.status === 'refunded' || existing.status === 'revoked') {
        skippedCount += 1;
        continue;
      }

      await this.enrollmentServiceClient.syncEnrollmentStatus({
        enrollmentId: existing.id,
        status: 'refunded',
        reason: `Refunded payment order ${order.id}`,
      });
      refundedCount += 1;
    }

    this.logger.log(`Refunded order ${orderId}: updated ${refundedCount}, skipped ${skippedCount}`);

    return {
      orderId,
      refundedCount,
      skippedCount,
    };
  }
}
