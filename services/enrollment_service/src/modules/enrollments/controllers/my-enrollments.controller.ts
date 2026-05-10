import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
import { RequireRoles } from '../../../common/decorators/roles.decorator';
import { Roles } from '../../../common/constants/roles.constant';
import { QueryMyEnrollmentsDto } from '../dto/query-my-enrollments.dto';
import { UpdateLectureProgressDto } from '../dto/update-lecture-progress.dto';
import { EnrollmentsService } from '../services/enrollments.service';

@ApiTags('My Enrollments')
@ApiBearerAuth()
@RequireRoles(Roles.STUDENT, Roles.ADMIN)
@Controller('my/enrollments')
export class MyEnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  listMine(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryMyEnrollmentsDto) {
    return this.enrollmentsService.listMyEnrollments(user!.sub, query);
  }

  @Get('status/:courseId')
  getStatusByCourseId(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.getEnrollmentStatusByCourseId(user!.sub, courseId);
  }

  @Get(':courseId')
  getMineByCourseId(@CurrentUser() user: AuthenticatedUser, @Param('courseId') courseId: string) {
    return this.enrollmentsService.getMyEnrollmentByCourseId(user!.sub, courseId);
  }

  @Patch('progress')
  updateProgress(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateLectureProgressDto) {
    return this.enrollmentsService.updateLectureProgress(user!.sub, dto);
  }
}
