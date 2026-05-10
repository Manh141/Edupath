import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InstructorIdentityStatus,
  MonetizationStatus,
  OnboardingStepStatus,
  PayoutAccountStatus,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ONBOARDING_STEP_KEYS, OnboardingStepKey } from './monetization.service';

export interface InstructorEligibilityResult {
  instructorId: string;
  status: MonetizationStatus;
  canSellPaid: boolean;
  reasons: string[];
  identityStatus: InstructorIdentityStatus;
  onboarding: Array<{
    stepKey: OnboardingStepKey;
    status: OnboardingStepStatus;
    completedAt: Date | null;
  }>;
  hasActivePayout: boolean;
  onboardingUrl: string;
  identityFlowUrl: string;
  updatedAt: Date;
}

@Injectable()
export class EligibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getForInstructor(instructorId: string): Promise<InstructorEligibilityResult> {
    const webOrigin = (this.config.get<string>('WEB_ORIGIN') ?? '').replace(/\/$/, '');
    const onboardingUrl = `${webOrigin}/instructor/monetization`;
    const identityFlowUrl = `${webOrigin}/instructor/identity`;

    const profile = await this.prisma.instructorMonetizationProfile.findUnique({
      where: { instructorId },
      include: {
        onboardingSteps: true,
        payoutAccounts: true,
        eligibilitySnapshots: { orderBy: { computedAt: 'desc' }, take: 1 },
      },
    });

    if (!profile) {
      return {
        instructorId,
        status: MonetizationStatus.not_started,
        canSellPaid: false,
        reasons: [
          'PUBLIC_PROFILE_INCOMPLETE',
          'TERMS_NOT_ACCEPTED',
          'PROMOTIONAL_NOT_DECIDED',
          'PAYOUT_NOT_ACTIVE',
        ],
        identityStatus: InstructorIdentityStatus.not_started,
        onboarding: ONBOARDING_STEP_KEYS.map((k) => ({
          stepKey: k,
          status: OnboardingStepStatus.pending,
          completedAt: null,
        })),
        hasActivePayout: false,
        onboardingUrl,
        identityFlowUrl,
        updatedAt: new Date(),
      };
    }

    const latestSnapshot = profile.eligibilitySnapshots[0];
    const hasActivePayout = profile.payoutAccounts.some(
      (p) => p.status === PayoutAccountStatus.active,
    );
    const hasSubmittedPayout = profile.payoutAccounts.some(
      (p) =>
        p.status === PayoutAccountStatus.pending_review || p.status === PayoutAccountStatus.active,
    );

    const onboarding = ONBOARDING_STEP_KEYS.map((k) => {
      const row = profile.onboardingSteps.find((s) => s.stepKey === k);
      return {
        stepKey: k,
        status: row?.status ?? OnboardingStepStatus.pending,
        completedAt: row?.completedAt ?? null,
      };
    });

    const reasons = Array.isArray(latestSnapshot?.reasons)
      ? (latestSnapshot!.reasons as unknown as string[])
      : this.computeFallbackReasons(onboarding, hasSubmittedPayout, profile.status);

    return {
      instructorId,
      status: profile.status,
      canSellPaid: latestSnapshot?.canSellPaid ?? reasons.length === 0,
      reasons,
      identityStatus: profile.identityStatus,
      onboarding,
      hasActivePayout,
      onboardingUrl,
      identityFlowUrl,
      updatedAt: latestSnapshot?.computedAt ?? profile.updatedAt,
    };
  }

  private computeFallbackReasons(
    onboarding: Array<{ stepKey: OnboardingStepKey; status: OnboardingStepStatus }>,
    hasSubmittedPayout: boolean,
    status: MonetizationStatus,
  ): string[] {
    const reasons: string[] = [];
    const done = (key: OnboardingStepKey) =>
      onboarding.find((s) => s.stepKey === key)?.status === OnboardingStepStatus.completed;
    if (!done('public_profile')) reasons.push('PUBLIC_PROFILE_INCOMPLETE');
    if (!done('terms')) reasons.push('TERMS_NOT_ACCEPTED');
    if (!done('promotional')) reasons.push('PROMOTIONAL_NOT_DECIDED');
    if (!hasSubmittedPayout) reasons.push('PAYOUT_NOT_ACTIVE');
    if (status === MonetizationStatus.suspended) reasons.push('MONETIZATION_SUSPENDED');
    return reasons;
  }
}
