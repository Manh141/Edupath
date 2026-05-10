import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { buildPaginationMeta } from '../../common/utils/pagination.util';
import { CartsService, TrustedCartItem } from '../carts/carts.service';
import { CourseCatalogService } from '../carts/course-catalog.service';
import { CouponsService } from '../coupons/coupons.service';
import { QueueService } from '../queue/queue.service';
import { QueryAdminOrdersDto } from './dto/query-admin-orders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryMyOrdersDto } from './dto/query-my-orders.dto';

const adminOrderInclude = {
  items: true,
  transactions: {
    orderBy: {
      createdAt: 'desc',
    },
  },
  coupon: true,
} satisfies Prisma.OrderInclude;

type OrderWithAdminRelations = Prisma.OrderGetPayload<{
  include: typeof adminOrderInclude;
}>;

type CheckoutSource = {
  sourceCartId: string | null;
  couponCode?: string | null;
  currency: string;
  items: TrustedCartItem[];
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cartsService: CartsService,
    private readonly courseCatalogService: CourseCatalogService,
    private readonly couponsService: CouponsService,
    private readonly queueService: QueueService,
  ) {}

  private getMonthStart(offset = 0): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  }

  private getRollingMonthStarts(months: number): Date[] {
    const currentMonthStart = this.getMonthStart();

    return Array.from({ length: months }, (_, index) => {
      const monthsAgo = months - index - 1;
      return new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - monthsAgo, 1);
    });
  }

  private formatMonthLabel(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    });
  }

  private calculateDeltaPercent(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  async checkout(userId: string, dto: CreateOrderDto) {
    const checkoutSource = await this.resolveCheckoutSource(userId, dto);

    if (dto.idempotencyKey) {
      const existing = await this.prisma.order.findFirst({
        where: { userId, idempotencyKey: dto.idempotencyKey },
        include: { items: true, transactions: true },
      });
      if (existing) {
        if (existing.status === OrderStatus.paid) {
          await this.queueService.enqueuePaymentSucceeded(existing.id);
        }

        return existing;
      }
    }

    const currency = checkoutSource.currency;
    const subtotalAmount = checkoutSource.items.reduce((sum, item) => sum + item.unitPrice, 0);

    let coupon = null;
    let discountAmount = 0;
    if (checkoutSource.couponCode) {
      coupon = await this.couponsService.validateCouponOrThrow(checkoutSource.couponCode);
      if (coupon.minOrderAmount && subtotalAmount < coupon.minOrderAmount) {
        throw new BadRequestException('Order does not satisfy coupon minimum amount');
      }
      if (coupon.discountPercent) {
        discountAmount = Math.floor((subtotalAmount * coupon.discountPercent) / 100);
      }
      if (coupon.discountAmount) {
        discountAmount = coupon.discountAmount;
      }
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    }

    const totalAmount = Math.max(0, subtotalAmount - discountAmount);
    const isFreeOrder = totalAmount === 0;
    const paymentProvider = isFreeOrder ? PaymentMethod.free : dto.provider;

    if (!isFreeOrder && paymentProvider === PaymentMethod.free) {
      throw new BadRequestException('Free payment method can only be used for zero-total orders');
    }

    const expiresAt = new Date(
      Date.now() + this.configService.get<number>('ORDER_TTL_MINUTES', 30) * 60_000,
    );
    const now = new Date();
    const finalPrices = this.allocateFinalPrices(
      checkoutSource.items.map((item) => item.unitPrice),
      discountAmount,
    );

    const result = await this.prisma.$transaction(
      async (tx) => {
        if (checkoutSource.sourceCartId) {
          await tx.cart.update({
            where: { id: checkoutSource.sourceCartId },
            data: { currency },
          });

          await Promise.all(
            checkoutSource.items.map((item) =>
              tx.cartItem.update({
                where: {
                  cartId_courseId: {
                    cartId: checkoutSource.sourceCartId!,
                    courseId: item.courseId,
                  },
                },
                data: {
                  courseTitle: item.courseTitle,
                  courseThumbnailUrl: item.courseThumbnailUrl,
                  instructorName: item.instructorName,
                  unitPrice: item.unitPrice,
                  currency: item.currency,
                },
              }),
            ),
          );
        }

        const order = await tx.order.create({
          data: {
            userId,
            couponId: coupon?.id,
            couponCodeSnapshot: coupon?.code,
            subtotalAmount,
            discountAmount,
            totalAmount,
            currency,
            expiresAt: isFreeOrder ? null : expiresAt,
            sourceCartId: checkoutSource.sourceCartId ?? undefined,
            idempotencyKey: dto.idempotencyKey,
            status: isFreeOrder ? OrderStatus.paid : OrderStatus.pending,
            paidAt: isFreeOrder ? now : null,
            items: {
              create: checkoutSource.items.map((item, index) => ({
                courseId: item.courseId,
                courseTitle: item.courseTitle,
                courseThumbnailUrl: item.courseThumbnailUrl,
                instructorName: item.instructorName,
                unitPrice: item.unitPrice,
                finalPrice: finalPrices[index] ?? item.unitPrice,
                currency: item.currency,
              })),
            },
            transactions: {
              create: {
                provider: paymentProvider,
                amount: totalAmount,
                currency,
                status: isFreeOrder ? PaymentStatus.success : PaymentStatus.pending,
                paidAt: isFreeOrder ? now : null,
              },
            },
          },
          include: { items: true, transactions: true },
        });

        if (checkoutSource.sourceCartId) {
          await tx.cart.update({
            where: { id: checkoutSource.sourceCartId },
            data: { status: 'converted', convertedOrderId: order.id },
          });
        }

        return order;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    await this.queueService.enqueueOrderCreated(result.id);
    if (isFreeOrder) {
      await this.queueService.enqueuePaymentSucceeded(result.id);
    }
    return result;
  }

  private async resolveCheckoutSource(userId: string, dto: CreateOrderDto): Promise<CheckoutSource> {
    if (!dto.courseId) {
      const cart = await this.cartsService.getValidatedCheckoutCart(userId);
      return {
        sourceCartId: cart.cartId,
        couponCode: cart.couponCode,
        currency: cart.currency,
        items: cart.items,
      };
    }

    const course = await this.courseCatalogService.getSellableCourseById(dto.courseId);

    return {
      sourceCartId: null,
      couponCode: null,
      currency: course.currency,
      items: [
        {
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
          courseThumbnailUrl: course.thumbnailUrl,
          instructorName: course.instructorName,
          unitPrice: course.unitPrice,
          currency: course.currency,
          totalLectures: course.totalLectures,
        },
      ],
    };
  }

  async findMyOrders(userId: string, query: QueryMyOrdersDto) {
    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
    };
    const skip = (query.page - 1) * query.limit;

    // Map sortBy parameter to actual field and direction
    const sortByMap = {
      createdAt: { createdAt: 'desc' as const },
      updatedAt: { updatedAt: 'desc' as const },
      paidAt: { paidAt: 'desc' as const },
      totalAmount: { totalAmount: 'desc' as const },
      newest: { createdAt: 'desc' as const },
    };
    const orderBy = sortByMap[query.sortBy] || { createdAt: 'desc' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: query.limit,
        orderBy,
        include: { items: true, transactions: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(query.page, query.limit, total) };
  }

  async listAdminOrders(query: QueryAdminOrdersDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where = this.buildAdminOrderWhere(query);
    const orderBy = this.buildAdminOrderOrderBy(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: adminOrderInclude,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    const normalizedItems = items.map((order) => this.toAdminOrder(order));

    return {
      items: normalizedItems,
      data: normalizedItems,
      total,
      page,
      limit,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async findOneForAdmin(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: adminOrderInclude,
    });

    if (!order) throw new NotFoundException('Order not found');
    return this.toAdminOrder(order);
  }

  async getAdminOrderStats() {
    const currentMonthStart = this.getMonthStart();
    const previousMonthStart = this.getMonthStart(-1);
    const nextMonthStart = this.getMonthStart(1);
    const monthStarts = this.getRollingMonthStarts(12);
    const firstSeriesMonth = monthStarts[0] ?? currentMonthStart;
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const last90Days = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const [
      currentRevenue,
      previousRevenue,
      currentPaidOrders,
      previousPaidOrders,
      totalOrders,
      refundOrders,
      cartsLast30Days,
      checkoutOrdersLast30Days,
      paidOrdersLast30Days,
      monthlyOrders,
      recentOrders,
      topCourseItems,
    ] = await this.prisma.$transaction([
      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.paid,
          paidAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.paid,
          paidAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.paid,
          paidAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.paid,
          paidAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.refunded } }),
      this.prisma.cart.count({
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.paid,
          paidAt: {
            gte: last30Days,
          },
        },
      }),
      this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: firstSeriesMonth,
          },
        },
        select: {
          createdAt: true,
          paidAt: true,
          status: true,
          totalAmount: true,
        },
      }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: adminOrderInclude,
      }),
      this.prisma.orderItem.findMany({
        where: {
          order: {
            status: OrderStatus.paid,
            paidAt: {
              gte: last90Days,
            },
          },
        },
        select: {
          courseId: true,
          courseTitle: true,
          instructorName: true,
          finalPrice: true,
          orderId: true,
        },
      }),
    ]);

    const [statusBreakdown, paymentMethods] = await Promise.all([
      Promise.all(
        Object.values(OrderStatus).map(async (status) => ({
          status,
          value: await this.prisma.order.count({ where: { status } }),
        })),
      ),
      Promise.all(
        Object.values(PaymentMethod).map(async (provider) => {
          const [transactions, amount] = await Promise.all([
            this.prisma.paymentTransaction.count({
              where: {
                provider,
                status: PaymentStatus.success,
              },
            }),
            this.prisma.paymentTransaction.aggregate({
              where: {
                provider,
                status: PaymentStatus.success,
              },
              _sum: {
                amount: true,
              },
            }),
          ]);

          return {
            provider,
            transactions,
            amount: amount._sum.amount ?? 0,
          };
        }),
      ),
    ]);

    const monthlyRevenue = monthStarts.map((start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const paidInMonth = monthlyOrders.filter((order) => {
        const paidAt = order.paidAt ?? order.createdAt;
        return order.status === OrderStatus.paid && paidAt >= start && paidAt < end;
      });

      return {
        month: start.toISOString().slice(0, 7),
        label: this.formatMonthLabel(start),
        revenue: paidInMonth.reduce((sum, order) => sum + order.totalAmount, 0),
        orders: paidInMonth.length,
      };
    });

    const courseMap = new Map<
      string,
      {
        courseId: string;
        title: string;
        instructorName: string;
        sales: number;
        revenue: number;
      }
    >();

    for (const item of topCourseItems) {
      const current = courseMap.get(item.courseId);
      courseMap.set(item.courseId, {
        courseId: item.courseId,
        title: item.courseTitle,
        instructorName: item.instructorName,
        sales: (current?.sales ?? 0) + 1,
        revenue: (current?.revenue ?? 0) + item.finalPrice,
      });
    }

    const currentRevenueValue = currentRevenue._sum.totalAmount ?? 0;
    const previousRevenueValue = previousRevenue._sum.totalAmount ?? 0;
    const averageOrderValue =
      currentPaidOrders > 0 ? Math.round(currentRevenueValue / currentPaidOrders) : 0;

    return {
      totalOrders,
      paidOrders: statusBreakdown.find((item) => item.status === OrderStatus.paid)?.value ?? 0,
      pendingOrders:
        statusBreakdown.find((item) => item.status === OrderStatus.pending)?.value ?? 0,
      failedOrders: statusBreakdown.find((item) => item.status === OrderStatus.failed)?.value ?? 0,
      refundOrders,
      revenueThisMonth: currentRevenueValue,
      revenuePreviousMonth: previousRevenueValue,
      revenueDeltaPercent: this.calculateDeltaPercent(currentRevenueValue, previousRevenueValue),
      paidOrdersThisMonth: currentPaidOrders,
      paidOrdersPreviousMonth: previousPaidOrders,
      paidOrdersDeltaPercent: this.calculateDeltaPercent(currentPaidOrders, previousPaidOrders),
      averageOrderValue,
      refundRate: totalOrders > 0 ? Number(((refundOrders / totalOrders) * 100).toFixed(1)) : 0,
      conversionRate:
        cartsLast30Days > 0
          ? Number(((paidOrdersLast30Days / cartsLast30Days) * 100).toFixed(1))
          : 0,
      funnel: [
        { label: 'Cart created', value: cartsLast30Days },
        { label: 'Checkout started', value: checkoutOrdersLast30Days },
        { label: 'Paid orders', value: paidOrdersLast30Days },
      ],
      statusBreakdown,
      monthlyRevenue,
      paymentMethods,
      recentOrders: recentOrders.map((order) => this.toAdminOrder(order)),
      topCourses: [...courseMap.values()]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 8),
    };
  }

  async findOneForUser(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, transactions: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async markPaid(
    orderId: string,
    transactionId: string,
    providerRef?: string,
    rawResponse?: Prisma.InputJsonValue,
    callbackChecksum?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.paymentTransaction.findUnique({
        where: { id: transactionId },
        select: { orderId: true, status: true },
      });

      if (!existingTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (existingTransaction.orderId !== orderId) {
        throw new BadRequestException('Order mismatch');
      }

      if (existingTransaction.status === 'refunded') {
        throw new BadRequestException('Refunded transaction cannot be marked as paid');
      }

      if (existingTransaction.status === 'success') {
        const [transaction, order] = await Promise.all([
          tx.paymentTransaction.findUniqueOrThrow({ where: { id: transactionId } }),
          tx.order.findUniqueOrThrow({
            where: { id: orderId },
            include: { items: true, transactions: true },
          }),
        ]);

        return { order, transaction };
      }

      const paidAt = new Date();
      const updatedTransactions = await tx.paymentTransaction.updateMany({
        where: { id: transactionId, status: { not: 'success' } },
        data: {
          status: 'success',
          providerRef,
          paidAt,
          rawResponse,
          callbackChecksum,
        },
      });

      const transaction = await tx.paymentTransaction.findUniqueOrThrow({
        where: { id: transactionId },
      });

      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          paidAt,
          failedAt: null,
          cancelledAt: null,
          refundedAt: null,
          failureReason: null,
        },
        include: { items: true, transactions: true },
      });

      if (updatedTransactions.count > 0 && order.couponId) {
        await tx.coupon.update({
          where: { id: order.couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return { order, transaction };
    });
  }

  private buildAdminOrderWhere(query: QueryAdminOrdersDto): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.provider) {
      where.transactions = {
        some: {
          provider: query.provider,
        },
      };
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { userId: { contains: query.search, mode: 'insensitive' } },
        {
          couponCodeSnapshot: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          items: {
            some: {
              courseTitle: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          items: {
            some: {
              instructorName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    return where;
  }

  private buildAdminOrderOrderBy(query: QueryAdminOrdersDto): Prisma.OrderOrderByWithRelationInput {
    if (query.sortBy === 'newest') {
      return { createdAt: 'desc' };
    }

    return {
      [query.sortBy]: query.order,
    };
  }

  private toAdminOrder(order: OrderWithAdminRelations) {
    const latestTransaction = order.transactions[0];
    const firstItem = order.items[0];

    return {
      ...order,
      subtotal: order.subtotalAmount,
      discount: order.discountAmount,
      total: order.totalAmount,
      provider: latestTransaction?.provider,
      paymentStatus: latestTransaction?.status,
      paymentReference: latestTransaction?.providerRef,
      courseTitle:
        order.items.length === 1 ? firstItem?.courseTitle : `${order.items.length} courses`,
      itemCount: order.items.length,
    };
  }

  private allocateFinalPrices(unitPrices: number[], discountAmount: number) {
    const subtotalAmount = unitPrices.reduce((sum, price) => sum + price, 0);
    const cappedDiscount = Math.max(0, Math.min(discountAmount, subtotalAmount));

    if (subtotalAmount <= 0 || cappedDiscount <= 0) {
      return [...unitPrices];
    }

    const allocations = unitPrices.map((price, index) => {
      const exactDiscount = (cappedDiscount * price) / subtotalAmount;
      const allocatedDiscount = Math.floor(exactDiscount);

      return {
        index,
        price,
        allocatedDiscount,
        remainder: exactDiscount - allocatedDiscount,
      };
    });

    let remainingDiscount =
      cappedDiscount - allocations.reduce((sum, item) => sum + item.allocatedDiscount, 0);

    for (const item of [...allocations].sort(
      (left, right) =>
        right.remainder - left.remainder || right.price - left.price || left.index - right.index,
    )) {
      if (remainingDiscount <= 0) {
        break;
      }

      if (item.allocatedDiscount >= item.price) {
        continue;
      }

      item.allocatedDiscount += 1;
      remainingDiscount -= 1;
    }

    return allocations
      .sort((left, right) => left.index - right.index)
      .map((item) => Math.max(0, item.price - item.allocatedDiscount));
  }
}
