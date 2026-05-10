import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface InternalResponse<T> {
  success: boolean;
  data: T;
}

export interface LectureProgressSource {
  courseId: string;
  lectureId: string;
  lectureType: 'video' | 'article' | 'resource';
  durationSec: number;
  totalLectures: number;
}

@Injectable()
export class CourseProgressSourceService {
  constructor(private readonly configService: ConfigService) {}

  async getLectureProgressSource(courseId: string, lectureId: string) {
    return this.request<LectureProgressSource>(
      `/api/internal/courses/${encodeURIComponent(courseId)}/lectures/${encodeURIComponent(lectureId)}/progress-source`,
    );
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
      throw new ServiceUnavailableException('Unable to reach course service');
    });

    const payload = (await response.json().catch(() => null)) as InternalResponse<T> | null;

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundException('Lecture not found');
      }

      throw new ServiceUnavailableException('Course service returned an error');
    }

    if (!payload || !payload.success) {
      throw new ServiceUnavailableException('Course service response is invalid');
    }

    return payload.data;
  }
}
