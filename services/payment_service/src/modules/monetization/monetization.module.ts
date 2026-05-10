import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { AdminMonetizationController } from './admin-monetization.controller';
import { EligibilityService } from './eligibility.service';
import { InternalMonetizationController } from './internal-monetization.controller';
import { MonetizationController } from './monetization.controller';
import { MonetizationService } from './monetization.service';
import { PayoutAccountService } from './payout-account.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    MonetizationController,
    AdminMonetizationController,
    InternalMonetizationController,
  ],
  providers: [MonetizationService, PayoutAccountService, EligibilityService, InternalServiceGuard],
  exports: [MonetizationService, EligibilityService, PayoutAccountService],
})
export class MonetizationModule {}
