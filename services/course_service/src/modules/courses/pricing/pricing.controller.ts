import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/roles.constant';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { UpdateCoursePricingDto } from './dto/update-course-pricing.dto';
import { PricingService } from './pricing.service';

@ApiTags('Instructor Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor/courses/:id/pricing')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Get()
  @ApiOperation({ summary: 'Get pricing config + seller onboarding eligibility for the course' })
  getPricing(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.pricing.getPricingPage(id, user);
  }

  @Put()
  @ApiOperation({ summary: 'Update course pricing tier / price / currency' })
  upsert(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCoursePricingDto,
  ) {
    return this.pricing.upsertPricing(id, user, dto);
  }
}
