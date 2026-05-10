import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueueService } from '../queue/queue.service';

const DEFAULT_INSTRUCTOR_SHARE_BPS = 7000;

@Injectable()
export class InternalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async getOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, transactions: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getCourseSalesAnalytics(
    courseIds: string[],
    days?: number,
    instructorShareBps?: number,
  ) {
    const uniqueCourseIds = [...new Set(courseIds.filter(Boolean))];
    const normalizedDays = this.normalizeAnalyticsDays(days);
    const shareBps = this.normalizeShareBps(instructorShareBps);
    const currentEnd = new Date();
    const currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() - normalizedDays);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - normalizedDays);

    if (!uniqueCourseIds.length) {
      return this.emptySalesAnalytics(normalizedDays, shareBps);
    }

    const baseWhere = {
      courseId: { in: uniqueCourseIds },
      order: {
        status: OrderStatus.paid,
      },
    };

    const [currentItems, previousItems, recentItems] = await this.prisma.$transaction([
      this.prisma.orderItem.findMany({
        where: {
          ...baseWhere,
          order: {
            status: OrderStatus.paid,
            paidAt: {
              gte: currentStart,
              lt: currentEnd,
            },
          },
        },
        select: {
          id: true,
          orderId: true,
          courseId: true,
          courseTitle: true,
          finalPrice: true,
          currency: true,
          order: {
            select: {
              paidAt: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.orderItem.findMany({
        where: {
          ...baseWhere,
          order: {
            status: OrderStatus.paid,
            paidAt: {
              gte: previousStart,
              lt: currentStart,
            },
          },
        },
        select: {
          finalPrice: true,
        },
      }),
      this.prisma.orderItem.findMany({
        where: baseWhere,
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
        select: {
          id: true,
          orderId: true,
          courseId: true,
          courseTitle: true,
          finalPrice: true,
          currency: true,
          order: {
            select: {
              paidAt: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    const grossRevenue = currentItems.reduce((sum, item) => sum + item.finalPrice, 0);
    const previousGrossRevenue = previousItems.reduce((sum, item) => sum + item.finalPrice, 0);
    const instructorEarnings = this.calculateInstructorEarnings(grossRevenue, shareBps);
    const platformFee = grossRevenue - instructorEarnings;
    const currency = currentItems[0]?.currency ?? recentItems[0]?.currency ?? 'VND';
    const courseMap = new Map<
      string,
      {
        courseId: string;
        title: string;
        sales: number;
        grossRevenue: number;
        instructorEarnings: number;
        platformFee: number;
      }
    >();

    for (const item of currentItems) {
      const current = courseMap.get(item.courseId);
      const nextGrossRevenue = (current?.grossRevenue ?? 0) + item.finalPrice;
      const nextInstructorEarnings = this.calculateInstructorEarnings(nextGrossRevenue, shareBps);

      courseMap.set(item.courseId, {
        courseId: item.courseId,
        title: item.courseTitle,
        sales: (current?.sales ?? 0) + 1,
        grossRevenue: nextGrossRevenue,
        instructorEarnings: nextInstructorEarnings,
        platformFee: nextGrossRevenue - nextInstructorEarnings,
      });
    }

    return {
      days: normalizedDays,
      instructorShareBps: shareBps,
      currency,
      grossRevenue,
      previousGrossRevenue,
      revenueDeltaPercent: this.calculateDeltaPercent(grossRevenue, previousGrossRevenue),
      instructorEarnings,
      platformFee,
      currentSales: currentItems.length,
      previousSales: previousItems.length,
      salesDeltaPercent: this.calculateDeltaPercent(currentItems.length, previousItems.length),
      series: this.buildDailySeries(
        currentItems.map((item) => ({
          date: item.order.paidAt ?? item.order.createdAt,
          value: item.finalPrice,
        })),
        normalizedDays,
        shareBps,
      ),
      byCourse: [...courseMap.values()].sort((left, right) => right.grossRevenue - left.grossRevenue),
      recentSales: recentItems.map((item) => {
        const instructorAmount = this.calculateInstructorEarnings(item.finalPrice, shareBps);

        return {
          id: item.id,
          orderId: item.orderId,
          courseId: item.courseId,
          courseTitle: item.courseTitle,
          grossRevenue: item.finalPrice,
          instructorEarnings: instructorAmount,
          platformFee: item.finalPrice - instructorAmount,
          currency: item.currency,
          paidAt: item.order.paidAt ?? item.order.createdAt,
        };
      }),
    };
  }

  async refundOrder(orderId: string, reason?: string) {
    const order = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'refunded',
          refundedAt: new Date(),
          failureReason: reason,
        },
      });

      await tx.paymentTransaction.updateMany({
        where: { orderId, status: 'success' },
        data: { status: 'refunded', failureReason: reason },
      });

      return order;
    });

    await this.queueService.enqueuePaymentRefunded(order.id);

    return order;
  }

  private emptySalesAnalytics(days: number, shareBps: number) {
    return {
      days,
      instructorShareBps: shareBps,
      currency: 'VND',
      grossRevenue: 0,
      previousGrossRevenue: 0,
      revenueDeltaPercent: 0,
      instructorEarnings: 0,
      platformFee: 0,
      currentSales: 0,
      previousSales: 0,
      salesDeltaPercent: 0,
      series: [],
      byCourse: [],
      recentSales: [],
    };
  }

  private normalizeAnalyticsDays(days?: number): number {
    if (!Number.isFinite(days)) {
      return 30;
    }

    return Math.min(90, Math.max(7, Math.round(days!)));
  }

  private normalizeShareBps(instructorShareBps?: number): number {
    if (!Number.isFinite(instructorShareBps)) {
      return DEFAULT_INSTRUCTOR_SHARE_BPS;
    }

    return Math.min(10000, Math.max(0, Math.round(instructorShareBps!)));
  }

  private calculateInstructorEarnings(amount: number, instructorShareBps: number): number {
    return Math.floor((amount * instructorShareBps) / 10000);
  }

  private calculateDeltaPercent(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private buildDailySeries(
    rows: Array<{ date: Date; value: number }>,
    days: number,
    instructorShareBps: number,
  ) {
    const today = new Date();
    const starts = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - index - 1));
      return date;
    });

    return starts.map((start) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const grossRevenue = rows
        .filter((row) => row.date >= start && row.date < end)
        .reduce((sum, row) => sum + row.value, 0);
      const instructorEarnings = this.calculateInstructorEarnings(grossRevenue, instructorShareBps);

      return {
        date: start.toISOString().slice(0, 10),
        label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        grossRevenue,
        instructorEarnings,
        platformFee: grossRevenue - instructorEarnings,
        sales: rows.filter((row) => row.date >= start && row.date < end).length,
      };
    });
  }
}
