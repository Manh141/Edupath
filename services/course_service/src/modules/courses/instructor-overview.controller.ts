import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { InstructorAnalyticsService } from './instructor-analytics.service';

@ApiTags('Instructor Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor/overview')
export class InstructorOverviewController {
  constructor(private readonly analyticsService: InstructorAnalyticsService) {}

  @Get()
  getOverview(@CurrentUser() currentUser: JwtPayload, @Query('period') period?: string) {
    return this.analyticsService.getOverview(currentUser, period);
  }
}
