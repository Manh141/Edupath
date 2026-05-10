import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { SetReviewVisibilityDto } from './dto/set-visibility.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Course Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('reviews/courses/:courseId')
  @ApiOperation({ summary: 'List visible reviews for a course' })
  list(@Param('courseId') courseId: string, @Query() dto: ListReviewsDto) {
    return this.reviewsService.listForCourse(courseId, dto);
  }

  @Public()
  @Get('reviews/courses/:courseId/aggregate')
  @ApiOperation({ summary: 'Average rating and rating distribution for a course' })
  aggregate(@Param('courseId') courseId: string) {
    return this.reviewsService.getAggregate(courseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Get('reviews/courses/:courseId/me')
  @ApiOperation({ summary: 'Get my own review for a course (if any)' })
  getMine(
    @CurrentUser() currentUser: JwtPayload,
    @Param('courseId') courseId: string,
  ) {
    return this.reviewsService.getMyReview(currentUser, courseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Put('reviews/courses/:courseId/me')
  @ApiOperation({
    summary: 'Create or update my review (1 review per student per course, updates allowed)',
  })
  upsert(
    @Param('courseId') courseId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpsertReviewDto,
  ) {
    return this.reviewsService.upsert(currentUser, courseId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Delete('reviews/courses/:courseId/me')
  @ApiOperation({ summary: 'Soft-delete my review' })
  deleteMine(
    @CurrentUser() currentUser: JwtPayload,
    @Param('courseId') courseId: string,
  ) {
    return this.reviewsService.deleteMine(currentUser, courseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Patch('admin/communication/reviews/:reviewId/visibility')
  @ApiOperation({ summary: 'Admin: hide or show a review' })
  setVisibility(
    @CurrentUser() currentUser: JwtPayload,
    @Param('reviewId') reviewId: string,
    @Body() dto: SetReviewVisibilityDto,
  ) {
    return this.reviewsService.setVisibility(currentUser, reviewId, dto);
  }
}
