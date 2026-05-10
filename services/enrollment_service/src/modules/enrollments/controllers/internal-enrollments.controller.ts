import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../../common/guards/internal-service.guard';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { SyncEnrollmentStatusDto } from '../dto/sync-enrollment-status.dto';
import { EnrollmentsService } from '../services/enrollments.service';

@ApiTags('Internal Enrollments')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/enrollments')
export class InternalEnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'Create an enrollment from a trusted internal service' })
  @Post()
  createEnrollment(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.createEnrollment(dto);
  }

  @ApiOperation({ summary: 'Get enrollment analytics for course ids' })
  @Post('analytics/course-enrollments')
  getCourseEnrollmentAnalytics(@Body() body: { courseIds?: string[]; days?: number }) {
    return this.enrollmentsService.getCourseEnrollmentAnalytics(
      Array.isArray(body.courseIds) ? body.courseIds : [],
      body.days,
    );
  }

  @ApiOperation({ summary: 'Synchronize enrollment status from a trusted internal service' })
  @Post('status')
  syncStatus(@Body() dto: SyncEnrollmentStatusDto) {
    return this.enrollmentsService.syncEnrollmentStatus(dto);
  }

  @ApiOperation({ summary: 'Find enrollment by user and course for internal services' })
  @Get(':userId/course/:courseId')
  findByUserAndCourse(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.enrollmentsService.findByUserAndCourse(userId, courseId);
  }

  @ApiOperation({ summary: 'List enrollments for a course (internal: instructor performance)' })
  @Get('by-course/:courseId')
  listByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.listEnrollmentsForCourse(courseId);
  }
}
