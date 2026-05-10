import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { internalFetch } from './http.util';

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  status?: string;
  totalStudents?: number;
  averageRating?: number;
  totalReviews?: number;
  primaryInstructorId?: string;
  primaryInstructorName?: string;
  instructors?: Array<{
    instructorId: string;
    displayName: string;
    isPrimary?: boolean;
  }>;
}

export interface CourseInstructorRelation {
  courseId: string;
  instructorId: string;
  isPrimary?: boolean;
}

@Injectable()
export class CourseClient {
  private readonly logger = new Logger(CourseClient.name);
  private readonly baseUrl: string;
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('COURSE_SERVICE_INTERNAL_URL') ?? '').replace(/\/$/, '');
    this.secret = config.get<string>('INTERNAL_SERVICE_SECRET') ?? '';
    this.timeoutMs = Number(config.get<string>('EXTERNAL_SERVICE_TIMEOUT_MS') ?? 5000);
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  async findCourse(courseId: string): Promise<CourseSummary | null> {
    if (!this.isConfigured()) {
      return null;
    }
    try {
      return await internalFetch<CourseSummary>({
        baseUrl: this.baseUrl,
        path: `/api/internal/courses/${encodeURIComponent(courseId)}`,
        method: 'GET',
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
    } catch (error) {
      this.logger.warn(`findCourse(${courseId}) failed: ${(error as Error).message}`);
      return null;
    }
  }

  async listCoursesByInstructor(instructorId: string): Promise<CourseSummary[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const result = await internalFetch<CourseSummary[]>({
        baseUrl: this.baseUrl,
        path: `/api/internal/courses/by-instructor/${encodeURIComponent(instructorId)}`,
        method: 'GET',
        internalSecret: this.secret,
        timeoutMs: this.timeoutMs,
        logger: this.logger,
      });
      return Array.isArray(result) ? result : [];
    } catch (error) {
      this.logger.warn(
        `listCoursesByInstructor(${instructorId}) failed: ${(error as Error).message}`,
      );
      return [];
    }
  }

  async isInstructorOfCourse(instructorId: string, courseId: string): Promise<boolean> {
    const course = await this.findCourse(courseId);
    if (!course) return false;
    if (course.primaryInstructorId === instructorId) return true;
    return Boolean(course.instructors?.some((entry) => entry.instructorId === instructorId));
  }
}
