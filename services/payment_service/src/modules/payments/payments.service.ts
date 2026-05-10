import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Prisma } from '../../common/prisma/prisma-client';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { QueueService } from '../queue/queue.service';
import { ProviderCallbackDto } from './dto/provider-callback.dto';
import { SimulatePaymentDto } from './dto/simulate-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly queueService: QueueService,
  ) {}

  private toJsonValue(
    value?: Record<string, unknown>,
  ): Prisma.InputJsonValue | undefined {
    return value as Prisma.InputJsonValue | undefined;
  }

  async getTransaction(transactionId: string, currentUser: CurrentUserInterface) {
    const transaction = await this.prisma.paymentTransaction.findFirst({
      where: {
        id: transactionId,
        ...(currentUser.roles.includes(ROLES.ADMIN) ? {} : { order: { userId: currentUser.sub } }),
      },
      include: { order: true },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async handleProviderCallback(dto: ProviderCallbackDto) {
    if (dto.status === 'pending') {
      throw new BadRequestException('Pending callbacks are not supported');
    }

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: dto.transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.orderId !== dto.orderId) throw new BadRequestException('Order mismatch');

    this.assertValidCallbackChecksum(dto, transaction.provider);

    if (dto.status === 'success') {
      const { order } = await this.ordersService.markPaid(
        dto.orderId,
        dto.transactionId,
        dto.providerRef,
        this.toJsonValue(dto.rawResponse),
        dto.checksum,
      );
      await this.queueService.enqueuePaymentSucceeded(order.id);
      return { acknowledged: true, orderId: order.id, idempotent: transaction.status === 'success' };
    }

    if (dto.status === 'refunded') {
      const occurredAt = new Date();
      await this.prisma.$transaction(async (tx) => {
        const currentTransaction = await tx.paymentTransaction.findUnique({
          where: { id: dto.transactionId },
          select: { orderId: true },
        });

        if (!currentTransaction) {
          throw new NotFoundException('Transaction not found');
        }

        if (currentTransaction.orderId !== dto.orderId) {
          throw new BadRequestException('Order mismatch');
        }

        await tx.paymentTransaction.update({
          where: { id: dto.transactionId },
          data: {
            status: dto.status,
            providerRef: dto.providerRef,
            rawResponse: this.toJsonValue(dto.rawResponse),
            callbackChecksum: dto.checksum,
          },
        });

        await tx.order.update({
          where: { id: dto.orderId },
          data: {
            status: 'refunded',
            refundedAt: occurredAt,
            cancelledAt: null,
            failedAt: null,
            failureReason: null,
            paidAt: undefined,
          },
        });
      });

      await this.queueService.enqueuePaymentRefunded(dto.orderId);
      return { acknowledged: true, idempotent: transaction.status === 'refunded' };
    }

    if (transaction.status === 'refunded') {
      return { acknowledged: true, idempotent: true };
    }

    if (transaction.status === 'success') {
      throw new BadRequestException('Successful transactions cannot transition to this status');
    }

    const occurredAt = new Date();
    await this.prisma.paymentTransaction.update({
      where: { id: dto.transactionId },
      data: {
        status: dto.status,
        providerRef: dto.providerRef,
        rawResponse: this.toJsonValue(dto.rawResponse),
        callbackChecksum: dto.checksum,
      },
    });

    await this.prisma.order.update({
      where: { id: dto.orderId },
      data: {
        status:
          dto.status === 'cancelled'
              ? 'cancelled'
              : 'failed',
        cancelledAt: dto.status === 'cancelled' ? occurredAt : null,
        failedAt: dto.status === 'failed' ? occurredAt : null,
        failureReason: dto.status === 'failed' ? 'Payment provider reported failure' : null,
        paidAt: null,
      },
    });

    return { acknowledged: true };
  }

  async simulateTransaction(
    transactionId: string,
    dto: SimulatePaymentDto,
    currentUser: CurrentUserInterface,
  ) {
    if (!this.isSandboxEnabled()) {
      throw new ForbiddenException('Payment sandbox is disabled');
    }

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { order: true },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    const isOwner = transaction.order.userId === currentUser.sub;
    const isAdmin = currentUser.roles.includes(ROLES.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed to simulate this transaction');
    }

    if (dto.status === 'success') {
      const { order, transaction: updatedTransaction } = await this.ordersService.markPaid(
        transaction.orderId,
        transaction.id,
        dto.providerRef ?? `sandbox-${Date.now()}`,
        this.toJsonValue({ simulated: true, at: new Date().toISOString() }),
      );
      await this.queueService.enqueuePaymentSucceeded(order.id);
      return {
        acknowledged: true,
        simulated: true,
        status: 'success' as const,
        orderId: order.id,
        transaction: updatedTransaction,
        order,
      };
    }

    if (transaction.status === 'success') {
      throw new BadRequestException('Successful transactions cannot be simulated to another status');
    }
    if (transaction.status === 'refunded') {
      throw new BadRequestException('Refunded transactions cannot be simulated');
    }

    const occurredAt = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: dto.status,
          providerRef: dto.providerRef ?? transaction.providerRef,
          rawResponse: this.toJsonValue({ simulated: true, at: occurredAt.toISOString() }),
        },
      });

      await tx.order.update({
        where: { id: transaction.orderId },
        data: {
          status: dto.status === 'cancelled' ? 'cancelled' : 'failed',
          cancelledAt: dto.status === 'cancelled' ? occurredAt : null,
          failedAt: dto.status === 'failed' ? occurredAt : null,
          failureReason:
            dto.status === 'failed' ? (dto.failureReason ?? 'Simulated failure') : null,
          paidAt: null,
        },
      });
    });

    return {
      acknowledged: true,
      simulated: true,
      status: dto.status,
      orderId: transaction.orderId,
    };
  }

  private isSandboxEnabled(): boolean {
    const sandbox = this.configService.get<string>('PAYMENT_SANDBOX_MODE');
    if (sandbox === undefined) {
      const env = this.configService.get<string>('NODE_ENV');
      return env !== 'production';
    }
    return ['true', '1', 'yes', 'on'].includes(sandbox.toLowerCase());
  }

  private assertValidCallbackChecksum(
    dto: ProviderCallbackDto,
    provider: string,
  ) {
    const secret = this.configService.getOrThrow<string>('PAYMENT_CALLBACK_SECRET');
    const normalizedChecksum = dto.checksum.trim().toLowerCase();
    const expectedChecksum = createHmac('sha256', secret)
      .update([dto.orderId, dto.transactionId, provider, dto.status, dto.providerRef ?? ''].join(':'))
      .digest('hex');

    const provided = Buffer.from(normalizedChecksum, 'utf8');
    const expected = Buffer.from(expectedChecksum, 'utf8');

    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      throw new BadRequestException('Invalid callback checksum');
    }
  }
}
