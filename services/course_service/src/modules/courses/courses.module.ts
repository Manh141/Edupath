import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { AdminCoursesController } from './admin-courses.controller';
import { CoursesService } from './courses.service';
import { InstructorAnalyticsService } from './instructor-analytics.service';
import { InstructorCoursesController } from './instructor-courses.controller';
import { InstructorOverviewController } from './instructor-overview.controller';
import { InternalCoursesController } from './internal-courses.controller';
import { PublicCoursesController } from './public-courses.controller';
import { CourseReviewSubmissionService } from './moderation/course-review-submission.service';
import { CourseStatusHistoryService } from './moderation/course-status-history.service';
import { CourseValidationService } from './validation/course-validation.service';
import { PricingController } from './pricing/pricing.controller';
import { PricingService } from './pricing/pricing.service';
import { PricingEligibilityClient } from './pricing/pricing.eligibility.client';

@Module({
  imports: [ConfigModule],
  controllers: [
    PublicCoursesController,
    InstructorCoursesController,
    InstructorOverviewController,
    AdminCoursesController,
    InternalCoursesController,
    PricingController,
  ],
  providers: [
    CoursesService,
    InstructorAnalyticsService,
    CourseValidationService,
    CourseStatusHistoryService,
    CourseReviewSubmissionService,
    PricingService,
    PricingEligibilityClient,
    InternalServiceGuard,
  ],
  exports: [
    CoursesService,
    InstructorAnalyticsService,
    CourseValidationService,
    CourseStatusHistoryService,
    CourseReviewSubmissionService,
    PricingService,
    PricingEligibilityClient,
  ],
})
export class CoursesModule {}
