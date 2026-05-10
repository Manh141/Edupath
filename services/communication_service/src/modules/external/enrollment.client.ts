import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { internalFetch } from './http.util';

export interface EnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  enrolledAt: string;
  progressPercent?: number;
  completedAt?: string | null;
}

export interface EnrollmentListResponse {
  items: EnrollmentRecord[];
  total: number;
}

@Injectable()
export class EnrollmentClient {
  private readonly logger = new Logger(EnrollmentClient.name);
  private readonly baseUrl: string;
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('ENROLLMENT_SERVICE_INTERNAL_URL') ?? '').replace(/\/$/, '');
    this.secret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.timeoutMs = Number(config.get<string>('EXTERNAL_SERVICE_TIMEOUT_MS') ?? 5000);
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  async findEnrollment(userId: string, courseId: string): Promise<EnrollmentRecord | null> {
    if (!this.isConfigured()) {
      return null;
    }
    try {
      return await internalFetch<EnrollmentRecord>({
        baseUrl: this.baseUrl,
        path: `/api/internal/enrollments/${encodeURIComponent(userId)}/course/${encodeURIComponent(courseId)}`,
        method: 'GET',
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
    } catch (error) {
      this.logger.warn(`findEnrollment failed: ${(error as Error).message}`);
      return null;
    }
  }

  async listStudentsForCourse(courseId: string): Promise<EnrollmentRecord[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const result = await internalFetch<EnrollmentRecord[] | EnrollmentListResponse>({
        baseUrl: this.baseUrl,
        path: `/api/internal/enrollments/by-course/${encodeURIComponent(courseId)}`,
        method: 'GET',
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
      if (Array.isArray(result)) return result;
      return result?.items ?? [];
    } catch (error) {
      this.logger.warn(`listStudentsForCourse failed: ${(error as Error).message}`);
      return [];
    }
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const record = await this.findEnrollment(userId, courseId);
    if (!record) return false;
    return record.status !== 'cancelled' && record.status !== 'refunded';
  }
}
