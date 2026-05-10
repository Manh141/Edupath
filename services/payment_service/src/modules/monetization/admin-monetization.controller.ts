import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PayoutAccountStatus } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdminReviewPayoutDto } from './dto/admin-review-payout.dto';
import { PayoutAccountService } from './payout-account.service';

@ApiTags('Admin Monetization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller('admin/monetization')
export class AdminMonetizationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payouts: PayoutAccountService,
  ) {}

  @ApiOperation({ summary: 'List payout accounts pending review (admin queue).' })
  @Get('payout-accounts')
  async listPending(
    @Query('status') status?: PayoutAccountStatus,
  ) {
    const rows = await this.prisma.payoutAccount.findMany({
      where: { status: status ?? PayoutAccountStatus.pending_review },
      orderBy: { submittedAt: 'asc' },
      include: { profile: { select: { instructorId: true, legalName: true } } },
    });
    return rows.map((row) => ({
      ...PayoutAccountService.toPublic(row),
      instructorId: row.profile.instructorId,
      legalName: row.profile.legalName,
    }));
  }

  @ApiOperation({ summary: 'Approve or reject a payout account submission.' })
  @Post('payout-accounts/:id/review')
  review(
    @CurrentUser() user: CurrentUserInterface,
    @Param('id') id: string,
    @Body() dto: AdminReviewPayoutDto,
  ) {
    return this.payouts.adminReview(id, user.sub, dto);
  }
}
