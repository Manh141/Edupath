import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type MonetizationStatusValue =
  | 'not_started'
  | 'in_progress'
  | 'pending_payout'
  | 'active'
  | 'suspended';

export type IdentityStatusValue = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface PricingEligibility {
  instructorId: string;
  monetizationStatus: MonetizationStatusValue;
  identityStatus: IdentityStatusValue;
  canSellPaid: boolean;
  reasons: string[];
  onboardingUrl: string;
  identityFlowUrl: string;
  /** true when payment-service responded; false when we returned a safe fallback */
  resolved: boolean;
}

/**
 * Tolerant client for payment-service monetization eligibility.
 *
 * When PAYMENT_SERVICE_INTERNAL_URL is not configured or the service is unreachable,
 * the client returns an unresolved "not_started" response so pricing and submit
 * can fail with a clear pre-instructor onboarding message.
 */
@Injectable()
export class PricingEligibilityClient {
  private readonly logger = new Logger(PricingEligibilityClient.name);
  private readonly baseUrl: string;
  private readonly internalSecret: string;
  private readonly webBaseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('PAYMENT_SERVICE_INTERNAL_URL') ?? '').replace(/\/$/, '');
    this.internalSecret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.webBaseUrl = (config.get<string>('WEB_ORIGIN') ?? '').split(',')[0]?.trim() ?? '';
    this.timeoutMs = Number(config.get<string>('PAYMENT_SERVICE_TIMEOUT_MS') ?? 3000);
  }

  async getForInstructor(instructorId: string): Promise<PricingEligibility> {
    if (!this.baseUrl || !this.internalSecret) {
      return this.fallback(instructorId, 'MONETIZATION_SERVICE_UNCONFIGURED');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(
        `${this.baseUrl}/api/internal/monetization/eligibility/${encodeURIComponent(instructorId)}`,
        {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'x-internal-service-secret': this.internalSecret,
            'content-type': 'application/json',
          },
        },
      );

      if (!res.ok) {
        this.logger.warn(`Eligibility lookup failed for ${instructorId}: HTTP ${res.status}`);
        return this.fallback(instructorId, 'MONETIZATION_SERVICE_ERROR');
      }

      const payload = (await res.json()) as
        | {
            data?: Partial<PricingEligibility>;
          }
        | (Partial<PricingEligibility> & { status?: MonetizationStatusValue });

      const data =
        (payload as { data?: Partial<PricingEligibility> }).data ??
        (payload as Partial<PricingEligibility>);

      const status = (data as Partial<PricingEligibility> & { status?: MonetizationStatusValue })
        .status;

      return {
        instructorId: data.instructorId ?? instructorId,
        monetizationStatus: (data.monetizationStatus ??
          status ??
          'not_started') as MonetizationStatusValue,
        identityStatus: (data.identityStatus ?? 'not_started') as IdentityStatusValue,
        canSellPaid: Boolean(data.canSellPaid),
        reasons: Array.isArray(data.reasons) ? data.reasons : [],
        onboardingUrl: data.onboardingUrl ?? this.buildUrl('/instructor/monetization'),
        identityFlowUrl: data.identityFlowUrl ?? this.buildUrl('/instructor/identity'),
        resolved: true,
      };
    } catch (error) {
      this.logger.warn(`Eligibility lookup threw for ${instructorId}: ${(error as Error).message}`);
      return this.fallback(instructorId, 'MONETIZATION_SERVICE_UNREACHABLE');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private fallback(instructorId: string, reason: string): PricingEligibility {
    return {
      instructorId,
      monetizationStatus: 'not_started',
      identityStatus: 'not_started',
      canSellPaid: false,
      reasons: [reason],
      onboardingUrl: this.buildUrl('/instructor/monetization'),
      identityFlowUrl: this.buildUrl('/instructor/identity'),
      resolved: false,
    };
  }

  private buildUrl(path: string): string {
    if (!this.webBaseUrl || this.webBaseUrl === '*') return path;
    return `${this.webBaseUrl.replace(/\/$/, '')}${path}`;
  }
}
