import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { generateUniqueSlug } from '../../common/utils/slug.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        subcategories: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async listSubcategories() {
    return this.prisma.subcategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        category: true,
      },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug =
      dto.slug ||
      (await generateUniqueSlug(dto.name, async (candidate) => {
        const exists = await this.prisma.category.findUnique({ where: { slug: candidate } });
        return Boolean(exists);
      }));

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description ?? '',
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.name && !dto.slug) {
      data.slug = await generateUniqueSlug(dto.name, async (candidate) => {
        const exists = await this.prisma.category.findFirst({
          where: { slug: candidate, NOT: { id } },
        });
        return Boolean(exists);
      });
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async createSubcategory(categoryId: string, dto: CreateSubcategoryDto) {
    const slug =
      dto.slug ||
      (await generateUniqueSlug(dto.name, async (candidate) => {
        const exists = await this.prisma.subcategory.findUnique({ where: { slug: candidate } });
        return Boolean(exists);
      }));

    return this.prisma.subcategory.create({
      data: {
        categoryId,
        name: dto.name,
        slug,
        description: dto.description ?? '',
      },
    });
  }

  async updateSubcategory(id: string, dto: UpdateSubcategoryDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.name && !dto.slug) {
      data.slug = await generateUniqueSlug(dto.name, async (candidate) => {
        const exists = await this.prisma.subcategory.findFirst({
          where: { slug: candidate, NOT: { id } },
        });
        return Boolean(exists);
      });
    }

    return this.prisma.subcategory.update({
      where: { id },
      data,
    });
  }
}
