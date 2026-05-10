import { apiRequest } from "./api-client";
import type {
  ConnectPayoutAccountInput,
  CoursePricingPage,
  MonetizationProfile,
  PayoutAccountPublic,
  SellerEligibility,
  UpdateCoursePricingInput,
  UpdateMonetizationProfileInput,
} from "@/types/monetization";

export { ApiError } from "./api-client";

export const pricingApi = {
  getCoursePricing(courseId: string, accessToken: string) {
    return apiRequest<CoursePricingPage>(
      `/api/instructor/courses/${courseId}/pricing`,
      { accessToken },
    );
  },

  updateCoursePricing(
    courseId: string,
    dto: UpdateCoursePricingInput,
    accessToken: string,
  ) {
    return apiRequest<CoursePricingPage>(
      `/api/instructor/courses/${courseId}/pricing`,
      { method: "PUT", body: dto, accessToken },
    );
  },
};

export const monetizationApi = {
  getProfile(accessToken: string) {
    return apiRequest<MonetizationProfile>(
      "/api/instructor/monetization/profile",
      { accessToken },
    );
  },

  updateProfile(dto: UpdateMonetizationProfileInput, accessToken: string) {
    return apiRequest<MonetizationProfile>(
      "/api/instructor/monetization/profile",
      { method: "PUT", body: dto, accessToken },
    );
  },

  getEligibility(accessToken: string) {
    return apiRequest<SellerEligibility>(
      "/api/instructor/monetization/eligibility",
      { accessToken },
    );
  },

  acceptTerms(
    dto: { termsVersion: string; accepted: boolean },
    accessToken: string,
  ) {
    return apiRequest<unknown>("/api/instructor/monetization/terms", {
      method: "POST",
      body: dto,
      accessToken,
    });
  },

  acceptPromotional(dto: { participate: boolean }, accessToken: string) {
    return apiRequest<unknown>("/api/instructor/monetization/promotional", {
      method: "POST",
      body: dto,
      accessToken,
    });
  },

  listPayoutAccounts(accessToken: string) {
    return apiRequest<PayoutAccountPublic[]>(
      "/api/instructor/monetization/payout-accounts",
      { accessToken },
    );
  },

  connectPayoutAccount(
    dto: ConnectPayoutAccountInput,
    accessToken: string,
  ) {
    return apiRequest<PayoutAccountPublic>(
      "/api/instructor/monetization/payout-accounts",
      { method: "POST", body: dto, accessToken },
    );
  },

  setDefaultPayoutAccount(id: string, accessToken: string) {
    return apiRequest<{ ok: boolean }>(
      `/api/instructor/monetization/payout-accounts/${id}/default`,
      { method: "POST", accessToken },
    );
  },

  removePayoutAccount(id: string, accessToken: string) {
    return apiRequest<unknown>(
      `/api/instructor/monetization/payout-accounts/${id}`,
      { method: "DELETE", accessToken },
    );
  },
};
