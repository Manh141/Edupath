import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  OnboardingStepStatus,
  PayoutAccount,
  PayoutAccountStatus,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { encryptPII, maskAccountRef } from '../../common/crypto/pii-crypto.util';
import { AdminReviewPayoutDto } from './dto/admin-review-payout.dto';
import { ConnectPayoutAccountDto } from './dto/connect-payout.dto';
import { MonetizationService } from './monetization.service';

@Injectable()
export class PayoutAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly monetization: MonetizationService,
  ) {}

  async list(instructorId: string) {
    const profile = await this.monetization.getOrCreateProfile(instructorId);
    return this.prisma.payoutAccount.findMany({
      where: { profileId: profile.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async connect(instructorId: string, dto: ConnectPayoutAccountDto): Promise<PayoutAccount> {
    const profile = await this.monetization.getOrCreateProfile(instructorId);

    const holderNameCipher = encryptPII(dto.holderName);
    const accountRefCipher = encryptPII(dto.accountRef);
    const accountRefMasked = maskAccountRef(dto.accountRef);

    const account = await this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.payoutAccount.count({
        where: { profileId: profile.id, status: { not: PayoutAccountStatus.rejected } },
      });

      const created = await tx.payoutAccount.create({
        data: {
          profileId: profile.id,
          provider: dto.provider,
          status: PayoutAccountStatus.pending_review,
          displayName: dto.displayName,
          holderNameCipher,
          accountRefCipher,
          accountRefMasked,
          bankCode: dto.bankCode,
          country: dto.country ?? 'VN',
          currency: dto.currency ?? 'VND',
          submittedAt: new Date(),
          isDefault: existingCount === 0,
        },
      });

      await tx.onboardingStepProgress.upsert({
        where: { profileId_stepKey: { profileId: profile.id, stepKey: 'payout' } },
        create: {
          profileId: profile.id,
          stepKey: 'payout',
          status: OnboardingStepStatus.completed,
          completedAt: new Date(),
        },
        update: {
          status: OnboardingStepStatus.completed,
          completedAt: new Date(),
        },
      });

      return created;
    });

    await this.monetization.recomputeEligibility(instructorId);
    return account;
  }

  async adminReview(payoutAccountId: string, _adminId: string, dto: AdminReviewPayoutDto) {
    const account = await this.prisma.payoutAccount.findUnique({
      where: { id: payoutAccountId },
      include: { profile: true },
    });
    if (!account) throw new NotFoundException('Payout account not found.');

    if (
      account.status !== PayoutAccountStatus.pending_review &&
      account.status !== PayoutAccountStatus.draft
    ) {
      throw new BadRequestException('Account is not reviewable in the current state.');
    }

    const isApprove = dto.decision === 'approve';
    const nextStatus = isApprove ? PayoutAccountStatus.active : PayoutAccountStatus.rejected;

    await this.prisma.$transaction(async (tx) => {
      await tx.payoutAccount.update({
        where: { id: account.id },
        data: {
          status: nextStatus,
          activatedAt: isApprove ? new Date() : null,
          rejectedReason: isApprove ? null : (dto.reason ?? 'Rejected by reviewer.'),
        },
      });

      if (isApprove) {
        // First approved account becomes default if none set.
        const hasDefault = await tx.payoutAccount.count({
          where: { profileId: account.profileId, isDefault: true, id: { not: account.id } },
        });
        if (hasDefault === 0) {
          await tx.payoutAccount.update({
            where: { id: account.id },
            data: { isDefault: true },
          });
        }

        await tx.onboardingStepProgress.upsert({
          where: { profileId_stepKey: { profileId: account.profileId, stepKey: 'payout' } },
          create: {
            profileId: account.profileId,
            stepKey: 'payout',
            status: OnboardingStepStatus.completed,
            completedAt: new Date(),
          },
          update: {
            status: OnboardingStepStatus.completed,
            completedAt: new Date(),
          },
        });
      }
    });

    return this.monetization.recomputeEligibility(account.profile.instructorId);
  }

  async setDefault(instructorId: string, payoutAccountId: string) {
    const profile = await this.monetization.getOrCreateProfile(instructorId);
    const account = await this.prisma.payoutAccount.findFirst({
      where: { id: payoutAccountId, profileId: profile.id },
    });
    if (!account) throw new NotFoundException('Payout account not found.');
    if (account.status !== PayoutAccountStatus.active) {
      throw new BadRequestException('Only active accounts can be set as default.');
    }

    await this.prisma.$transaction([
      this.prisma.payoutAccount.updateMany({
        where: { profileId: profile.id, isDefault: true },
        data: { isDefault: false },
      }),
      this.prisma.payoutAccount.update({
        where: { id: account.id },
        data: { isDefault: true },
      }),
    ]);

    return { ok: true };
  }

  async remove(instructorId: string, payoutAccountId: string) {
    const profile = await this.monetization.getOrCreateProfile(instructorId);
    const account = await this.prisma.payoutAccount.findFirst({
      where: { id: payoutAccountId, profileId: profile.id },
    });
    if (!account) throw new NotFoundException('Payout account not found.');
    if (account.status === PayoutAccountStatus.active && account.isDefault) {
      throw new BadRequestException(
        'Cannot delete the default active account. Connect another account first.',
      );
    }

    await this.prisma.payoutAccount.delete({ where: { id: account.id } });
    return this.monetization.recomputeEligibility(instructorId);
  }

  // Lightweight projection suitable for JSON responses — never returns ciphertext.
  static toPublic(account: PayoutAccount) {
    return {
      id: account.id,
      provider: account.provider,
      status: account.status,
      displayName: account.displayName,
      accountRefMasked: account.accountRefMasked,
      bankCode: account.bankCode,
      country: account.country,
      currency: account.currency,
      isDefault: account.isDefault,
      submittedAt: account.submittedAt,
      activatedAt: account.activatedAt,
      rejectedReason: account.rejectedReason,
    } satisfies Record<string, unknown>;
  }
}
