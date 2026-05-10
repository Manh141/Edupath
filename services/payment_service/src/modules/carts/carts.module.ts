import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CouponsModule } from '../coupons/coupons.module';
import { CourseCatalogService } from './course-catalog.service';

@Module({
  imports: [CouponsModule],
  controllers: [CartsController],
  providers: [CartsService, CourseCatalogService],
  exports: [CartsService, CourseCatalogService],
})
export class CartsModule {}
