import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CoursesService } from './courses.service';
import { CourseReviewSubmissionService } from './moderation/course-review-submission.service';
import { CourseStatusHistoryService } from './moderation/course-status-history.service';
import { QueryAdminCoursesDto } from './dto/query-admin-courses.dto';
import { QueryReviewSubmissionsDto } from './dto/query-review-submissions.dto';
import { RejectCourseDto } from './dto/reject-course.dto';
import { RequestChangesDto } from './dto/request-changes.dto';

@ApiTags('Admin Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller('admin/courses')
export class AdminCoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly reviewSubmissionService: CourseReviewSubmissionService,
    private readonly statusHistory: CourseStatusHistoryService,
  ) {}

  @Get()
  list(@Query() query: QueryAdminCoursesDto) {
    return this.coursesService.listAdminCourses(query);
  }

  @Get('stats')
  stats() {
    return this.coursesService.getAdminCourseStats();
  }

  @Get('review-submissions')
  reviewSubmissions(@Query() query: QueryReviewSubmissionsDto) {
    return this.reviewSubmissionService.listForAdmin(query);
  }

  @Get(':id')
  getCourse(@Param('id') id: string) {
    return this.coursesService.getAdminCourseById(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.approveCourse(id, currentUser);
  }

  @Post(':id/approve-and-publish')
  approveAndPublish(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.approveAndPublishCourse(id, currentUser);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectCourseDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.coursesService.rejectCourse(id, currentUser, dto);
  }

  @Post(':id/request-changes')
  requestChanges(
    @Param('id') id: string,
    @Body() dto: RequestChangesDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.coursesService.requestChanges(id, currentUser, dto.reason);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.publishCourse(id, currentUser);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.archiveCourse(id, currentUser);
  }

  @Get(':id/review-submissions')
  courseReviewSubmissions(@Param('id') id: string) {
    return this.reviewSubmissionService.listCourseSubmissionsForAdmin(id);
  }

  @Get(':id/status-history')
  history(@Param('id') id: string) {
    return this.statusHistory.listForCourse(id);
  }
}
