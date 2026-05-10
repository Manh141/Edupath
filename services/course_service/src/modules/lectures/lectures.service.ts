import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { ROLES } from '../../common/constants/roles.constant';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CourseAssetStatus, LectureType, Prisma } from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CompleteDirectUploadDto,
  InitiateDirectUploadDto,
} from '../../common/storage/dto/direct-upload.dto';
import { MinioService } from '../../common/storage/minio.service';
import type { UploadedStorageFile } from '../../common/storage/uploaded-file.type';
import { generateUniqueSlug } from '../../common/utils/slug.util';
import { CourseStateMachine } from '../courses/moderation/course-state-machine';
import { JobsService } from '../jobs/jobs.service';
import { CreateLectureAssetDto } from './dto/create-lecture-asset.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { ReorderLecturesDto } from './dto/reorder-lectures.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { UploadLectureResourceDto, UploadLectureVideoDto } from './dto/upload-lecture-file.dto';

const LECTURE_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const LECTURE_RESOURCE_BLOCKLIST = new Set([
  'application/x-msdownload',
  'application/x-sh',
  'application/x-bat',
]);
const LECTURE_RESOURCE_EXTENSION_BLOCKLIST = new Set([
  '.bat',
  '.cmd',
  '.exe',
  '.msi',
  '.ps1',
  '.sh',
]);
const MAX_LECTURE_VIDEO_BYTES = 5 * 1024 * 1024 * 1024;
const MAX_LECTURE_RESOURCE_BYTES = 100 * 1024 * 1024;
const SIGNED_UPLOAD_EXPIRES_IN_SEC = 15 * 60;
const DATABASE_SAFE_INT_MAX = 2_147_483_647;

@Injectable()
export class LecturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly storage: MinioService,
  ) {}

  async createLecture(sectionId: string, currentUser: JwtPayload, dto: CreateLectureDto) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: { include: { instructors: true } } },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    this.assertOwnership(section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', section.course.status);

    const slug = await generateUniqueSlug(dto.title, async (candidate) => {
      const exists = await this.prisma.lecture.findFirst({
        where: { sectionId, slug: candidate },
      });
      return Boolean(exists);
    });

    const lecture = await this.prisma.$transaction(async (tx) => {
      const maxLecture = await tx.lecture.findFirst({
        where: { sectionId },
        orderBy: { order: 'desc' },
      });

      const created = await tx.lecture.create({
        data: {
          sectionId,
          title: dto.title,
          slug,
          description: dto.description ?? '',
          type: dto.type ?? 'video',
          videoUrl: dto.videoUrl ?? '',
          articleContent: dto.articleContent ?? '',
          transcript: dto.transcript ?? '',
          durationSec: dto.durationSec ?? 0,
          isPreview: dto.isPreview ?? false,
          isPublished: dto.isPublished ?? true,
          order: (maxLecture?.order ?? 0) + 1,
        },
      });

      await this.normalizeLectureOrders(tx, sectionId);

      return tx.lecture.findUniqueOrThrow({
        where: { id: created.id },
      });
    });

    await this.jobsService.enqueueCourseStatsRecompute(section.courseId);
    return lecture;
  }

  async updateLecture(lectureId: string, currentUser: JwtPayload, dto: UpdateLectureDto) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);

    let slug: string | undefined;
    if (dto.title) {
      slug = await generateUniqueSlug(dto.title, async (candidate) => {
        const exists = await this.prisma.lecture.findFirst({
          where: {
            sectionId: lecture.sectionId,
            slug: candidate,
            NOT: { id: lectureId },
          },
        });
        return Boolean(exists);
      });
    }

    const updated = await this.prisma.lecture.update({
      where: { id: lectureId },
      data: {
        ...dto,
        slug,
      },
    });

    await this.jobsService.enqueueCourseStatsRecompute(lecture.section.courseId);
    return updated;
  }

  async deleteLecture(lectureId: string, currentUser: JwtPayload) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);

    await this.prisma.$transaction(async (tx) => {
      await tx.lecture.delete({
        where: { id: lectureId },
      });

      await this.normalizeLectureOrders(tx, lecture.sectionId);
    });

    await this.jobsService.enqueueCourseStatsRecompute(lecture.section.courseId);
    return { deleted: true };
  }

  async reorderLectures(sectionId: string, currentUser: JwtPayload, dto: ReorderLecturesDto) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: {
          include: { instructors: true },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    this.assertOwnership(section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', section.course.status);
    const lectures = await this.prisma.lecture.findMany({
      where: { sectionId },
      select: { id: true },
    });
    const requestedIds = dto.items.map((item) => item.id);
    const requestedIdSet = new Set(requestedIds);

    if (requestedIdSet.size !== requestedIds.length) {
      throw new BadRequestException('Lecture reorder payload contains duplicate ids.');
    }

    if (
      requestedIds.length !== lectures.length ||
      lectures.some((lecture) => !requestedIdSet.has(lecture.id))
    ) {
      throw new BadRequestException(
        'Lecture reorder payload must include every lecture in the section exactly once.',
      );
    }

    const orderedItems = [...dto.items]
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ id: item.id, order: index + 1 }));

    await this.prisma.$transaction(async (tx) => {
      const temporaryOrderBase = -1_000_000_000;
      for (const [index, item] of orderedItems.entries()) {
        await tx.lecture.update({
          where: { id: item.id },
          data: { order: temporaryOrderBase - index },
        });
      }

      for (const item of orderedItems) {
        await tx.lecture.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    });

    return this.prisma.lecture.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
      include: { assets: true },
    });
  }

  async createAsset(lectureId: string, currentUser: JwtPayload, dto: CreateLectureAssetDto) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);

    return this.prisma.lectureAsset.create({
      data: {
        lectureId,
        name: dto.name,
        fileUrl: dto.fileUrl,
        fileType: dto.fileType,
        fileSize: dto.fileSize ?? null,
        storageProvider: 'external',
        mimeType: dto.fileType,
        status: CourseAssetStatus.ready,
        createdBy: currentUser.sub,
      },
    });
  }

  async uploadVideo(
    lectureId: string,
    currentUser: JwtPayload,
    file: UploadedStorageFile | undefined,
    dto: UploadLectureVideoDto,
  ) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);
    this.validateLectureVideoFile(file);

    const storageKey = this.buildStorageKey({
      folder: this.getLectureUploadFolder(lecture.section.courseId, lectureId, 'video'),
      originalName: file.originalname,
    });
    const bucket = this.storage.getBucket();
    const publicUrl = await this.storage.uploadObject({
      key: storageKey,
      body: file.buffer,
      contentType: file.mimetype,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const asset = await tx.lectureAsset.create({
        data: {
          lectureId,
          name: dto.name ?? file.originalname,
          fileUrl: publicUrl,
          fileType: 'video',
          fileSize: this.toDatabaseSafeInt(file.size),
          storageProvider: 's3',
          bucket,
          storageKey,
          mimeType: file.mimetype,
          durationSec: dto.durationSec ?? null,
          status: CourseAssetStatus.ready,
          createdBy: currentUser.sub,
        },
      });

      const updatedLecture = await tx.lecture.update({
        where: { id: lectureId },
        data: {
          type: LectureType.video,
          videoUrl: publicUrl,
          durationSec: dto.durationSec ?? lecture.durationSec,
        },
        include: { assets: true },
      });

      return { lecture: updatedLecture, asset };
    });

    await this.jobsService.enqueueCourseStatsRecompute(lecture.section.courseId);
    return result;
  }

  async uploadResource(
    lectureId: string,
    currentUser: JwtPayload,
    file: UploadedStorageFile | undefined,
    dto: UploadLectureResourceDto,
  ) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);
    this.validateLectureResourceFile(file);

    const storageKey = this.buildStorageKey({
      folder: this.getLectureUploadFolder(lecture.section.courseId, lectureId, 'resource'),
      originalName: file.originalname,
    });
    const bucket = this.storage.getBucket();
    const publicUrl = await this.storage.uploadObject({
      key: storageKey,
      body: file.buffer,
      contentType: file.mimetype,
    });

    const asset = await this.prisma.lectureAsset.create({
      data: {
        lectureId,
        name: dto.name ?? file.originalname,
        fileUrl: publicUrl,
        fileType: 'resource',
        fileSize: this.toDatabaseSafeInt(file.size),
        storageProvider: 's3',
        bucket,
        storageKey,
        mimeType: file.mimetype,
        status: CourseAssetStatus.ready,
        createdBy: currentUser.sub,
      },
    });

    return asset;
  }

  async initiateVideoUpload(
    lectureId: string,
    currentUser: JwtPayload,
    dto: InitiateDirectUploadDto,
  ) {
    const lecture = await this.getEditableLecture(lectureId, currentUser);
    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateLectureVideoUploadMetadata(dto.sizeBytes, mimeType);

    const storageKey = this.buildStorageKey({
      folder: this.getLectureUploadFolder(lecture.section.courseId, lectureId, 'video'),
      originalName: dto.originalName,
    });

    return this.createDirectUploadResponse(storageKey, mimeType, MAX_LECTURE_VIDEO_BYTES);
  }

  async completeVideoUpload(
    lectureId: string,
    currentUser: JwtPayload,
    dto: CompleteDirectUploadDto,
  ) {
    const lecture = await this.getEditableLecture(lectureId, currentUser);
    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateLectureVideoUploadMetadata(dto.sizeBytes, mimeType);
    this.assertLectureStorageKey(lecture.section.courseId, lectureId, 'video', dto.storageKey);
    await this.assertUploadedObject(dto.storageKey, dto.sizeBytes);

    const bucket = this.storage.getBucket();
    const publicUrl = this.storage.buildPublicUrl(dto.storageKey);

    const result = await this.prisma.$transaction(async (tx) => {
      const asset = await tx.lectureAsset.create({
        data: {
          lectureId,
          name: dto.name ?? dto.originalName,
          fileUrl: publicUrl,
          fileType: 'video',
          fileSize: this.toDatabaseSafeInt(dto.sizeBytes),
          storageProvider: 's3',
          bucket,
          storageKey: dto.storageKey,
          mimeType,
          durationSec: dto.durationSec ?? null,
          status: CourseAssetStatus.ready,
          createdBy: currentUser.sub,
        },
      });

      const updatedLecture = await tx.lecture.update({
        where: { id: lectureId },
        data: {
          type: LectureType.video,
          videoUrl: publicUrl,
          durationSec: dto.durationSec ?? lecture.durationSec,
        },
        include: { assets: true },
      });

      return { lecture: updatedLecture, asset };
    });

    await this.jobsService.enqueueCourseStatsRecompute(lecture.section.courseId);
    return result;
  }

  async initiateResourceUpload(
    lectureId: string,
    currentUser: JwtPayload,
    dto: InitiateDirectUploadDto,
  ) {
    const lecture = await this.getEditableLecture(lectureId, currentUser);
    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateLectureResourceUploadMetadata(dto.originalName, dto.sizeBytes, mimeType);

    const storageKey = this.buildStorageKey({
      folder: this.getLectureUploadFolder(lecture.section.courseId, lectureId, 'resource'),
      originalName: dto.originalName,
    });

    return this.createDirectUploadResponse(storageKey, mimeType, MAX_LECTURE_RESOURCE_BYTES);
  }

  async completeResourceUpload(
    lectureId: string,
    currentUser: JwtPayload,
    dto: CompleteDirectUploadDto,
  ) {
    const lecture = await this.getEditableLecture(lectureId, currentUser);
    const mimeType = this.resolveUploadMimeType(dto.originalName, dto.mimeType);
    this.validateLectureResourceUploadMetadata(dto.originalName, dto.sizeBytes, mimeType);
    this.assertLectureStorageKey(lecture.section.courseId, lectureId, 'resource', dto.storageKey);
    await this.assertUploadedObject(dto.storageKey, dto.sizeBytes);

    return this.prisma.lectureAsset.create({
      data: {
        lectureId,
        name: dto.name ?? dto.originalName,
        fileUrl: this.storage.buildPublicUrl(dto.storageKey),
        fileType: 'resource',
        fileSize: this.toDatabaseSafeInt(dto.sizeBytes),
        storageProvider: 's3',
        bucket: this.storage.getBucket(),
        storageKey: dto.storageKey,
        mimeType,
        status: CourseAssetStatus.ready,
        createdBy: currentUser.sub,
      },
    });
  }

  async deleteAsset(assetId: string, currentUser: JwtPayload) {
    const asset = await this.prisma.lectureAsset.findUnique({
      where: { id: assetId },
      include: {
        lecture: {
          include: {
            section: {
              include: {
                course: {
                  include: { instructors: true },
                },
              },
            },
          },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Lecture asset not found.');
    }

    this.assertOwnership(asset.lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', asset.lecture.section.course.status);

    await this.prisma.lectureAsset.delete({
      where: { id: assetId },
    });

    return { deleted: true };
  }

  private async getEditableLecture(lectureId: string, currentUser: JwtPayload) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        section: {
          include: {
            course: {
              include: { instructors: true },
            },
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    this.assertOwnership(lecture.section.course.instructors, currentUser);
    CourseStateMachine.assertCanPerform('edit', lecture.section.course.status);

    return lecture;
  }

  private async normalizeLectureOrders(
    tx: Prisma.TransactionClient,
    sectionId: string,
  ): Promise<void> {
    const lectures = await tx.lecture.findMany({
      where: { sectionId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true, order: true },
    });

    const isContiguous = lectures.every((lecture, index) => lecture.order === index + 1);
    if (isContiguous) {
      return;
    }

    const temporaryOrderBase = -1_000_000_000;
    for (const [index, lecture] of lectures.entries()) {
      await tx.lecture.update({
        where: { id: lecture.id },
        data: { order: temporaryOrderBase - index },
      });
    }

    for (const [index, lecture] of lectures.entries()) {
      await tx.lecture.update({
        where: { id: lecture.id },
        data: { order: index + 1 },
      });
    }
  }

  private async createDirectUploadResponse(storageKey: string, mimeType: string, maxBytes: number) {
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
      maxBytes,
    };
  }

  private getLectureUploadFolder(
    courseId: string,
    lectureId: string,
    kind: 'video' | 'resource',
  ): string {
    const suffix = kind === 'video' ? 'video' : 'resources';
    return `courses/${courseId}/lectures/${lectureId}/${suffix}`;
  }

  private assertLectureStorageKey(
    courseId: string,
    lectureId: string,
    kind: 'video' | 'resource',
    storageKey: string,
  ): void {
    const expectedPrefix = `${this.getLectureUploadFolder(courseId, lectureId, kind)}/`;
    if (!storageKey.startsWith(expectedPrefix)) {
      throw new BadRequestException('Upload key does not belong to this lecture.');
    }
  }

  private validateLectureVideoUploadMetadata(sizeBytes: number, mimeType: string): void {
    if (!LECTURE_VIDEO_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(`Unsupported lecture video type: ${mimeType}.`);
    }

    if (sizeBytes > MAX_LECTURE_VIDEO_BYTES) {
      throw new BadRequestException('Lecture video exceeds the allowed size limit.');
    }
  }

  private validateLectureResourceUploadMetadata(
    originalName: string,
    sizeBytes: number,
    mimeType: string,
  ): void {
    if (
      LECTURE_RESOURCE_BLOCKLIST.has(mimeType) ||
      LECTURE_RESOURCE_EXTENSION_BLOCKLIST.has(extname(originalName).toLowerCase())
    ) {
      throw new BadRequestException(`Unsupported lecture resource type: ${mimeType}.`);
    }

    if (sizeBytes > MAX_LECTURE_RESOURCE_BYTES) {
      throw new BadRequestException('Lecture resource exceeds the allowed size limit.');
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
      case '.mp4':
        return 'video/mp4';
      case '.webm':
        return 'video/webm';
      case '.mov':
        return 'video/quicktime';
      case '.pdf':
        return 'application/pdf';
      case '.txt':
        return 'text/plain';
      case '.csv':
        return 'text/csv';
      case '.zip':
        return 'application/zip';
      default:
        return normalizedMimeType || 'application/octet-stream';
    }
  }

  private toDatabaseSafeInt(value: number): number | null {
    return value <= DATABASE_SAFE_INT_MAX ? value : null;
  }

  private assertOwnership(
    instructors: Array<{ instructorId: string }>,
    currentUser: JwtPayload,
  ): void {
    if (currentUser.role === ROLES.ADMIN || currentUser.roles?.includes(ROLES.ADMIN)) {
      return;
    }

    const owns = instructors.some((instructor) => instructor.instructorId === currentUser.sub);
    if (!owns) {
      throw new ForbiddenException('You can only manage your own course lectures.');
    }
  }

  private validateLectureVideoFile(
    file: UploadedStorageFile | undefined,
  ): asserts file is UploadedStorageFile {
    if (!file) {
      throw new BadRequestException('Upload file is required.');
    }

    if (!LECTURE_VIDEO_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported lecture video type: ${file.mimetype}.`);
    }

    if (file.size > MAX_LECTURE_VIDEO_BYTES) {
      throw new BadRequestException('Lecture video exceeds the allowed size limit.');
    }
  }

  private validateLectureResourceFile(
    file: UploadedStorageFile | undefined,
  ): asserts file is UploadedStorageFile {
    if (!file) {
      throw new BadRequestException('Upload file is required.');
    }

    if (
      LECTURE_RESOURCE_BLOCKLIST.has(file.mimetype) ||
      LECTURE_RESOURCE_EXTENSION_BLOCKLIST.has(extname(file.originalname).toLowerCase())
    ) {
      throw new BadRequestException(`Unsupported lecture resource type: ${file.mimetype}.`);
    }

    if (file.size > MAX_LECTURE_RESOURCE_BYTES) {
      throw new BadRequestException('Lecture resource exceeds the allowed size limit.');
    }
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
}
