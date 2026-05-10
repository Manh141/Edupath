import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ListReviewsDto } from '../reviews/dto/list-reviews.dto';
import { ListStudentsDto } from './dto/list-students.dto';
import { InstructorPerformanceService } from './instructor-performance.service';

@ApiTags('Instructor Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor/performance')
export class InstructorPerformanceController {
  constructor(private readonly service: InstructorPerformanceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Performance overview: totals, rating distribution, top courses' })
  overview(@CurrentUser() currentUser: JwtPayload) {
    return this.service.getOverview(currentUser);
  }

  @Get('courses')
  @ApiOperation({ summary: 'List my courses (used as the dropdown filter source)' })
  myCourses(@CurrentUser() currentUser: JwtPayload) {
    return this.service.listMyCourses(currentUser);
  }

  @Get('students')
  @ApiOperation({ summary: 'List students enrolled in my courses (filter by course optional)' })
  students(@CurrentUser() currentUser: JwtPayload, @Query() dto: ListStudentsDto) {
    return this.service.listStudents(currentUser, dto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'List reviews for my courses (filter by courseId optional)' })
  reviews(
    @CurrentUser() currentUser: JwtPayload,
    @Query() dto: ListReviewsDto,
  ) {
    return this.service.listReviews(
      currentUser,
      {
        page: dto.page,
        limit: dto.limit,
        rating: dto.rating,
        search: dto.search,
        sort: dto.sort,
      },
      dto.courseId,
    );
  }

  @Get('rating-distribution')
  @ApiOperation({ summary: 'Average rating + 1-5 star distribution (filter by courseId optional)' })
  rating(
    @CurrentUser() currentUser: JwtPayload,
    @Query('courseId') courseId?: string,
  ) {
    return this.service.ratingDistribution(currentUser, courseId);
  }
}
