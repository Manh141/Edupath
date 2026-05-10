import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  InstructorMonetizationProfile,
  MonetizationStatus,
  OnboardingStepProgress,
  OnboardingStepStatus,
  PayoutAccount,
  PayoutAccountStatus,
  Prisma,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AcceptPromotionalDto } from './dto/accept-promotional.dto';
import { AcceptTermsDto } from './dto/accept-terms.dto';
import { UpdateMonetizationProfileDto } from './dto/update-profile.dto';

export const ONBOARDING_STEP_KEYS = ['public_profile', 'terms', 'promotional', 'payout'] as const;
export type OnboardingStepKey = (typeof ONBOARDING_STEP_KEYS)[number];

type ProfileWithRelations = InstructorMonetizationProfile & {
  onboardingSteps: OnboardingStepProgress[];
  payoutAccounts: PayoutAccount[];
};

@Injectable()
export class MonetizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateProfile(instructorId: string): Promise<ProfileWithRelations> {
    const existing = await this.prisma.instructorMonetizationProfile.findUnique({
      where: { instructorId },
      include: { onboardingSteps: true, payoutAccounts: true },
    });
    if (existing) return existing;

    return this.prisma.instructorMonetizationProfile.create({
      data: {
        instructorId,
        status: MonetizationStatus.not_started,
        onboardingSteps: {
          create: ONBOARDING_STEP_KEYS.map((key) => ({ stepKey: key })),
        },
      },
      include: { onboardingSteps: true, payoutAccounts: true },
    });
  }

  async updateProfile(instructorId: string, dto: UpdateMonetizationProfileDto) {
    const profile = await this.getOrCreateProfile(instructorId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const p = await tx.instructorMonetizationProfile.update({
        where: { id: profile.id },
        data: {
          legalName: dto.legalName ?? profile.legalName,
          companyName: dto.companyName ?? profile.companyName,
          publicHeadline: dto.publicHeadline ?? profile.publicHeadline,
          shortBio: dto.shortBio ?? profile.shortBio,
          profileImageUrl: dto.profileImageUrl ?? profile.profileImageUrl,
          status:
            profile.status === MonetizationStatus.not_started
              ? MonetizationStatus.in_progress
              : profile.status,
        },
      });

      const hasPublicBasics = Boolean(
        (dto.legalName ?? profile.legalName) && (dto.publicHeadline ?? profile.publicHeadline),
      );
      if (hasPublicBasics) {
        await this.completeStep(tx, profile.id, 'public_profile');
      }
      return p;
    });

    await this.recomputeEligibility(instructorId);
    return updated;
  }

  async acceptTerms(instructorId: string, dto: AcceptTermsDto) {
    if (!dto.accepted) {
      throw new BadRequestException('Terms must be accepted to continue.');
    }
    const profile = await this.getOrCreateProfile(instructorId);

    await this.prisma.$transaction(async (tx) => {
      await tx.instructorMonetizationProfile.update({
        where: { id: profile.id },
        data: {
          acceptedTermsVersion: dto.termsVersion,
          acceptedTermsAt: new Date(),
        },
      });
      await this.completeStep(tx, profile.id, 'terms');
    });

    return this.recomputeEligibility(instructorId);
  }

  async acceptPromotional(instructorId: string, dto: AcceptPromotionalDto) {
    const profile = await this.getOrCreateProfile(instructorId);

    await this.prisma.$transaction(async (tx) => {
      await tx.instructorMonetizationProfile.update({
        where: { id: profile.id },
        data: {
          acceptedPromotional: dto.participate,
          acceptedPromotionalAt: new Date(),
        },
      });
      await this.completeStep(tx, profile.id, 'promotional');
    });

    return this.recomputeEligibility(instructorId);
  }

  async recomputeEligibility(instructorId: string) {
    const profile = await this.prisma.instructorMonetizationProfile.findUnique({
      where: { instructorId },
      include: { onboardingSteps: true, payoutAccounts: true },
    });
    if (!profile) throw new NotFoundException('Monetization profile not found.');

    const stepDone = (key: OnboardingStepKey) =>
      profile.onboardingSteps.find((s) => s.stepKey === key)?.status ===
      OnboardingStepStatus.completed;

    const hasSubmittedPayout = profile.payoutAccounts.some(
      (p) =>
        p.status === PayoutAccountStatus.pending_review || p.status === PayoutAccountStatus.active,
    );

    const reasons: string[] = [];
    if (!stepDone('public_profile')) reasons.push('PUBLIC_PROFILE_INCOMPLETE');
    if (!stepDone('terms')) reasons.push('TERMS_NOT_ACCEPTED');
    if (!stepDone('promotional')) reasons.push('PROMOTIONAL_NOT_DECIDED');
    if (!hasSubmittedPayout) reasons.push('PAYOUT_NOT_ACTIVE');
    if (profile.status === MonetizationStatus.suspended) reasons.push('MONETIZATION_SUSPENDED');

    const canSellPaid = reasons.length === 0;

    const nextStatus: MonetizationStatus = canSellPaid
      ? MonetizationStatus.active
      : profile.status === MonetizationStatus.suspended
        ? MonetizationStatus.suspended
        : hasSubmittedPayout
          ? MonetizationStatus.pending_payout
          : profile.status === MonetizationStatus.not_started
            ? MonetizationStatus.in_progress
            : profile.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.instructorMonetizationProfile.update({
        where: { id: profile.id },
        data: { status: nextStatus },
      });
      await tx.sellerEligibilitySnapshot.create({
        data: {
          profileId: profile.id,
          canSellPaid,
          reasons: reasons as unknown as Prisma.InputJsonValue,
        },
      });
      return { ...updated, canSellPaid, reasons };
    });
  }

  private async completeStep(
    tx: Prisma.TransactionClient,
    profileId: string,
    stepKey: OnboardingStepKey,
  ) {
    await tx.onboardingStepProgress.upsert({
      where: { profileId_stepKey: { profileId, stepKey } },
      create: {
        profileId,
        stepKey,
        status: OnboardingStepStatus.completed,
        completedAt: new Date(),
      },
      update: {
        status: OnboardingStepStatus.completed,
        completedAt: new Date(),
      },
    });
  }
}
