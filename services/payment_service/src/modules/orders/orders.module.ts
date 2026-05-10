import { Module } from '@nestjs/common';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartsModule } from '../carts/carts.module';
import { CouponsModule } from '../coupons/coupons.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [CartsModule, CouponsModule, QueueModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
