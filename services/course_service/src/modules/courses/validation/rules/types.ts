import type { ChecklistItem } from '../checklist.types';

export type LectureLite = {
  id: string;
  type: 'video' | 'article' | 'resource';
  title: string;
  videoUrl: string;
  articleContent: string;
  durationSec: number;
  order: number;
  assets: { id: string }[];
};

export type SectionLite = {
  id: string;
  title: string;
  order: number;
  lectures: LectureLite[];
};

export type PricingLite = {
  tier: string;
  price: number;
  currency: string;
};

export type SellerEligibilityLite = {
  resolved: boolean;
  canSellPaid: boolean;
  reasons: string[];
  onboardingUrl?: string;
};

export type CourseValidationInput = {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  language: string;
  level: string;
  thumbnailUrl: string;
  trailerUrl: string;
  subcategoryId: string | null;
  categoryId: string | null;
  objectivesCount: number;
  requirementsCount: number;
  targetAudiencesCount: number;
  primaryInstructorId: string | null;
  pricing: PricingLite | null;
  sellerEligibility: SellerEligibilityLite | null;
  sections: SectionLite[];
};

export type ValidationRule = (input: CourseValidationInput) => ChecklistItem[];

export const MIN_OBJECTIVES = 4;
export const MIN_REQUIREMENTS = 1;
export const MIN_TARGET_AUDIENCES = 1;
export const MIN_SECTIONS = 1;
export const MIN_LECTURES = 5;
export const MIN_TOTAL_VIDEO_SEC = 30 * 60;
