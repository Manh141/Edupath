import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PAYMENT_QUEUE } from '../../common/constants/payment.constants';
import { PaymentFulfillmentService } from './payment-fulfillment.service';

@Processor(PAYMENT_QUEUE)
export class PaymentEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentEventsProcessor.name);

  constructor(private readonly paymentFulfillmentService: PaymentFulfillmentService) {
    super();
  }

  async process(job: Job<{ orderId: string }>) {
    this.logger.log(`Processing job ${job.name} for order ${job.data.orderId}`);

    switch (job.name) {
      case 'order.created':
        return { acknowledged: true };
      case 'payment.succeeded':
        return this.paymentFulfillmentService.fulfillPayment(job.data.orderId);
      case 'payment.refunded':
        return this.paymentFulfillmentService.revokePayment(job.data.orderId);
      default:
        return { skipped: true };
    }
  }
}
