import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface InternalResponse<T> {
  success: boolean;
  data: T;
}

export interface EnrollmentLookupSnapshot {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'refunded' | 'revoked';
  orderId?: string | null;
}

export interface CreateEnrollmentRequest {
  userId: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseThumbnailUrl?: string;
  instructorName?: string;
  orderId?: string;
  totalLectures?: number;
}

export interface SyncEnrollmentStatusRequest {
  enrollmentId: string;
  status: 'active' | 'completed' | 'refunded' | 'revoked';
  reason?: string;
}

@Injectable()
export class EnrollmentServiceClient {
  private readonly baseUrl: string;
  private readonly internalSecret: string;

  constructor(configService: ConfigService) {
    this.baseUrl = (configService.get<string>('ENROLLMENT_SERVICE_URL') ?? '').replace(/\/$/, '');
    this.internalSecret = (configService.get<string>('INTERNAL_SERVICE_SECRET') ?? '').trim();
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<EnrollmentLookupSnapshot | null> {
    return this.requestJson<EnrollmentLookupSnapshot>(
      `/api/internal/enrollments/${encodeURIComponent(userId)}/course/${encodeURIComponent(courseId)}`,
      { method: 'GET' },
      { allowNotFound: true },
    );
  }

  async createEnrollment(payload: CreateEnrollmentRequest): Promise<boolean> {
    try {
      await this.requestJson<unknown>('/api/internal/enrollments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return true;
    } catch (error) {
      if (this.isDuplicateEnrollmentError(error)) {
        return false;
      }

      throw error;
    }
  }

  async syncEnrollmentStatus(payload: SyncEnrollmentStatusRequest): Promise<boolean> {
    await this.requestJson<unknown>('/api/internal/enrollments/status', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return true;
  }

  private async requestJson<T>(
    path: string,
    init?: RequestInit,
    options?: { allowNotFound?: boolean },
  ): Promise<T | null> {
    if (!this.baseUrl) {
      throw new ServiceUnavailableException('Enrollment service URL is not configured');
    }

    if (!this.internalSecret) {
      throw new ServiceUnavailableException('Internal service secret is not configured');
    }

    const headers = new Headers(init?.headers);
    headers.set('content-type', 'application/json');
    headers.set('x-internal-service-secret', this.internalSecret);

    const response = await fetch(new URL(path, this.baseUrl), {
      ...init,
      headers,
    }).catch((error: unknown) => {
      throw new ServiceUnavailableException(
        `Unable to reach enrollment service: ${(error as Error).message}`,
      );
    });

    const payload = (await response.json().catch(() => null)) as InternalResponse<T> | null;

    if (!response.ok) {
      if (options?.allowNotFound && response.status === 404) {
        return null;
      }

      const message =
        this.extractMessage(payload) ?? response.statusText ?? 'Enrollment service returned an error';

      if (response.status === 404) {
        throw new NotFoundException(message);
      }

      if (response.status === 409) {
        throw new ConflictException(message);
      }

      if (response.status >= 500) {
        throw new ServiceUnavailableException(message);
      }

      throw new BadRequestException(message);
    }

    if (!payload || !payload.success) {
      throw new ServiceUnavailableException('Enrollment service response is invalid');
    }

    return payload.data;
  }

  private isDuplicateEnrollmentError(error: unknown): boolean {
    if (!(error instanceof HttpException)) {
      return false;
    }

    const status = error.getStatus();
    if (status !== 400 && status !== 409) {
      return false;
    }

    const message = this.extractMessage(error.getResponse())?.toLowerCase() ?? '';
    return message.includes('already has access') || message.includes('duplicate resource');
  }

  private extractMessage(payload: unknown): string | undefined {
    if (typeof payload === 'string') {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    const data = payload as Record<string, unknown>;

    if (typeof data.message === 'string') {
      return data.message;
    }

    if (Array.isArray(data.message) && data.message.every((item) => typeof item === 'string')) {
      return data.message.join(', ');
    }

    return undefined;
  }
}
