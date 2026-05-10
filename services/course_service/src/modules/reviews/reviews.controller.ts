import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ReviewsService } from './reviews.service';
import { SetReviewVisibilityDto } from './dto/set-review-visibility.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('courses/:courseId/reviews')
  listReviews(@Param('courseId') courseId: string) {
    return this.reviewsService.listVisibleReviews(courseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('courses/:courseId/reviews/me')
  upsertReview(
    @Param('courseId') courseId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpsertReviewDto,
  ) {
    return this.reviewsService.upsertReview(courseId, currentUser, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Patch('admin/reviews/:reviewId/visibility')
  setVisibility(
    @Param('reviewId') reviewId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: SetReviewVisibilityDto,
  ) {
    return this.reviewsService.setVisibility(reviewId, currentUser, dto);
  }
}
