import { Module } from '@nestjs/common';
import { CourseClient } from './course.client';
import { EnrollmentClient } from './enrollment.client';
import { UserClient } from './user.client';

@Module({
  providers: [CourseClient, EnrollmentClient, UserClient],
  exports: [CourseClient, EnrollmentClient, UserClient],
})
export class ExternalModule {}
