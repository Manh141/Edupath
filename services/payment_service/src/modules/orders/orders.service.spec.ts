/// <reference types="jest" />
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../common/prisma/prisma-client';
import type { PrismaService } from '../../common/prisma/prisma.service';
import type { CartsService } from '../carts/carts.service';
import type { CourseCatalogService } from '../carts/course-catalog.service';
import type { CouponsService } from '../coupons/coupons.service';
import type { QueueService } from '../queue/queue.service';
import { OrdersService } from './orders.service';

function createConfigService() {
  return {
    get: jest.fn((key: string, fallback?: unknown) => {
      if (key === 'ORDER_TTL_MINUTES') {
        return 30;
      }

      return fallback;
    }),
  } as unknown as ConfigService;
}

function createPrismaMock() {
  const order = {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  };
  const paymentTransaction = {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    updateMany: jest.fn(),
  };
  const coupon = {
    update: jest.fn(),
  };
  const cart = {
    update: jest.fn(),
  };
  const cartItem = {
    update: jest.fn(),
  };

  return {
    order,
    paymentTransaction,
    coupon,
    cart,
    cartItem,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          order,
          paymentTransaction,
          coupon,
          cart,
          cartItem,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('OrdersService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let cartsService: { getValidatedCheckoutCart: jest.Mock };
  let courseCatalogService: { getSellableCourseById: jest.Mock };
  let couponsService: { validateCouponOrThrow: jest.Mock };
  let queueService: {
    enqueueOrderCreated: jest.Mock;
    enqueuePaymentSucceeded: jest.Mock;
  };
  let service: OrdersService;

  beforeEach(() => {
    prisma = createPrismaMock();
    cartsService = {
      getValidatedCheckoutCart: jest.fn(),
    };
    courseCatalogService = {
      getSellableCourseById: jest.fn(),
    };
    couponsService = {
      validateCouponOrThrow: jest.fn(),
    };
    queueService = {
      enqueueOrderCreated: jest.fn().mockResolvedValue(undefined),
      enqueuePaymentSucceeded: jest.fn().mockResolvedValue(undefined),
    };

    service = new OrdersService(
      prisma as unknown as PrismaService,
      createConfigService(),
      cartsService as unknown as CartsService,
      courseCatalogService as unknown as CourseCatalogService,
      couponsService as unknown as CouponsService,
      queueService as unknown as QueueService,
    );
  });

  it('creates a pending order and payment transaction for a paid course', async () => {
    prisma.order.findFirst.mockResolvedValue(null);
    courseCatalogService.getSellableCourseById.mockResolvedValue({
      id: 'course-1',
      slug: 'course-1',
      title: 'NestJS Fundamentals',
      thumbnailUrl: 'https://cdn.example.com/course.png',
      instructorName: 'Instructor One',
      unitPrice: 500000,
      currency: 'VND',
      totalLectures: 12,
    });
    prisma.order.create.mockResolvedValue({
      id: 'order-1',
      status: OrderStatus.pending,
      items: [{ courseId: 'course-1' }],
      transactions: [{ status: PaymentStatus.pending, amount: 500000 }],
    });

    const result = await service.checkout('user-1', {
      courseId: 'course-1',
      provider: PaymentMethod.vnpay,
      idempotencyKey: 'idem-1',
    });

    expect(result.status).toBe(OrderStatus.pending);
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          status: OrderStatus.pending,
          totalAmount: 500000,
          transactions: {
            create: expect.objectContaining({
              provider: PaymentMethod.vnpay,
              status: PaymentStatus.pending,
              amount: 500000,
            }),
          },
        }),
      }),
    );
    expect(queueService.enqueueOrderCreated).toHaveBeenCalledWith('order-1');
    expect(queueService.enqueuePaymentSucceeded).not.toHaveBeenCalled();
  });

  it('rejects using free payment method for a non-zero order', async () => {
    prisma.order.findFirst.mockResolvedValue(null);
    courseCatalogService.getSellableCourseById.mockResolvedValue({
      id: 'course-1',
      slug: 'course-1',
      title: 'NestJS Fundamentals',
      thumbnailUrl: '',
      instructorName: 'Instructor One',
      unitPrice: 500000,
      currency: 'VND',
      totalLectures: 12,
    });

    await expect(
      service.checkout('user-1', {
        courseId: 'course-1',
        provider: PaymentMethod.free,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('marks a pending payment as paid and updates the order status', async () => {
    prisma.paymentTransaction.findUnique.mockResolvedValue({
      orderId: 'order-1',
      status: PaymentStatus.pending,
    });
    prisma.paymentTransaction.updateMany.mockResolvedValue({ count: 1 });
    prisma.paymentTransaction.findUniqueOrThrow.mockResolvedValue({
      id: 'tx-1',
      orderId: 'order-1',
      status: PaymentStatus.success,
    });
    prisma.order.update.mockResolvedValue({
      id: 'order-1',
      status: OrderStatus.paid,
      couponId: 'coupon-1',
      items: [],
      transactions: [],
    });
    prisma.coupon.update.mockResolvedValue({
      id: 'coupon-1',
      usedCount: 1,
    });

    const result = await service.markPaid(
      'order-1',
      'tx-1',
      'provider-ref-1',
      { source: 'callback' },
      'checksum',
    );

    expect(result.order.status).toBe(OrderStatus.paid);
    expect(prisma.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'order-1' },
        data: expect.objectContaining({
          status: OrderStatus.paid,
          failureReason: null,
        }),
      }),
    );
    expect(prisma.coupon.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'coupon-1' },
        data: { usedCount: { increment: 1 } },
      }),
    );
  });

  it('does not allow a refunded transaction to become paid again', async () => {
    prisma.paymentTransaction.findUnique.mockResolvedValue({
      orderId: 'order-1',
      status: PaymentStatus.refunded,
    });

    await expect(service.markPaid('order-1', 'tx-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
