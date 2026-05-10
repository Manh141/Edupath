import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE } from '../../common/constants/payment.constants';
import { CartsModule } from '../carts/carts.module';
import { QueueService } from './queue.service';
import { PaymentEventsProcessor } from './payment-events.processor';
import { PaymentFulfillmentService } from './payment-fulfillment.service';
import { EnrollmentServiceClient } from './enrollment-service.client';

@Module({
  imports: [BullModule.registerQueue({ name: PAYMENT_QUEUE }), CartsModule],
  providers: [QueueService, PaymentEventsProcessor, PaymentFulfillmentService, EnrollmentServiceClient],
  exports: [QueueService],
})
export class QueueModule {}
