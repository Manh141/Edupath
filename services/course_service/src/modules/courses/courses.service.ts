import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import {
  CourseAssetStatus,
  CourseAssetType,
  CourseLevel,
  CourseReviewSubmissionStatus,
  CourseStatus,
  CourseStatusActorType,
  Prisma,
} from '../../common/prisma/prisma-client';
import { ROLES } from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CompleteDirectUploadDto,
  InitiateDirectUploadDto,
} from '../../common/storage/dto/direct-upload.dto';
import { MinioService } from '../../common/storage/minio.service';
import type { UploadedStorageFile } from '../../common/storage/uploaded-file.type';
import { normalizePagination } from '../../common/utils/pagination.util';
import { generateUniqueSlug } from '../../common/utils/slug.util';
import { JobsService } from '../jobs/jobs.service';
import { CourseStateMachine } from './moderation/course-state-machine';
import { CourseStatusHistoryService } from './moderation/course-status-history.service';
import { BatchCourseLookupDto } from './dto/batch-course-lookup.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryAdminCoursesDto } from './dto/query-admin-courses.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { QueryInstructorCoursesDto } from './dto/query-instructor-courses.dto';
import { RejectCourseDto } from './dto/reject-course.dto';
import { ReplaceCourseFaqsDto } from './dto/replace-course-faqs.dto';
import { ReplaceCourseInstructorsDto } from './dto/replace-course-instructors.dto';
import { ReplaceCourseListDto } from './dto/replace-course-list.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UploadCourseAssetDto } from './dto/upload-course-asset.dto';
import { UpsertCourseMessageDto } from './dto/upsert-course-message.dto';

const adminCourseInclude = {
  subcategory: {
    include: {
      category: true,
    },
  },
  instructors: {
    orderBy: {
      isPrimary: 'desc',
    },
  },
  sections: {
    select: {
      lectures: {
        select: {
          id: true,
        },
      },
    },
  },
} satisfies Prisma.CourseInclude;

const adminCourseDetailInclude = {
  subcategory: {
    include: {
      category: true,
    },
  },
  instructors: {
    orderBy: {
      isPrimary: 'desc',
    },
  },
  assets: {
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  },
  objectives: {
    orderBy: {
      order: 'asc',
    },
  },
  requirements: {
    orderBy: {
      order: 'asc',
    },
  },
  targetAudiences: {
    orderBy: {
      order: 'asc',
    },
  },
  faqs: {
    orderBy: {
      order: 'asc',
    },
  },
  message: true,
  sections: {
    orderBy: {
      order: 'asc',
    },
    include: {
      lectures: {
        orderBy: {
          order: 'asc',
        },
        include: {
          assets: true,
        },
      },
    },
  },
} satisfies Prisma.CourseInclude;

type CourseWithAdminRelations = Prisma.CourseGetPayload<{
  include: typeof adminCourseInclude;
}>;

type CourseWithAdminDetailRelations = Prisma.CourseGetPayload<{
  include: typeof adminCourseDetailInclude;
}>;

const COURSE_THUMBNAIL_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const COURSE_PROMO_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const MAX_PROMO_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;
const SIGNED_UPLOAD_EXPIRES_IN_SEC = 15 * 60;
const DATABASE_SAFE_INT_MAX = 2_147_483_647;

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly statusHistory: CourseStatusHistoryService,
    private readonly storage: MinioService,
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

  async createDraft(currentUser: JwtPayload, dto: CreateCourseDto) {
    const title = dto.title?.trim() ?? '';

    if (dto.subcategoryId) {
      await this.assertSubcategoryExists(dto.subcategoryId);
    }

    const slug = await generateUniqueSlug(title || 'draft-course', async (candidate) => {
      const exists = await this.prisma.course.findUnique({ where: { slug: candidate } });
      return Boolean(exists);
    });

    const compareAtPrice = typeof dto.compareAtPrice === 'number' ? dto.compareAtPrice : null;

    if (
      typeof compareAtPrice === 'number' &&
      typeof dto.price === 'number' &&
      compareAtPrice < dto.price
    ) {
      throw new BadRequestException('compareAtPrice must be greater than or equal to price.');
    }

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.course.create({
        data: {
          title,
          slug,
          subtitle: dto.subtitle ?? '',
          shortDescription: dto.shortDescription ?? '',
          description: dto.description ?? '',
          subcategoryId: dto.subcategoryId ?? null,
          thumbnailUrl: dto.thumbnailUrl ?? '',
          trailerUrl: dto.trailerUrl ?? '',
          language: dto.language ?? 'vi',
          subtitleLanguages: dto.subtitleLanguages ?? [],
          level: dto.level ?? CourseLevel.Beginner,
          status: CourseStatus.draft,
          price: dto.price ?? 0,
          compareAtPrice,
          currency: dto.currency ?? 'VND',
          createdBy: currentUser.sub,
          updatedBy: currentUser.sub,
          instructors: {
            create: [
              {
                instructorId: currentUser.sub,
                displayName: currentUser.displayName ?? currentUser.email,
                avatarUrl: currentUser.avatarUrl ?? '',
                bio: '',
                isPrimary: true,
              },
            ],
          },
          message: {
            create: {
              welcomeMessage: '',
              congratulationsMessage: '',
            },
          },
        },
        include: {
          instructors: true,
          subcategory: true,
          assets: true,
        },
      });

      await this.statusHistory.log(tx, {
        courseId: created.id,
        fromStatus: null,
        toStatus: CourseStatus.draft,
        actorType: CourseStatusActorType.instructor,
        actorId: currentUser.sub,
        reason: 'Course draft created',
      });

      return created;
    });
  }

  async listPublicCourses(query: QueryCoursesDto) {
    const { skip, take, page, limit } = normalizePagination(query.page, query.limit);
    const where: Prisma.CourseWhereInput = {
      status: CourseStatus.published,
      deletedAt: null,
    };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { subtitle: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.categorySlug || query.subcategorySlug) {
      where.subcategory = {
        is: {
          ...(query.subcategorySlug ? { slug: query.subcategorySlug } : {}),
          ...(query.categorySlug
            ? {
                category: {
                  is: {
                    slug: query.categorySlug,
                  },
                },
              }
            : {}),
        },
      };
    }

    if (query.level) {
      where.level = query.level;
    }

    if (query.language) {
      where.language = query.language;
    }

    if (typeof query.minPrice === 'number' || typeof query.maxPrice === 'number') {
      where.price = {
        ...(typeof query.minPrice === 'number' ? { gte: query.minPrice } : {}),
        ...(typeof query.maxPrice === 'number' ? { lte: query.maxPrice } : {}),
      };
    }

    const orderBy = this.resolveListOrder(query.sort);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
          instructors: {
            where: { isPrimary: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listInstructorCourses(
    currentUser: JwtPayload,
    query: QueryInstructorCoursesDto = new QueryInstructorCoursesDto(),
  ) {
    const isAdmin = this.hasRole(currentUser, ROLES.ADMIN);
    const search = query.search?.trim();

    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      ...(isAdmin
        ? {}
        : {
            instructors: {
              some: {
                instructorId: currentUser.sub,
              },
            },
          }),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { subtitle: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const { page, limit, skip, take } = normalizePagination(
      query.page,
      query.limit,
    );

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
          subcategory: {
            include: { category: true },
          },
          instructors: {
            orderBy: { isPrimary: 'desc' },
          },
        },
        skip,
        take,
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async listAdminCourses(query: QueryAdminCoursesDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where = this.buildAdminCourseWhere(query);
    const orderBy = this.buildAdminCourseOrderBy(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        include: adminCourseInclude,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    const normalizedItems = items.map((course) => this.toAdminCourseListItem(course));

    return {
      items: normalizedItems,
      data: normalizedItems,
      total,
      page,
      limit,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminCourseStats() {
    const currentMonthStart = this.getMonthStart();
    const previousMonthStart = this.getMonthStart(-1);
    const nextMonthStart = this.getMonthStart(1);
    const monthStarts = this.getRollingMonthStarts(12);
    const firstSeriesMonth = monthStarts[0] ?? currentMonthStart;

    const [
      totalCourses,
      totalCategories,
      averageRating,
      totalReviews,
      hiddenReviews,
      pendingReviewSubmissions,
      newCoursesThisMonth,
      newCoursesPreviousMonth,
      monthlyCourses,
      categoryCourses,
      topCourses,
    ] = await this.prisma.$transaction([
      this.prisma.course.count({ where: { deletedAt: null } }),
      this.prisma.category.count(),
      this.prisma.course.aggregate({
        where: {
          deletedAt: null,
          status: CourseStatus.published,
        },
        _avg: {
          averageRating: true,
        },
      }),
      this.prisma.courseReview.count(),
      this.prisma.courseReview.count({ where: { isVisible: false } }),
      this.prisma.courseReviewSubmission.count({
        where: {
          status: {
            in: [CourseReviewSubmissionStatus.pending, CourseReviewSubmissionStatus.in_review],
          },
        },
      }),
      this.prisma.course.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      this.prisma.course.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      this.prisma.course.findMany({
        where: {
          deletedAt: null,
          createdAt: {
            gte: firstSeriesMonth,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      this.prisma.course.findMany({
        where: { deletedAt: null },
        select: {
          subcategory: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.course.findMany({
        where: { deletedAt: null },
        orderBy: [{ totalStudents: 'desc' }, { averageRating: 'desc' }, { updatedAt: 'desc' }],
        take: 8,
        include: adminCourseInclude,
      }),
    ]);

    const statusBreakdown = await Promise.all(
      Object.values(CourseStatus).map(async (status) => ({
        status,
        value: await this.prisma.course.count({
          where: { deletedAt: null, status },
        }),
      })),
    );

    const monthlyCreatedCourses = monthStarts.map((start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const value = monthlyCourses.filter(
        (course) => course.createdAt >= start && course.createdAt < end,
      ).length;

      return {
        month: start.toISOString().slice(0, 7),
        label: this.formatMonthLabel(start),
        value,
      };
    });

    const categories = new Map<string, { id: string; name: string; slug: string; value: number }>();

    for (const course of categoryCourses) {
      if (!course.subcategory) {
        continue;
      }

      const category = course.subcategory.category;
      const current = categories.get(category.id);
      categories.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        value: (current?.value ?? 0) + 1,
      });
    }

    return {
      totalCourses,
      liveCourses:
        statusBreakdown.find((item) => item.status === CourseStatus.published)?.value ?? 0,
      pendingReview:
        statusBreakdown.find((item) => item.status === CourseStatus.pending_review)?.value ?? 0,
      changesRequested:
        statusBreakdown.find((item) => item.status === CourseStatus.changes_requested)?.value ?? 0,
      totalCategories,
      averageRating: Number((averageRating._avg.averageRating ?? 0).toFixed(2)),
      totalReviews,
      hiddenReviews,
      pendingReviewSubmissions,
      newCoursesThisMonth,
      newCoursesPreviousMonth,
      newCoursesDeltaPercent: this.calculateDeltaPercent(
        newCoursesThisMonth,
        newCoursesPreviousMonth,
      ),
      statusBreakdown,
      monthlyCreatedCourses,
      categoryShare: [...categories.values()].sort((left, right) => right.value - left.value),
      topCourses: topCourses.map((course) => this.toAdminCourseListItem(course)),
    };
  }

  async getAdminCourseById(id: string): Promise<CourseWithAdminDetailRelations> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: adminCourseDetailInclude,
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  async getPublicCourse(identifier: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
        status: CourseStatus.published,
        deletedAt: null,
      },
      include: {
        subcategory: {
          include: { category: true },
        },
        instructors: {
          orderBy: { isPrimary: 'desc' },
        },
        objectives: {
          orderBy: { order: 'asc' },
        },
        requirements: {
          orderBy: { order: 'asc' },
        },
        targetAudiences: {
          orderBy: { order: 'asc' },
        },
        faqs: {
          orderBy: { order: 'asc' },
        },
        message: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lectures: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
              include: {
                assets: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  async getPublicCourseBySlug(slug: string) {
    return this.getPublicCourse(slug);
  }

  async getInstructorCourseById(id: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        subcategory: { include: { category: true } },
        instructors: true,
        assets: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        objectives: { orderBy: { order: 'asc' } },
        requirements: { orderBy: { order: 'asc' } },
        targetAudiences: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } },
        message: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lectures: {
              orderBy: { order: 'asc' },
              include: { assets: true },
            },
          },
        },
      },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    return course;
  }

  async updateDraft(id: string, currentUser: JwtPayload, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);

    if (dto.subcategoryId) {
      await this.assertSubcategoryExists(dto.subcategoryId);
    }

    if (
      typeof dto.compareAtPrice === 'number' &&
      typeof dto.price === 'number' &&
      dto.compareAtPrice < dto.price
    ) {
      throw new BadRequestException('compareAtPrice must be greater than or equal to price.');
    }

    const title = dto.title?.trim();
    const slug =
      title !== undefined && title !== course.title
        ? await generateUniqueSlug(title || 'draft-course', async (candidate) => {
            const exists = await this.prisma.course.findFirst({
              where: { slug: candidate, NOT: { id } },
            });
            return Boolean(exists);
          })
        : undefined;
    const nextStatus = CourseStateMachine.resolveNextOnEdit(course.status);
    const fromStatus = course.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.course.update({
        where: { id },
        data: {
          ...dto,
          title,
          slug,
          compareAtPrice: dto.compareAtPrice === undefined ? undefined : dto.compareAtPrice,
          status: nextStatus,
          updatedBy: currentUser.sub,
        },
        include: {
          instructors: true,
          subcategory: true,
          assets: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (nextStatus !== fromStatus) {
        await this.statusHistory.log(tx, {
          courseId: id,
          fromStatus,
          toStatus: nextStatus,
          actorType: CourseStatusActorType.instructor,
          actorId: currentUser.sub,
          reason: 'First edit moved course out of draft',
        });
      }

      return updated;
    });
  }

  async uploadThumbnail(
    id: string,
    currentUser: JwtPayload,
    file: UploadedStorageFile | undefined,
    dto: UploadCourseAssetDto,
  ) {
    return this.uploadCourseAsset(id, currentUser, file, dto, CourseAssetType.thumbnail);
  }

  async uploadPromoVideo(
    id: string,
    currentUser: JwtPayload,
    file: UploadedStorageFile | undefined,
    dto: UploadCourseAssetDto,
  ) {
    return this.uploadCourseAsset(id, currentUser, file, dto, CourseAssetType.promo_video);
  }

  async initiateCourseAssetUpload(
    id: string,
    currentUser: JwtPayload,
    dto: InitiateDirectUploadDto,
    type: CourseAssetType,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);

    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateCourseAssetUploadMetadata(dto.sizeBytes, mimeType, type);

    const storageKey = this.buildStorageKey({
      folder: this.getCourseAssetFolder(id, type),
      originalName: dto.originalName,
    });

    return {
      uploadUrl: await this.storage.createPresignedUploadUrl({
        key: storageKey,
        contentType: mimeType,
        expiresInSec: SIGNED_UPLOAD_EXPIRES_IN_SEC,
      }),
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      storageKey,
      publicUrl: this.storage.buildPublicUrl(storageKey),
      expiresInSec: SIGNED_UPLOAD_EXPIRES_IN_SEC,
      maxBytes: this.getCourseAssetMaxBytes(type),
    };
  }

  async completeCourseAssetUpload(
    id: string,
    currentUser: JwtPayload,
    dto: CompleteDirectUploadDto,
    type: CourseAssetType,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);

    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateCourseAssetUploadMetadata(dto.sizeBytes, mimeType, type);
    this.assertCourseAssetStorageKey(id, type, dto.storageKey);
    await this.assertUploadedObject(dto.storageKey, dto.sizeBytes);

    const bucket = this.storage.getBucket();
    const publicUrl = this.storage.buildPublicUrl(dto.storageKey);
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      await tx.courseAsset.updateMany({
        where: {
          courseId: id,
          type,
          deletedAt: null,
        },
        data: {
          status: CourseAssetStatus.deleted,
          deletedAt: now,
          updatedBy: currentUser.sub,
        },
      });

      const asset = await tx.courseAsset.create({
        data: {
          courseId: id,
          type,
          status: CourseAssetStatus.ready,
          storageProvider: 's3',
          bucket,
          storageKey: dto.storageKey,
          publicUrl,
          originalName: dto.originalName,
          mimeType,
          sizeBytes: this.toDatabaseSafeInt(dto.sizeBytes),
          durationSec: dto.durationSec ?? null,
          createdBy: currentUser.sub,
          updatedBy: currentUser.sub,
        },
      });

      const updatedCourse = await tx.course.update({
        where: { id },
        data: {
          ...(type === CourseAssetType.thumbnail
            ? { thumbnailUrl: publicUrl }
            : { trailerUrl: publicUrl }),
          updatedBy: currentUser.sub,
        },
        include: {
          subcategory: { include: { category: true } },
          instructors: true,
          assets: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return { course: updatedCourse, asset };
    });
  }

  private async uploadCourseAsset(
    id: string,
    currentUser: JwtPayload,
    file: UploadedStorageFile | undefined,
    dto: UploadCourseAssetDto,
    type: CourseAssetType,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);
    this.validateCourseAssetFile(file, type);

    const storageKey = this.buildStorageKey({
      folder: this.getCourseAssetFolder(id, type),
      originalName: file.originalname,
    });
    const bucket = this.storage.getBucket();
    const publicUrl = await this.storage.uploadObject({
      key: storageKey,
      body: file.buffer,
      contentType: file.mimetype,
    });
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      await tx.courseAsset.updateMany({
        where: {
          courseId: id,
          type,
          deletedAt: null,
        },
        data: {
          status: CourseAssetStatus.deleted,
          deletedAt: now,
          updatedBy: currentUser.sub,
        },
      });

      const asset = await tx.courseAsset.create({
        data: {
          courseId: id,
          type,
          status: CourseAssetStatus.ready,
          storageProvider: 's3',
          bucket,
          storageKey,
          publicUrl,
          originalName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: this.toDatabaseSafeInt(file.size),
          durationSec: dto.durationSec ?? null,
          createdBy: currentUser.sub,
          updatedBy: currentUser.sub,
        },
      });

      const updatedCourse = await tx.course.update({
        where: { id },
        data: {
          ...(type === CourseAssetType.thumbnail
            ? { thumbnailUrl: publicUrl }
            : { trailerUrl: publicUrl }),
          updatedBy: currentUser.sub,
        },
        include: {
          subcategory: { include: { category: true } },
          instructors: true,
          assets: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return { course: updatedCourse, asset };
    });
  }

  async approveCourse(id: string, currentUser: JwtPayload) {
    return this.transitionByAdmin(id, currentUser, {
      action: 'admin_approve',
      toStatus: CourseStatus.approved,
      data: { approvedAt: new Date(), rejectedReason: null, changesRequested: null },
      reason: 'Course approved by admin',
    });
  }

  async rejectCourse(id: string, currentUser: JwtPayload, dto: RejectCourseDto) {
    const reason = dto.reason.trim();
    if (!reason) {
      throw new BadRequestException('Reject reason is required.');
    }

    return this.transitionByAdmin(id, currentUser, {
      action: 'admin_reject',
      toStatus: CourseStatus.rejected,
      data: {
        rejectedReason: reason,
        changesRequested: null,
        approvedAt: null,
        publishedAt: null,
      },
      reason,
    });
  }

  async requestChanges(id: string, currentUser: JwtPayload, reason: string) {
    return this.transitionByAdmin(id, currentUser, {
      action: 'admin_request_changes',
      toStatus: CourseStatus.changes_requested,
      data: { changesRequested: reason },
      reason,
    });
  }

  async publishCourse(id: string, currentUser: JwtPayload) {
    return this.transitionByAdmin(id, currentUser, {
      action: 'publish',
      toStatus: CourseStatus.published,
      data: { publishedAt: new Date() },
      reason: 'Course published',
    });
  }

  async approveAndPublishCourse(id: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    CourseStateMachine.assertCanPerform('admin_approve', course.status);

    const decidedAt = new Date();

    return this.prisma.$transaction(async (tx) => {
      await this.publishCourseLectures(tx, id);

      const updated = await tx.course.update({
        where: { id },
        data: {
          status: CourseStatus.published,
          approvedAt: decidedAt,
          publishedAt: decidedAt,
          rejectedReason: null,
          changesRequested: null,
          updatedBy: currentUser.sub,
        },
      });

      await this.syncActiveSubmissionDecision(
        tx,
        id,
        currentUser.sub,
        CourseReviewSubmissionStatus.approved,
        'Course approved and published to EduPath.',
        decidedAt,
      );

      await this.statusHistory.log(tx, {
        courseId: id,
        fromStatus: course.status,
        toStatus: CourseStatus.approved,
        actorType: CourseStatusActorType.admin,
        actorId: currentUser.sub,
        reason: 'Course approved by admin',
        metadata: { publishedImmediately: true },
      });

      await this.statusHistory.log(tx, {
        courseId: id,
        fromStatus: CourseStatus.approved,
        toStatus: CourseStatus.published,
        actorType: CourseStatusActorType.admin,
        actorId: currentUser.sub,
        reason: 'Course published to EduPath',
        metadata: { publishedImmediately: true },
      });

      return updated;
    });
  }

  async archiveCourse(id: string, currentUser: JwtPayload) {
    return this.transitionByAdmin(id, currentUser, {
      action: 'archive',
      toStatus: CourseStatus.archived,
      data: {},
      reason: 'Course archived',
    });
  }

  private async transitionByAdmin(
    id: string,
    currentUser: JwtPayload,
    opts: {
      action: Parameters<typeof CourseStateMachine.assertCanPerform>[0];
      toStatus: CourseStatus;
      data: Prisma.CourseUpdateInput;
      reason: string;
    },
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    CourseStateMachine.assertCanPerform(opts.action, course.status);

    return this.prisma.$transaction(async (tx) => {
      if (opts.toStatus === CourseStatus.published) {
        await this.publishCourseLectures(tx, id);
      }

      const updated = await tx.course.update({
        where: { id },
        data: { ...opts.data, status: opts.toStatus, updatedBy: currentUser.sub },
      });

      const submissionStatus = this.resolveSubmissionStatusForAdminAction(opts.action);
      if (submissionStatus) {
        await this.syncActiveSubmissionDecision(
          tx,
          id,
          currentUser.sub,
          submissionStatus,
          opts.reason,
          new Date(),
        );
      }

      await this.statusHistory.log(tx, {
        courseId: id,
        fromStatus: course.status,
        toStatus: opts.toStatus,
        actorType: CourseStatusActorType.admin,
        actorId: currentUser.sub,
        reason: opts.reason,
      });
      return updated;
    });
  }

  private resolveSubmissionStatusForAdminAction(
    action: Parameters<typeof CourseStateMachine.assertCanPerform>[0],
  ): CourseReviewSubmissionStatus | null {
    switch (action) {
      case 'admin_approve':
        return CourseReviewSubmissionStatus.approved;
      case 'admin_request_changes':
        return CourseReviewSubmissionStatus.changes_requested;
      case 'admin_reject':
        return CourseReviewSubmissionStatus.rejected;
      default:
        return null;
    }
  }

  private async publishCourseLectures(
    tx: Prisma.TransactionClient,
    courseId: string,
  ): Promise<void> {
    await tx.lecture.updateMany({
      where: {
        section: {
          courseId,
        },
      },
      data: { isPublished: true },
    });

    const duration = await tx.lecture.aggregate({
      where: {
        isPublished: true,
        section: {
          courseId,
        },
      },
      _sum: { durationSec: true },
    });

    await tx.course.update({
      where: { id: courseId },
      data: { totalDurationSec: duration._sum.durationSec ?? 0 },
    });
  }

  private async syncActiveSubmissionDecision(
    tx: Prisma.TransactionClient,
    courseId: string,
    reviewedBy: string,
    status: CourseReviewSubmissionStatus,
    decisionNote: string,
    reviewedAt: Date,
  ): Promise<void> {
    const activeSubmission = await tx.courseReviewSubmission.findFirst({
      where: {
        courseId,
        status: {
          in: [CourseReviewSubmissionStatus.pending, CourseReviewSubmissionStatus.in_review],
        },
      },
      orderBy: { version: 'desc' },
    });

    if (!activeSubmission) {
      return;
    }

    await tx.courseReviewSubmission.update({
      where: { id: activeSubmission.id },
      data: {
        status,
        reviewedBy,
        reviewedAt,
        decisionNote,
      },
    });
  }

  async softDeleteCourse(id: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('soft_delete', course.status);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.course.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: CourseStatus.archived,
          updatedBy: currentUser.sub,
        },
      });
      await this.statusHistory.log(tx, {
        courseId: id,
        fromStatus: course.status,
        toStatus: CourseStatus.archived,
        actorType: CourseStatusActorType.instructor,
        actorId: currentUser.sub,
        reason: 'Soft-deleted by instructor',
      });
      return updated;
    });
  }

  async replaceObjectives(id: string, currentUser: JwtPayload, dto: ReplaceCourseListDto) {
    return this.replaceStringList('objectives', id, currentUser, dto.items);
  }

  async replaceRequirements(id: string, currentUser: JwtPayload, dto: ReplaceCourseListDto) {
    return this.replaceStringList('requirements', id, currentUser, dto.items);
  }

  async replaceTargetAudiences(id: string, currentUser: JwtPayload, dto: ReplaceCourseListDto) {
    return this.replaceStringList('targetAudiences', id, currentUser, dto.items);
  }

  async replaceFaqs(id: string, currentUser: JwtPayload, dto: ReplaceCourseFaqsDto) {
    await this.ensureCourseEditable(id, currentUser);

    return this.prisma.$transaction(async (tx) => {
      await tx.courseFAQ.deleteMany({ where: { courseId: id } });

      if (dto.items.length > 0) {
        await tx.courseFAQ.createMany({
          data: dto.items.map((item, index) => ({
            courseId: id,
            question: item.question,
            answer: item.answer,
            order: index + 1,
          })),
        });
      }

      return tx.courseFAQ.findMany({
        where: { courseId: id },
        orderBy: { order: 'asc' },
      });
    });
  }

  async upsertMessage(id: string, currentUser: JwtPayload, dto: UpsertCourseMessageDto) {
    await this.ensureCourseEditable(id, currentUser);

    return this.prisma.courseMessage.upsert({
      where: { courseId: id },
      update: {
        welcomeMessage: dto.welcomeMessage ?? '',
        congratulationsMessage: dto.congratulationsMessage ?? '',
      },
      create: {
        courseId: id,
        welcomeMessage: dto.welcomeMessage ?? '',
        congratulationsMessage: dto.congratulationsMessage ?? '',
      },
    });
  }

  async replaceInstructors(id: string, currentUser: JwtPayload, dto: ReplaceCourseInstructorsDto) {
    await this.ensureCourseEditable(id, currentUser);

    if (
      !this.hasRole(currentUser, ROLES.ADMIN) &&
      !dto.items.some((item) => item.instructorId === currentUser.sub)
    ) {
      throw new BadRequestException('Instructor list must keep the current owner.');
    }

    const requestedPrimaryIndex = dto.items.findIndex((item) => item.isPrimary);
    const primaryIndex = requestedPrimaryIndex >= 0 ? requestedPrimaryIndex : 0;
    const normalizedItems = dto.items.map((item, index) => ({
      ...item,
      isPrimary: index === primaryIndex,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.courseInstructor.deleteMany({
        where: { courseId: id },
      });

      await tx.courseInstructor.createMany({
        data: normalizedItems.map((item) => ({
          courseId: id,
          instructorId: item.instructorId,
          displayName: item.displayName,
          avatarUrl: item.avatarUrl ?? '',
          bio: item.bio ?? '',
          isPrimary: item.isPrimary,
        })),
      });

      return tx.courseInstructor.findMany({
        where: { courseId: id },
        orderBy: { isPrimary: 'desc' },
      });
    });
  }

  async getBasicById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructors: {
          where: { isPrimary: true },
        },
      },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  async getLectureProgressSource(courseId: string, lectureId: string) {
    const lecture = await this.prisma.lecture.findFirst({
      where: {
        id: lectureId,
        isPublished: true,
        section: {
          courseId,
          course: {
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        type: true,
        durationSec: true,
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    const totalLectures = await this.prisma.lecture.count({
      where: {
        isPublished: true,
        section: {
          courseId,
          course: {
            deletedAt: null,
          },
        },
      },
    });

    return {
      courseId,
      lectureId: lecture.id,
      lectureType: lecture.type,
      durationSec: lecture.durationSec,
      totalLectures,
    };
  }

  async batchGetBasic(dto: BatchCourseLookupDto) {
    return this.prisma.course.findMany({
      where: {
        id: { in: dto.ids },
        deletedAt: null,
      },
      include: {
        instructors: {
          where: { isPrimary: true },
        },
      },
    });
  }

  async getInternalCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructors: true,
        subcategory: { include: { category: true } },
      },
    });
    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }
    const primaryInstructor =
      course.instructors.find((instructor) => instructor.isPrimary) ?? course.instructors[0];
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      totalStudents: course.totalStudents,
      averageRating: course.averageRating,
      totalReviews: course.totalReviews,
      primaryInstructorId: primaryInstructor?.instructorId ?? null,
      primaryInstructorName: primaryInstructor?.displayName ?? '',
      instructors: course.instructors.map((entry) => ({
        instructorId: entry.instructorId,
        displayName: entry.displayName,
        avatarUrl: entry.avatarUrl,
        isPrimary: entry.isPrimary,
      })),
    };
  }

  async listInternalCoursesByInstructor(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: {
        deletedAt: null,
        instructors: { some: { instructorId } },
      },
      include: {
        instructors: { where: { instructorId } },
      },
      orderBy: [{ totalStudents: 'desc' }, { updatedAt: 'desc' }],
    });

    return courses.map((course) => {
      const relation = course.instructors[0];
      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        status: course.status,
        totalStudents: course.totalStudents,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        isPrimary: relation?.isPrimary ?? false,
      };
    });
  }

  async batchGetFulfillmentSnapshots(dto: BatchCourseLookupDto) {
    if (!dto.ids.length) {
      return [];
    }

    const courses = await this.prisma.course.findMany({
      where: {
        id: { in: dto.ids },
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
        sections: {
          select: {
            lectures: {
              select: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    return courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      totalLectures: course.sections.reduce(
        (sum, section) => sum + section.lectures.filter((lecture) => lecture.isPublished).length,
        0,
      ),
    }));
  }

  async recomputeAggregates(courseId: string, currentUser?: JwtPayload) {
    if (currentUser) {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: { instructors: true },
      });

      if (!course || course.deletedAt) {
        throw new NotFoundException('Course not found.');
      }

      this.assertCourseOwnership(course, currentUser);
    }

    const [reviews, sections] = await this.prisma.$transaction([
      this.prisma.courseReview.findMany({
        where: {
          courseId,
          isVisible: true,
        },
        select: {
          rating: true,
        },
      }),
      this.prisma.section.findMany({
        where: { courseId },
        include: {
          lectures: {
            where: { isPublished: true },
            select: { durationSec: true },
          },
        },
      }),
    ]);

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

    const totalDurationSec = sections.reduce(
      (sum, section) =>
        sum + section.lectures.reduce((sectionSum, lecture) => sectionSum + lecture.durationSec, 0),
      0,
    );

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        averageRating,
        totalReviews,
        totalDurationSec,
      },
    });
  }

  async enqueueRecompute(courseId: string) {
    return this.jobsService.enqueueCourseStatsRecompute(courseId);
  }

  private buildAdminCourseWhere(query: QueryAdminCoursesDto): Prisma.CourseWhereInput {
    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
    };

    const search = query.search ?? query.q;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          instructors: {
            some: {
              displayName: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.categorySlug) {
      where.subcategory = {
        is: {
          category: {
            is: {
              slug: query.categorySlug,
            },
          },
        },
      };
    }

    return where;
  }

  private buildAdminCourseOrderBy(
    query: QueryAdminCoursesDto,
  ): Prisma.CourseOrderByWithRelationInput {
    return {
      [query.sortBy]: query.order,
    };
  }

  private toAdminCourseListItem(course: CourseWithAdminRelations) {
    const totalLectures = course.sections.reduce(
      (sum, section) => sum + section.lectures.length,
      0,
    );
    const primaryInstructor =
      course.instructors.find((instructor) => instructor.isPrimary) ?? course.instructors[0];

    const { sections: _sections, ...courseWithoutSections } = course;

    return {
      ...courseWithoutSections,
      totalLectures,
      instructorName: primaryInstructor?.displayName ?? '',
      categoryId: course.subcategory?.category.id ?? null,
      categoryName: course.subcategory?.category.name ?? null,
      categorySlug: course.subcategory?.category.slug ?? null,
      subcategoryName: course.subcategory?.name ?? null,
      subcategorySlug: course.subcategory?.slug ?? null,
    };
  }

  private resolveListOrder(sort: QueryCoursesDto['sort']): Prisma.CourseOrderByWithRelationInput {
    switch (sort) {
      case 'priceAsc':
        return { price: 'asc' };
      case 'priceDesc':
        return { price: 'desc' };
      case 'rating':
        return { averageRating: 'desc' };
      case 'popular':
        return { totalStudents: 'desc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  private async replaceStringList(
    type: 'objectives' | 'requirements' | 'targetAudiences',
    courseId: string,
    currentUser: JwtPayload,
    items: string[],
  ) {
    await this.ensureCourseEditable(courseId, currentUser);

    return this.prisma.$transaction(async (tx) => {
      if (type === 'objectives') {
        await tx.courseObjective.deleteMany({ where: { courseId } });
        if (items.length > 0) {
          await tx.courseObjective.createMany({
            data: items.map((content, index) => ({
              courseId,
              content,
              order: index + 1,
            })),
          });
        }

        return tx.courseObjective.findMany({
          where: { courseId },
          orderBy: { order: 'asc' },
        });
      }

      if (type === 'requirements') {
        await tx.courseRequirement.deleteMany({ where: { courseId } });
        if (items.length > 0) {
          await tx.courseRequirement.createMany({
            data: items.map((content, index) => ({
              courseId,
              content,
              order: index + 1,
            })),
          });
        }

        return tx.courseRequirement.findMany({
          where: { courseId },
          orderBy: { order: 'asc' },
        });
      }

      await tx.courseTargetAudience.deleteMany({ where: { courseId } });
      if (items.length > 0) {
        await tx.courseTargetAudience.createMany({
          data: items.map((content, index) => ({
            courseId,
            content,
            order: index + 1,
          })),
        });
      }

      return tx.courseTargetAudience.findMany({
        where: { courseId },
        orderBy: { order: 'asc' },
      });
    });
  }

  private async ensureCourseEditable(courseId: string, currentUser: JwtPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    this.assertCourseOwnership(course, currentUser);
    CourseStateMachine.assertCanPerform('edit', course.status);
  }

  private async assertSubcategoryExists(subcategoryId: string) {
    const exists = await this.prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      select: { id: true },
    });

    if (!exists) {
      throw new BadRequestException('Selected subcategory does not exist.');
    }
  }

  private getCourseAssetFolder(id: string, type: CourseAssetType): string {
    return type === CourseAssetType.thumbnail
      ? `courses/${id}/thumbnail`
      : `courses/${id}/promo-video`;
  }

  private getCourseAssetMaxBytes(type: CourseAssetType): number {
    return type === CourseAssetType.thumbnail ? MAX_THUMBNAIL_BYTES : MAX_PROMO_VIDEO_BYTES;
  }

  private validateCourseAssetUploadMetadata(
    sizeBytes: number,
    mimeType: string,
    type: CourseAssetType,
  ): void {
    const allowedTypes =
      type === CourseAssetType.thumbnail
        ? COURSE_THUMBNAIL_MIME_TYPES
        : COURSE_PROMO_VIDEO_MIME_TYPES;
    const maxBytes = this.getCourseAssetMaxBytes(type);

    if (!allowedTypes.has(mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${mimeType}.`);
    }

    if (sizeBytes > maxBytes) {
      throw new BadRequestException('Uploaded file exceeds the allowed size limit.');
    }
  }

  private assertCourseAssetStorageKey(id: string, type: CourseAssetType, storageKey: string): void {
    const expectedPrefix = `${this.getCourseAssetFolder(id, type)}/`;
    if (!storageKey.startsWith(expectedPrefix)) {
      throw new BadRequestException('Upload key does not belong to this course asset.');
    }
  }

  private validateCourseAssetFile(
    file: UploadedStorageFile | undefined,
    type: CourseAssetType,
  ): asserts file is UploadedStorageFile {
    if (!file) {
      throw new BadRequestException('Upload file is required.');
    }

    const allowedTypes =
      type === CourseAssetType.thumbnail
        ? COURSE_THUMBNAIL_MIME_TYPES
        : COURSE_PROMO_VIDEO_MIME_TYPES;
    const maxBytes =
      type === CourseAssetType.thumbnail ? MAX_THUMBNAIL_BYTES : MAX_PROMO_VIDEO_BYTES;

    if (!allowedTypes.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}.`);
    }

    if (file.size > maxBytes) {
      throw new BadRequestException('Uploaded file exceeds the allowed size limit.');
    }
  }

  private async assertUploadedObject(storageKey: string, expectedSizeBytes: number): Promise<void> {
    try {
      const metadata = await this.storage.headObject(storageKey);
      if (
        typeof metadata.contentLength === 'number' &&
        metadata.contentLength !== expectedSizeBytes
      ) {
        throw new BadRequestException('Uploaded object size does not match the upload request.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Uploaded object was not found in storage.');
    }
  }

  private resolveUploadMimeType(originalName: string, mimeType: string): string {
    const normalizedMimeType = mimeType.trim().toLowerCase();
    if (normalizedMimeType && normalizedMimeType !== 'application/octet-stream') {
      return normalizedMimeType;
    }

    switch (extname(originalName).toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      case '.mp4':
        return 'video/mp4';
      case '.webm':
        return 'video/webm';
      case '.mov':
        return 'video/quicktime';
      default:
        return normalizedMimeType || 'application/octet-stream';
    }
  }

  private toDatabaseSafeInt(value: number): number | null {
    return value <= DATABASE_SAFE_INT_MAX ? value : null;
  }

  private buildStorageKey(params: { folder: string; originalName: string }): string {
    const extension = extname(params.originalName).toLowerCase();
    const safeName = params.originalName
      .replace(extension, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    return `${params.folder}/${randomUUID()}${safeName ? `-${safeName}` : ''}${extension}`;
  }

  private assertCourseOwnership(
    course: { instructors: Array<{ instructorId: string }>; deletedAt: Date | null },
    currentUser: JwtPayload,
  ): void {
    if (this.hasRole(currentUser, ROLES.ADMIN)) {
      return;
    }

    const ownsCourse = course.instructors.some(
      (instructor) => instructor.instructorId === currentUser.sub,
    );

    if (!ownsCourse) {
      throw new ForbiddenException('You can only manage your own courses.');
    }
  }

  private hasRole(currentUser: JwtPayload, role: string): boolean {
    const userRoles = new Set([
      ...(currentUser.roles ?? []),
      ...(currentUser.role ? [currentUser.role] : []),
    ]);

    return userRoles.has(role);
  }
}
