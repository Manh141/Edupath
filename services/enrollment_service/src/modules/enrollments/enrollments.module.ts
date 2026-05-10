import { Module } from '@nestjs/common';

import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { AdminEnrollmentsController } from './controllers/admin-enrollments.controller';
import { InternalEnrollmentsController } from './controllers/internal-enrollments.controller';
import { MyEnrollmentsController } from './controllers/my-enrollments.controller';
import { MyWishlistController } from './controllers/my-wishlist.controller';
import { EnrollmentsService } from './services/enrollments.service';
import { WishlistService } from './services/wishlist.service';
import { ProgressService } from './services/progress.service';
import { CertificatesService } from './services/certificates.service';
import { CourseProgressSourceService } from './services/course-progress-source.service';

@Module({
  controllers: [
    AdminEnrollmentsController,
    InternalEnrollmentsController,
    MyEnrollmentsController,
    MyWishlistController,
  ],
  providers: [
    EnrollmentsService,
    WishlistService,
    ProgressService,
    CertificatesService,
    CourseProgressSourceService,
    InternalServiceGuard,
  ],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
