import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { InstructorPerformanceController } from './instructor-performance.controller';
import { InstructorPerformanceService } from './instructor-performance.service';

@Module({
  imports: [ExternalModule, ReviewsModule],
  controllers: [InstructorPerformanceController],
  providers: [InstructorPerformanceService],
})
export class InstructorModule {}
