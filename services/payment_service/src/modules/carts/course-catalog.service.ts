import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface InternalResponse<T> {
  success: boolean;
  data: T;
}

interface CourseInstructorSnapshot {
  displayName?: string;
  isPrimary?: boolean;
}

interface CourseBasicSnapshot {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string;
  price: number;
  currency?: string;
  status: string;
  instructors?: CourseInstructorSnapshot[];
  totalLectures?: number;
}

export interface SellableCourseSnapshot {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  instructorName: string;
  unitPrice: number;
  currency: string;
  totalLectures: number;
}

export interface EnrollmentCourseSnapshot {
  id: string;
  slug: string;
  totalLectures: number;
}

@Injectable()
export class CourseCatalogService {
  constructor(private readonly configService: ConfigService) {}

  async getSellableCourseById(courseId: string) {
    const course = await this.request<CourseBasicSnapshot>(
      `/api/internal/courses/${encodeURIComponent(courseId)}/basic`,
    );

    return this.toSellableCourse(course);
  }

  async getSellableCoursesByIds(courseIds: string[]) {
    const uniqueIds = [...new Set(courseIds)];
    if (!uniqueIds.length) {
      return new Map<string, SellableCourseSnapshot>();
    }

    const courses = await this.request<CourseBasicSnapshot[]>('/api/internal/courses/batch/basic', {
      method: 'POST',
      body: JSON.stringify({ ids: uniqueIds }),
    });

    const courseMap = new Map<string, SellableCourseSnapshot>();
    for (const course of courses) {
      courseMap.set(course.id, this.toSellableCourse(course));
    }

    return courseMap;
  }

  async getEnrollmentCoursesByIds(courseIds: string[]) {
    const uniqueIds = [...new Set(courseIds)];
    if (!uniqueIds.length) {
      return new Map<string, EnrollmentCourseSnapshot>();
    }

    const courses = await this.request<EnrollmentCourseSnapshot[]>(
      '/api/internal/courses/batch/fulfillment-snapshot',
      {
        method: 'POST',
        body: JSON.stringify({ ids: uniqueIds }),
      },
    );

    const courseMap = new Map<string, EnrollmentCourseSnapshot>();
    for (const course of courses) {
      if (!Number.isInteger(course.totalLectures) || course.totalLectures < 0) {
        throw new ServiceUnavailableException('Course fulfillment snapshot is invalid');
      }

      courseMap.set(course.id, {
        id: course.id,
        slug: course.slug,
        totalLectures: course.totalLectures,
      });
    }

    return courseMap;
  }

  private async request<T>(path: string, init?: RequestInit) {
    const baseUrl = this.configService.getOrThrow<string>('COURSE_SERVICE_URL');
    const internalSecret = this.configService.get<string>('INTERNAL_SERVICE_SECRET');
    const headers = new Headers(init?.headers);

    headers.set('content-type', 'application/json');
    if (internalSecret) {
      headers.set('x-internal-service-secret', internalSecret);
    }

    const response = await fetch(new URL(path, baseUrl), {
      ...init,
      headers,
    }).catch(() => {
      throw new ServiceUnavailableException('Unable to reach course catalog service');
    });

    const payload = (await response.json().catch(() => null)) as InternalResponse<T> | null;

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundException('Course not found');
      }

      throw new ServiceUnavailableException('Course catalog service returned an error');
    }

    if (!payload || !payload.success) {
      throw new ServiceUnavailableException('Course catalog response is invalid');
    }

    return payload.data;
  }

  private toSellableCourse(course: CourseBasicSnapshot): SellableCourseSnapshot {
    if (course.status !== 'published') {
      throw new BadRequestException('Course is not available for purchase');
    }

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      thumbnailUrl: course.thumbnailUrl ?? '',
      instructorName:
        course.instructors?.find((item) => item.isPrimary)?.displayName ?? course.instructors?.[0]?.displayName ?? '',
      unitPrice: course.price,
      currency: course.currency ?? this.configService.get<string>('DEFAULT_CURRENCY', 'VND'),
      totalLectures: course.totalLectures ?? 0,
    };
  }
}
