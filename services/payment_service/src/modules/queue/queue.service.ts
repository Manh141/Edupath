import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PAYMENT_QUEUE } from '../../common/constants/payment.constants';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(PAYMENT_QUEUE) private readonly queue: Queue) {}

  enqueueOrderCreated(orderId: string) {
    return this.queue.add(
      'order.created',
      { orderId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    );
  }

  enqueuePaymentSucceeded(orderId: string) {
    return this.queue.add(
      'payment.succeeded',
      { orderId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    );
  }

  enqueuePaymentRefunded(orderId: string) {
    return this.queue.add(
      'payment.refunded',
      { orderId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    );
  }
}
