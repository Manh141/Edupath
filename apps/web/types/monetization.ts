export type CoursePricingTier =
  | "free"
  | "tier_99k"
  | "tier_199k"
  | "tier_299k"
  | "tier_499k"
  | "tier_799k"
  | "tier_1299k"
  | "tier_1999k"
  | "custom";

export interface CoursePricingConfig {
  id: string;
  courseId: string;
  tier: CoursePricingTier;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  updatedAt: string;
}

export type MonetizationStatus =
  | "not_started"
  | "in_progress"
  | "pending_payout"
  | "active"
  | "suspended";

export type InstructorIdentityStatus =
  | "not_started"
  | "pending"
  | "verified"
  | "rejected";

export type OnboardingStepKey =
  | "public_profile"
  | "terms"
  | "promotional"
  | "payout";

export type OnboardingStepStatus = "pending" | "completed" | "skipped";

export interface OnboardingStepState {
  stepKey: OnboardingStepKey;
  status: OnboardingStepStatus;
  completedAt: string | null;
}

export type PayoutAccountProvider =
  | "bank_transfer_vn"
  | "paypal"
  | "stripe_connect";

export type PayoutAccountStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "rejected"
  | "disabled";

export interface PayoutAccountPublic {
  id: string;
  provider: PayoutAccountProvider;
  status: PayoutAccountStatus;
  displayName: string;
  accountRefMasked: string | null;
  bankCode: string | null;
  country: string;
  currency: string;
  isDefault: boolean;
  submittedAt: string | null;
  activatedAt: string | null;
  rejectedReason: string | null;
}

export interface MonetizationProfile {
  id: string;
  instructorId: string;
  legalName: string | null;
  companyName: string | null;
  publicHeadline: string | null;
  shortBio: string | null;
  profileImageUrl: string | null;
  acceptedTermsVersion: string | null;
  acceptedTermsAt: string | null;
  acceptedPromotional: boolean;
  acceptedPromotionalAt: string | null;
  status: MonetizationStatus;
  identityStatus: InstructorIdentityStatus;
  taxFormStatus: string;
  onboardingSteps: OnboardingStepState[];
  payoutAccounts: PayoutAccountPublic[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerEligibility {
  instructorId: string;
  status: MonetizationStatus;
  canSellPaid: boolean;
  reasons: string[];
  identityStatus: InstructorIdentityStatus;
  onboarding: OnboardingStepState[];
  hasActivePayout: boolean;
  onboardingUrl: string;
  identityFlowUrl: string;
  updatedAt: string;
}

export interface CoursePricingPage {
  courseId: string;
  currentStatus: string;
  pricing: CoursePricingConfig | null;
  eligibility: SellerEligibility | null;
  editingLocked: boolean;
  canSetPrice?: boolean;
  canSetPaidPrice: boolean;
}

export interface UpdateCoursePricingInput {
  tier: CoursePricingTier;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
}

export interface UpdateMonetizationProfileInput {
  legalName?: string;
  companyName?: string;
  publicHeadline?: string;
  shortBio?: string;
  profileImageUrl?: string;
}

export interface ConnectPayoutAccountInput {
  provider: PayoutAccountProvider;
  displayName: string;
  holderName: string;
  accountRef: string;
  bankCode?: string;
  country?: string;
  currency?: string;
}
