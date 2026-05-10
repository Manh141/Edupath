import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AcceptPromotionalDto } from './dto/accept-promotional.dto';
import { AcceptTermsDto } from './dto/accept-terms.dto';
import { ConnectPayoutAccountDto } from './dto/connect-payout.dto';
import { UpdateMonetizationProfileDto } from './dto/update-profile.dto';
import { EligibilityService } from './eligibility.service';
import { MonetizationService } from './monetization.service';
import { PayoutAccountService } from './payout-account.service';

@ApiTags('Instructor Monetization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor/monetization')
export class MonetizationController {
  constructor(
    private readonly monetization: MonetizationService,
    private readonly eligibility: EligibilityService,
    private readonly payouts: PayoutAccountService,
  ) {}

  @ApiOperation({ summary: 'Get or create the seller profile with onboarding state.' })
  @Get('profile')
  async getProfile(@CurrentUser() user: CurrentUserInterface) {
    const profile = await this.monetization.getOrCreateProfile(user.sub);
    return {
      ...profile,
      payoutAccounts: profile.payoutAccounts.map(PayoutAccountService.toPublic),
    };
  }

  @ApiOperation({ summary: 'Update basic seller profile (legal name, bio, avatar, ...).' })
  @Put('profile')
  updateProfile(
    @CurrentUser() user: CurrentUserInterface,
    @Body() dto: UpdateMonetizationProfileDto,
  ) {
    return this.monetization.updateProfile(user.sub, dto);
  }

  @ApiOperation({ summary: 'Current seller eligibility snapshot for the instructor.' })
  @Get('eligibility')
  getEligibility(@CurrentUser() user: CurrentUserInterface) {
    return this.eligibility.getForInstructor(user.sub);
  }

  @ApiOperation({ summary: 'Accept monetization terms (records signed version).' })
  @Post('terms')
  acceptTerms(@CurrentUser() user: CurrentUserInterface, @Body() dto: AcceptTermsDto) {
    return this.monetization.acceptTerms(user.sub, dto);
  }

  @ApiOperation({ summary: 'Record promotional program decision (opt-in/out).' })
  @Post('promotional')
  acceptPromotional(
    @CurrentUser() user: CurrentUserInterface,
    @Body() dto: AcceptPromotionalDto,
  ) {
    return this.monetization.acceptPromotional(user.sub, dto);
  }

  @ApiOperation({ summary: 'List payout accounts (masked).' })
  @Get('payout-accounts')
  async listPayout(@CurrentUser() user: CurrentUserInterface) {
    const rows = await this.payouts.list(user.sub);
    return rows.map(PayoutAccountService.toPublic);
  }

  @ApiOperation({ summary: 'Connect a new payout account (goes to pending_review).' })
  @Post('payout-accounts')
  async connectPayout(
    @CurrentUser() user: CurrentUserInterface,
    @Body() dto: ConnectPayoutAccountDto,
  ) {
    const account = await this.payouts.connect(user.sub, dto);
    return PayoutAccountService.toPublic(account);
  }

  @ApiOperation({ summary: 'Mark an active payout account as default.' })
  @Post('payout-accounts/:id/default')
  setDefault(
    @CurrentUser() user: CurrentUserInterface,
    @Param('id') id: string,
  ) {
    return this.payouts.setDefault(user.sub, id);
  }

  @ApiOperation({ summary: 'Remove a non-default payout account.' })
  @Delete('payout-accounts/:id')
  removePayout(
    @CurrentUser() user: CurrentUserInterface,
    @Param('id') id: string,
  ) {
    return this.payouts.remove(user.sub, id);
  }
}
