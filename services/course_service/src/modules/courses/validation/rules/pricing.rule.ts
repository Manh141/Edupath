import type { ChecklistItem } from '../checklist.types';
import type { CourseValidationInput, ValidationRule } from './types';

const REASON_HINTS: Record<string, string> = {
  PUBLIC_PROFILE_INCOMPLETE: 'Complete your public instructor profile.',
  TERMS_NOT_ACCEPTED: 'Accept the EduPath instructor terms.',
  PROMOTIONAL_NOT_DECIDED: 'Choose whether to join the promotional program.',
  PAYOUT_NOT_ACTIVE: 'Add a bank or e-banking payout account for commissions.',
  MONETIZATION_SUSPENDED: 'Your monetization profile is suspended.',
  MONETIZATION_SERVICE_UNCONFIGURED: 'Monetization service is not configured.',
  MONETIZATION_SERVICE_UNREACHABLE: 'Monetization service is not reachable.',
  MONETIZATION_SERVICE_ERROR: 'Monetization service returned an error.',
};

export const pricingRule: ValidationRule = (input: CourseValidationInput): ChecklistItem[] => {
  const sellerReady = Boolean(
    input.sellerEligibility?.resolved && input.sellerEligibility.canSellPaid,
  );
  const reasons =
    input.sellerEligibility?.reasons
      ?.map((reason) => REASON_HINTS[reason] ?? reason)
      .filter(Boolean) ?? [];

  return [
    {
      group: 'pricing',
      code: 'PRICING_ONBOARDING_COMPLETE',
      label: 'Pre-instructor registration completed',
      severity: 'error',
      passed: sellerReady,
      hint: sellerReady
        ? undefined
        : reasons.length > 0
          ? reasons.join(' ')
          : 'Open Pricing and complete seller onboarding.',
    },
    {
      group: 'pricing',
      code: 'PRICING_CONFIGURED',
      label: 'Course pricing saved',
      severity: 'error',
      passed: Boolean(input.pricing),
      hint: input.pricing ? undefined : 'Open Pricing and save a course tier.',
    },
  ];
};
