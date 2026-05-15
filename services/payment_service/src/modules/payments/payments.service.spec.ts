/// <reference types="jest" />
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../common/prisma/prisma-client';
import type { PrismaService } from '../../common/prisma/prisma.service';
import type { OrdersService } from '../orders/orders.service';
import type { QueueService } from '../queue/queue.service';
import { PaymentsService } from './payments.service';

function createConfigService() {
  return {
    get: jest.fn((key: string, fallback?: unknown) => {
      if (key === 'PAYMENT_SANDBOX_MODE') {
        return 'true';
      }

      return fallback;
    }),
    getOrThrow: jest.fn((key: string) => {
      if (key === 'PAYMENT_CALLBACK_SECRET') {
        return 'callback-secret';
      }

      throw new Error(`Missing config key ${key}`);
    }),
  } as unknown as ConfigService;
}

function createPrismaMock() {
  const paymentTransaction = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  };
  const order = {
    update: jest.fn(),
  };

  return {
    paymentTransaction,
    order,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          paymentTransaction,
          order,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('PaymentsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let ordersService: { markPaid: jest.Mock };
  let queueService: {
    enqueuePaymentSucceeded: jest.Mock;
    enqueuePaymentRefunded: jest.Mock;
  };
  let service: PaymentsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    ordersService = {
      markPaid: jest.fn(),
    };
    queueService = {
      enqueuePaymentSucceeded: jest.fn().mockResolvedValue(undefined),
      enqueuePaymentRefunded: jest.fn().mockResolvedValue(undefined),
    };

    service = new PaymentsService(
      prisma as unknown as PrismaService,
      createConfigService(),
      ordersService as unknown as OrdersService,
      queueService as unknown as QueueService,
    );
  });

  it('acknowledges a successful provider callback and triggers downstream fulfillment', async () => {
    prisma.paymentTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      orderId: 'order-1',
      provider: PaymentMethod.vnpay,
      status: PaymentStatus.pending,
    });
    ordersService.markPaid.mockResolvedValue({
      order: { id: 'order-1', status: OrderStatus.paid },
      transaction: { id: 'tx-1', status: PaymentStatus.success },
    });
    jest
      .spyOn(
        service as unknown as {
          assertValidCallbackChecksum: (dto: unknown, provider: string) => void;
        },
        'assertValidCallbackChecksum',
      )
      .mockImplementation(() => undefined);

    const result = await service.handleProviderCallback({
      orderId: 'order-1',
      transactionId: 'tx-1',
      status: 'success',
      providerRef: 'provider-ref-1',
      checksum: 'ok',
      rawResponse: { gateway: 'vnpay' },
    });

    expect(result).toEqual({
      acknowledged: true,
      orderId: 'order-1',
      idempotent: false,
    });
    expect(ordersService.markPaid).toHaveBeenCalledWith(
      'order-1',
      'tx-1',
      'provider-ref-1',
      { gateway: 'vnpay' },
      'ok',
    );
    expect(queueService.enqueuePaymentSucceeded).toHaveBeenCalledWith('order-1');
  });

  it('rejects pending provider callbacks', async () => {
    await expect(
      service.handleProviderCallback({
        orderId: 'order-1',
        transactionId: 'tx-1',
        status: 'pending',
        checksum: 'ignored',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not allow a successful transaction to transition to failed', async () => {
    prisma.paymentTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      orderId: 'order-1',
      provider: PaymentMethod.vnpay,
      status: PaymentStatus.success,
    });
    jest
      .spyOn(
        service as unknown as {
          assertValidCallbackChecksum: (dto: unknown, provider: string) => void;
        },
        'assertValidCallbackChecksum',
      )
      .mockImplementation(() => undefined);

    await expect(
      service.handleProviderCallback({
        orderId: 'order-1',
        transactionId: 'tx-1',
        status: 'failed',
        providerRef: 'provider-ref-1',
        checksum: 'ok',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates order state to failed when the gateway reports a failure', async () => {
    prisma.paymentTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      orderId: 'order-1',
      provider: PaymentMethod.vnpay,
      status: PaymentStatus.pending,
    });
    prisma.paymentTransaction.update.mockResolvedValue({
      id: 'tx-1',
      status: PaymentStatus.failed,
    });
    prisma.order.update.mockResolvedValue({
      id: 'order-1',
      status: OrderStatus.failed,
    });
    jest
      .spyOn(
        service as unknown as {
          assertValidCallbackChecksum: (dto: unknown, provider: string) => void;
        },
        'assertValidCallbackChecksum',
      )
      .mockImplementation(() => undefined);

    const result = await service.handleProviderCallback({
      orderId: 'order-1',
      transactionId: 'tx-1',
      status: 'failed',
      providerRef: 'provider-ref-1',
      checksum: 'ok',
    });

    expect(result).toEqual({ acknowledged: true });
    expect(prisma.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'order-1' },
        data: expect.objectContaining({
          status: OrderStatus.failed,
          failureReason: 'Payment provider reported failure',
        }),
      }),
    );
  });
});
