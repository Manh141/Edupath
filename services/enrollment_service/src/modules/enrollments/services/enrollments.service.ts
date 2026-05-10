import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus, Prisma } from '../../../common/prisma/prisma-client';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { IssueCertificateDto } from '../dto/issue-certificate.dto';
import { QueryMyEnrollmentsDto } from '../dto/query-my-enrollments.dto';
import { SyncEnrollmentStatusDto } from '../dto/sync-enrollment-status.dto';
import { UpdateLectureProgressDto } from '../dto/update-lecture-progress.dto';
import { CertificatesService } from './certificates.service';
import { CourseProgressSourceService } from './course-progress-source.service';
import { ProgressService } from './progress.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
    private readonly certificatesService: CertificatesService,
    private readonly courseProgressSourceService: CourseProgressSourceService,
  ) {}

  private getMonthStart(offset = 0): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  }

  private getRollingMonthStarts(months: number): Date[] {
    const currentMonthStart = this.getMonthStart();

    return Array.from({ length: months }, (_, index) => {
      const monthsAgo = months - index - 1;
      return new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - monthsAgo, 1);
    });
  }

  private formatMonthLabel(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    });
  }

  private calculateDeltaPercent(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private normalizeAnalyticsDays(days?: number): number {
    if (!Number.isFinite(days)) {
      return 30;
    }

    return Math.min(90, Math.max(7, Math.round(days!)));
  }

  private getPeriodBounds(days?: number) {
    const normalizedDays = this.normalizeAnalyticsDays(days);
    const currentEnd = new Date();
    const currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() - normalizedDays);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - normalizedDays);

    return {
      days: normalizedDays,
      currentStart,
      currentEnd,
      previousStart,
    };
  }

  private buildDailySeries<T extends { date: Date }>(
    rows: T[],
    days: number,
    getValue: (row: T) => number,
  ) {
    const today = new Date();
    const starts = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - index - 1));
      return date;
    });

    return starts.map((start) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const value = rows
        .filter((row) => row.date >= start && row.date < end)
        .reduce((sum, row) => sum + getValue(row), 0);

      return {
        date: start.toISOString().slice(0, 10),
        label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value,
      };
    });
  }

  async createEnrollment(dto: CreateEnrollmentDto) {
    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: dto.userId,
          courseId: dto.courseId,
        },
      },
    });

    if (
      existing &&
      (existing.status === EnrollmentStatus.active ||
        existing.status === EnrollmentStatus.completed)
    ) {
      throw new BadRequestException('User already has access to this course');
    }

    const totalLectures = Math.max(0, dto.totalLectures ?? 0);

    return this.prisma.$transaction(async (tx) => {
      if (existing) {
        const enrollment = await tx.enrollment.update({
          where: { id: existing.id },
          data: {
            courseSlug: dto.courseSlug,
            courseTitle: dto.courseTitle,
            courseThumbnailUrl: dto.courseThumbnailUrl ?? '',
            instructorName: dto.instructorName ?? '',
            orderId: dto.orderId,
            status: EnrollmentStatus.active,
            enrolledAt: new Date(),
            completedAt: null,
            refundedAt: null,
            revokedAt: null,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          },
        });

        await tx.courseProgress.upsert({
          where: { enrollmentId: enrollment.id },
          create: {
            enrollmentId: enrollment.id,
            totalLectures,
          },
          update: {
            totalLectures,
            completedLectures: 0,
            progressPercent: 0,
            lastLectureId: null,
            lastAccessedAt: null,
          },
        });

        await tx.lectureProgress.deleteMany({
          where: { enrollmentId: enrollment.id },
        });

        await tx.certificate.deleteMany({
          where: { enrollmentId: enrollment.id },
        });

        return enrollment;
      }

      const enrollment = await tx.enrollment.create({
        data: {
          userId: dto.userId,
          courseId: dto.courseId,
          courseSlug: dto.courseSlug,
          courseTitle: dto.courseTitle,
          courseThumbnailUrl: dto.courseThumbnailUrl ?? '',
          instructorName: dto.instructorName ?? '',
          orderId: dto.orderId,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        },
      });

      await tx.courseProgress.create({
        data: {
          enrollmentId: enrollment.id,
          totalLectures,
        },
      });

      return enrollment;
    });
  }

  async listMyEnrollments(userId: string, query: QueryMyEnrollmentsDto) {
    const where: Prisma.EnrollmentWhereInput = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.searchTerm
        ? {
            OR: [
              {
                courseTitle: {
                  contains: query.searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                instructorName: {
                  contains: query.searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    // Map sortBy parameter to actual field and direction
    const sortByMap = {
      enrolledAt: { enrolledAt: 'desc' as const },
      updatedAt: { updatedAt: 'desc' as const },
      courseTitle: { courseTitle: 'asc' as const },
    };
    const orderBy = sortByMap[query.sortBy] || { enrolledAt: 'desc' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.enrollment.findMany({
        where,
        include: {
          courseProgress: true,
          certificate: true,
        },
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async getAdminEnrollmentStats() {
    const currentMonthStart = this.getMonthStart();
    const previousMonthStart = this.getMonthStart(-1);
    const nextMonthStart = this.getMonthStart(1);
    const monthStarts = this.getRollingMonthStarts(12);
    const firstSeriesMonth = monthStarts[0] ?? currentMonthStart;

    const [
      totalEnrollments,
      newEnrollmentsThisMonth,
      newEnrollmentsPreviousMonth,
      monthlyEnrollments,
      progressAverage,
      progressRows,
      topCourseRows,
      recentEnrollments,
    ] = await this.prisma.$transaction([
      this.prisma.enrollment.count(),
      this.prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      this.prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      this.prisma.enrollment.findMany({
        where: {
          enrolledAt: {
            gte: firstSeriesMonth,
          },
        },
        select: {
          enrolledAt: true,
        },
      }),
      this.prisma.courseProgress.aggregate({
        _avg: {
          progressPercent: true,
        },
      }),
      this.prisma.courseProgress.findMany({
        select: {
          progressPercent: true,
        },
      }),
      this.prisma.enrollment.findMany({
        select: {
          courseId: true,
          courseTitle: true,
          courseSlug: true,
          instructorName: true,
        },
      }),
      this.prisma.enrollment.findMany({
        orderBy: { enrolledAt: 'desc' },
        take: 8,
        include: {
          courseProgress: true,
          certificate: true,
        },
      }),
    ]);

    const [active, completed, refunded, revoked] = await Promise.all([
      this.prisma.enrollment.count({
        where: { status: EnrollmentStatus.active },
      }),
      this.prisma.enrollment.count({
        where: { status: EnrollmentStatus.completed },
      }),
      this.prisma.enrollment.count({
        where: { status: EnrollmentStatus.refunded },
      }),
      this.prisma.enrollment.count({
        where: { status: EnrollmentStatus.revoked },
      }),
    ]);

    const monthlyNewEnrollments = monthStarts.map((start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const value = monthlyEnrollments.filter(
        (enrollment) => enrollment.enrolledAt >= start && enrollment.enrolledAt < end,
      ).length;

      return {
        month: start.toISOString().slice(0, 7),
        label: this.formatMonthLabel(start),
        value,
      };
    });

    const progressBuckets = [
      { label: '0-25%', min: 0, max: 25, value: 0 },
      { label: '26-50%', min: 26, max: 50, value: 0 },
      { label: '51-75%', min: 51, max: 75, value: 0 },
      { label: '76-99%', min: 76, max: 99, value: 0 },
      { label: '100%', min: 100, max: 100, value: 0 },
    ];

    for (const row of progressRows) {
      const percent = row.progressPercent;
      const bucket = progressBuckets.find((item) => percent >= item.min && percent <= item.max);

      if (bucket) {
        bucket.value += 1;
      }
    }

    const topCourseMap = new Map<
      string,
      {
        courseId: string;
        title: string;
        slug: string;
        instructorName: string;
        enrollments: number;
      }
    >();

    for (const course of topCourseRows) {
      const current = topCourseMap.get(course.courseId);
      topCourseMap.set(course.courseId, {
        courseId: course.courseId,
        title: course.courseTitle,
        slug: course.courseSlug,
        instructorName: course.instructorName,
        enrollments: (current?.enrollments ?? 0) + 1,
      });
    }

    return {
      totalEnrollments,
      active,
      completed,
      refunded,
      revoked,
      completionRate:
        totalEnrollments > 0 ? Number(((completed / totalEnrollments) * 100).toFixed(1)) : 0,
      averageProgress: Number((progressAverage._avg.progressPercent ?? 0).toFixed(1)),
      newEnrollmentsThisMonth,
      newEnrollmentsPreviousMonth,
      newEnrollmentsDeltaPercent: this.calculateDeltaPercent(
        newEnrollmentsThisMonth,
        newEnrollmentsPreviousMonth,
      ),
      monthlyNewEnrollments,
      progressBuckets: progressBuckets.map(({ label, value }) => ({
        label,
        value,
      })),
      statusBreakdown: [
        { status: EnrollmentStatus.active, value: active },
        { status: EnrollmentStatus.completed, value: completed },
        { status: EnrollmentStatus.refunded, value: refunded },
        { status: EnrollmentStatus.revoked, value: revoked },
      ],
      topCourses: [...topCourseMap.values()]
        .sort((left, right) => right.enrollments - left.enrollments)
        .slice(0, 8)
        .map((course) => course),
      recentEnrollments,
    };
  }

  async getCourseEnrollmentAnalytics(courseIds: string[], days?: number) {
    const uniqueCourseIds = [...new Set(courseIds.filter(Boolean))];
    const { currentStart, currentEnd, previousStart, days: normalizedDays } =
      this.getPeriodBounds(days);

    if (!uniqueCourseIds.length) {
      return {
        days: normalizedDays,
        totalStudents: 0,
        completedStudents: 0,
        averageProgress: 0,
        currentEnrollments: 0,
        previousEnrollments: 0,
        enrollmentDeltaPercent: 0,
        series: [],
        byCourse: [],
        recentEnrollments: [],
      };
    }

    const activeStatuses = [EnrollmentStatus.active, EnrollmentStatus.completed];
    const baseWhere: Prisma.EnrollmentWhereInput = {
      courseId: { in: uniqueCourseIds },
      status: { in: activeStatuses },
    };

    const [
      totalStudents,
      completedStudents,
      progressAverage,
      currentEnrollments,
      previousEnrollments,
      currentRows,
      groupedByCourse,
      recentEnrollments,
    ] = await this.prisma.$transaction([
      this.prisma.enrollment.count({
        where: baseWhere,
      }),
      this.prisma.enrollment.count({
        where: {
          ...baseWhere,
          status: EnrollmentStatus.completed,
        },
      }),
      this.prisma.courseProgress.aggregate({
        where: {
          enrollment: baseWhere,
        },
        _avg: {
          progressPercent: true,
        },
      }),
      this.prisma.enrollment.count({
        where: {
          ...baseWhere,
          enrolledAt: {
            gte: currentStart,
            lt: currentEnd,
          },
        },
      }),
      this.prisma.enrollment.count({
        where: {
          ...baseWhere,
          enrolledAt: {
            gte: previousStart,
            lt: currentStart,
          },
        },
      }),
      this.prisma.enrollment.findMany({
        where: {
          ...baseWhere,
          enrolledAt: {
            gte: currentStart,
            lt: currentEnd,
          },
        },
        select: {
          enrolledAt: true,
        },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: baseWhere,
        orderBy: {
          courseId: 'asc',
        },
        _count: true,
      }),
      this.prisma.enrollment.findMany({
        where: baseWhere,
        orderBy: {
          enrolledAt: 'desc',
        },
        take: 8,
        select: {
          id: true,
          courseId: true,
          courseTitle: true,
          userId: true,
          enrolledAt: true,
          status: true,
        },
      }),
    ]);

    const series = this.buildDailySeries(
      currentRows.map((row) => ({ date: row.enrolledAt })),
      normalizedDays,
      () => 1,
    );

    return {
      days: normalizedDays,
      totalStudents,
      completedStudents,
      averageProgress: Number((progressAverage._avg.progressPercent ?? 0).toFixed(1)),
      currentEnrollments,
      previousEnrollments,
      enrollmentDeltaPercent: this.calculateDeltaPercent(currentEnrollments, previousEnrollments),
      series,
      byCourse: groupedByCourse.map((row) => ({
        courseId: row.courseId,
        students: row._count,
      })),
      recentEnrollments,
    };
  }

  async getMyEnrollmentByCourseId(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        courseProgress: true,
        lectureProgresses: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
        certificate: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async getEnrollmentStatusByCourseId(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: { id: true },
    });

    return { enrolled: Boolean(enrollment) };
  }

  async updateLectureProgress(userId: string, dto: UpdateLectureProgressDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: dto.courseId,
        },
      },
      include: {
        courseProgress: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.active) {
      throw new BadRequestException('Enrollment is not active');
    }

    if (enrollment.expiresAt && enrollment.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Enrollment access has expired');
    }

    const lectureSource = await this.courseProgressSourceService.getLectureProgressSource(
      dto.courseId,
      dto.lectureId,
    );
    const nextDurationSec = Math.max(0, lectureSource.durationSec);
    const nextProgressSec = this.normalizeProgressSec(dto.progressSec, nextDurationSec);
    const shouldMarkCompleted = this.shouldMarkLectureCompleted(
      lectureSource.lectureType,
      nextProgressSec,
      nextDurationSec,
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.lectureProgress.upsert({
        where: {
          enrollmentId_lectureId: {
            enrollmentId: enrollment.id,
            lectureId: dto.lectureId,
          },
        },
        create: {
          enrollmentId: enrollment.id,
          lectureId: dto.lectureId,
          progressSec: nextProgressSec,
          durationSec: nextDurationSec,
          isCompleted: shouldMarkCompleted,
          completedAt: shouldMarkCompleted ? new Date() : null,
          lastViewedAt: new Date(),
        },
        update: {
          progressSec: nextProgressSec,
          durationSec: nextDurationSec,
          isCompleted: shouldMarkCompleted,
          completedAt: shouldMarkCompleted ? new Date() : null,
          lastViewedAt: new Date(),
        },
      });

      const completedLectures = await tx.lectureProgress.count({
        where: {
          enrollmentId: enrollment.id,
          isCompleted: true,
        },
      });

      const totalLectures = Math.max(lectureSource.totalLectures, completedLectures);

      const progressPercent = this.progressService.calculateProgress(
        completedLectures,
        totalLectures,
      );

      const progress = await tx.courseProgress.upsert({
        where: {
          enrollmentId: enrollment.id,
        },
        create: {
          enrollmentId: enrollment.id,
          completedLectures,
          totalLectures,
          progressPercent,
          lastLectureId: dto.lectureId,
          lastAccessedAt: new Date(),
        },
        update: {
          completedLectures,
          totalLectures,
          progressPercent,
          lastLectureId: dto.lectureId,
          lastAccessedAt: new Date(),
        },
      });

      if (
        this.progressService.isCompleted(progressPercent) &&
        enrollment.status !== EnrollmentStatus.completed
      ) {
        await tx.enrollment.update({
          where: { id: enrollment.id },
          data: {
            status: EnrollmentStatus.completed,
            completedAt: new Date(),
          },
        });
      }

      return {
        enrollmentId: enrollment.id,
        courseProgress: progress,
      };
    });
  }

  async syncEnrollmentStatus(dto: SyncEnrollmentStatusDto) {
    const enrollment = await this.getEnrollmentByIdOrThrow(dto.enrollmentId);

    const updateData: Prisma.EnrollmentUpdateInput = {
      status: dto.status,
    };

    if (dto.status === EnrollmentStatus.refunded) {
      updateData.refundedAt = new Date();
    }

    if (dto.status === EnrollmentStatus.revoked) {
      updateData.revokedAt = new Date();
    }

    if (dto.status === EnrollmentStatus.active) {
      updateData.refundedAt = null;
      updateData.revokedAt = null;
    }

    if (dto.status === EnrollmentStatus.completed && !enrollment.completedAt) {
      updateData.completedAt = new Date();
    }

    if (dto.status === EnrollmentStatus.active) {
      updateData.completedAt = null;
    }

    return this.prisma.enrollment.update({
      where: { id: dto.enrollmentId },
      data: updateData,
    });
  }

  async issueCertificate(dto: IssueCertificateDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
      include: { courseProgress: true, certificate: true },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const progressPercent = enrollment.courseProgress?.progressPercent ?? 0;
    if (progressPercent < 100 && enrollment.status !== EnrollmentStatus.completed) {
      throw new BadRequestException('Certificate can only be issued after completion');
    }

    return this.prisma.certificate.upsert({
      where: { enrollmentId: dto.enrollmentId },
      create: {
        enrollmentId: dto.enrollmentId,
        certificateCode: this.certificatesService.buildCertificateCode(enrollment.id),
        fileUrl: dto.fileUrl,
      },
      update: {
        fileUrl: dto.fileUrl,
        issuedAt: new Date(),
      },
    });
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        courseProgress: true,
        certificate: true,
      },
    });
  }

  async listEnrollmentsForCourse(courseId: string) {
    const records = await this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        courseProgress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      courseId: record.courseId,
      status: record.status,
      enrolledAt: record.enrolledAt.toISOString(),
      progressPercent: record.courseProgress?.progressPercent ?? 0,
      completedAt: record.completedAt ? record.completedAt.toISOString() : null,
    }));
  }

  async getEnrollmentByIdOrThrow(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        courseProgress: true,
        lectureProgresses: true,
        certificate: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  private normalizeProgressSec(progressSec: number, durationSec: number) {
    const normalizedProgress = Math.max(0, progressSec);
    if (durationSec <= 0) {
      return normalizedProgress;
    }

    return Math.min(normalizedProgress, durationSec);
  }

  private shouldMarkLectureCompleted(
    lectureType: 'video' | 'article' | 'resource',
    progressSec: number,
    durationSec: number,
  ) {
    if (lectureType === 'video') {
      return durationSec > 0 && progressSec >= durationSec;
    }

    return progressSec > 0;
  }
}
