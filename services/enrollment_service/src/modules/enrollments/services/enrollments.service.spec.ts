import { BadRequestException } from '@nestjs/common';
import { EnrollmentStatus } from '../../../common/prisma/prisma-client';
import type { PrismaService } from '../../../common/prisma/prisma.service';
import type { CertificatesService } from './certificates.service';
import type { CourseProgressSourceService } from './course-progress-source.service';
import { EnrollmentsService } from './enrollments.service';
import type { ProgressService } from './progress.service';

function createPrismaMock() {
  const enrollment = {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const courseProgress = {
    create: jest.fn(),
    upsert: jest.fn(),
  };
  const lectureProgress = {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  };
  const certificate = {
    deleteMany: jest.fn(),
    upsert: jest.fn(),
  };

  return {
    enrollment,
    courseProgress,
    lectureProgress,
    certificate,
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          enrollment,
          courseProgress,
          lectureProgress,
          certificate,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('EnrollmentsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let progressService: {
    calculateProgress: jest.Mock;
    isCompleted: jest.Mock;
  };
  let certificatesService: { buildCertificateCode: jest.Mock };
  let courseProgressSourceService: { getLectureProgressSource: jest.Mock };
  let service: EnrollmentsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    progressService = {
      calculateProgress: jest.fn((completedLectures: number, totalLectures: number) =>
        totalLectures <= 0 ? 0 : Number(((completedLectures / totalLectures) * 100).toFixed(2)),
      ),
      isCompleted: jest.fn((progressPercent: number) => progressPercent >= 100),
    };
    certificatesService = {
      buildCertificateCode: jest.fn().mockReturnValue('CERT-000001'),
    };
    courseProgressSourceService = {
      getLectureProgressSource: jest.fn(),
    };

    service = new EnrollmentsService(
      prisma as unknown as PrismaService,
      progressService as unknown as ProgressService,
      certificatesService as unknown as CertificatesService,
      courseProgressSourceService as unknown as CourseProgressSourceService,
    );
  });

  it('creates an enrollment when the learner does not already have access', async () => {
    prisma.enrollment.findUnique.mockResolvedValue(null);
    prisma.enrollment.create.mockResolvedValue({
      id: 'enrollment-1',
      userId: 'user-1',
      courseId: 'course-1',
      status: EnrollmentStatus.active,
    });
    prisma.courseProgress.create.mockResolvedValue({
      enrollmentId: 'enrollment-1',
      totalLectures: 12,
    });

    const result = await service.createEnrollment({
      userId: 'user-1',
      courseId: 'course-1',
      courseSlug: 'course-1',
      courseTitle: 'NestJS Fundamentals',
      totalLectures: 12,
      orderId: 'order-1',
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: 'enrollment-1',
        courseId: 'course-1',
        status: EnrollmentStatus.active,
      }),
    );
    expect(prisma.courseProgress.create).toHaveBeenCalledWith({
      data: {
        enrollmentId: 'enrollment-1',
        totalLectures: 12,
      },
    });
  });

  it('does not allow duplicate enrollment for active access', async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: 'enrollment-1',
      status: EnrollmentStatus.active,
    });

    await expect(
      service.createEnrollment({
        userId: 'user-1',
        courseId: 'course-1',
        courseSlug: 'course-1',
        courseTitle: 'NestJS Fundamentals',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('clamps lecture progress to the lecture duration and marks the course completed', async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: 'enrollment-1',
      status: EnrollmentStatus.active,
      expiresAt: null,
      courseProgress: { progressPercent: 75 },
    });
    courseProgressSourceService.getLectureProgressSource.mockResolvedValue({
      courseId: 'course-1',
      lectureId: 'lecture-1',
      lectureType: 'video',
      durationSec: 120,
      totalLectures: 4,
    });
    prisma.lectureProgress.upsert.mockResolvedValue({
      enrollmentId: 'enrollment-1',
      lectureId: 'lecture-1',
      progressSec: 120,
      isCompleted: true,
    });
    prisma.lectureProgress.count.mockResolvedValue(4);
    prisma.courseProgress.upsert.mockResolvedValue({
      enrollmentId: 'enrollment-1',
      completedLectures: 4,
      totalLectures: 4,
      progressPercent: 100,
      lastLectureId: 'lecture-1',
    });
    prisma.enrollment.update.mockResolvedValue({
      id: 'enrollment-1',
      status: EnrollmentStatus.completed,
    });

    const result = await service.updateLectureProgress('user-1', {
      courseId: 'course-1',
      lectureId: 'lecture-1',
      progressSec: 240,
    });

    expect(prisma.lectureProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          progressSec: 120,
          durationSec: 120,
          isCompleted: true,
        }),
        update: expect.objectContaining({
          progressSec: 120,
          durationSec: 120,
          isCompleted: true,
        }),
      }),
    );
    expect(prisma.enrollment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'enrollment-1' },
        data: expect.objectContaining({
          status: EnrollmentStatus.completed,
        }),
      }),
    );
    expect(result.courseProgress.progressPercent).toBe(100);
  });

  it('does not issue a certificate before the course is completed', async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: 'enrollment-1',
      status: EnrollmentStatus.active,
      courseProgress: { progressPercent: 60 },
      certificate: null,
    });

    await expect(
      service.issueCertificate({
        enrollmentId: 'enrollment-1',
        fileUrl: 'https://cdn.example.com/cert.pdf',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('issues a certificate when the course is completed', async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: 'enrollment-1',
      status: EnrollmentStatus.completed,
      courseProgress: { progressPercent: 100 },
      certificate: null,
    });
    prisma.certificate.upsert.mockResolvedValue({
      id: 'cert-1',
      enrollmentId: 'enrollment-1',
      certificateCode: 'CERT-000001',
      fileUrl: 'https://cdn.example.com/cert.pdf',
    });

    const result = await service.issueCertificate({
      enrollmentId: 'enrollment-1',
      fileUrl: 'https://cdn.example.com/cert.pdf',
    });

    expect(certificatesService.buildCertificateCode).toHaveBeenCalledWith('enrollment-1');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'cert-1',
        certificateCode: 'CERT-000001',
      }),
    );
  });
});
