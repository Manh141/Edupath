import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';
import { QueryWishlistDto } from '../dto/query-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async listMyWishlist(userId: string, query: QueryWishlistDto) {
    const where = { userId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wishlist.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.wishlist.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toWishlistItemResponse(item)),
      total,
      page: query.page,
      limit: query.limit,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async addToWishlist(userId: string, dto: AddToWishlistDto) {
    const courseSlug = dto.courseSlug?.trim();
    const courseTitle = dto.courseTitle?.trim();
    const courseThumbnailUrl = dto.courseThumbnailUrl?.trim();

    const entry = await this.prisma.wishlist.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: dto.courseId,
        },
      },
      create: {
        userId,
        courseId: dto.courseId,
        courseSlug: courseSlug ?? '',
        courseTitle: courseTitle ?? '',
        courseThumbnailUrl: courseThumbnailUrl ?? '',
      },
      update: {
        courseSlug: courseSlug || undefined,
        courseTitle: courseTitle || undefined,
        courseThumbnailUrl: courseThumbnailUrl || undefined,
      },
    });

    return this.toWishlistItemResponse(entry);
  }

  async removeFromWishlist(userId: string, courseId: string) {
    await this.prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return { removed: true };
  }

  private toWishlistItemResponse(item: {
    id: string;
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    courseThumbnailUrl: string;
    createdAt: Date;
  }) {
    return {
      id: item.id,
      courseId: item.courseId,
      addedAt: item.createdAt.toISOString(),
      createdAt: item.createdAt.toISOString(),
      courseSlug: item.courseSlug,
      courseTitle: item.courseTitle,
      courseThumbnailUrl: item.courseThumbnailUrl,
      course: {
        id: item.courseId,
        slug: item.courseSlug,
        title: item.courseTitle,
        thumbnailUrl: item.courseThumbnailUrl || null,
      },
    };
  }
}
