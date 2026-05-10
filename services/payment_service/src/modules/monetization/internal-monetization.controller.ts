import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { EligibilityService } from './eligibility.service';

@ApiTags('Internal Monetization')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/monetization')
export class InternalMonetizationController {
  constructor(private readonly eligibility: EligibilityService) {}

  @ApiOperation({ summary: 'Lookup seller eligibility for an instructor.' })
  @Get('eligibility/:instructorId')
  getEligibility(@Param('instructorId') instructorId: string) {
    return this.eligibility.getForInstructor(instructorId);
  }
}
