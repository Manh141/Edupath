import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DiscussionStatus, DiscussionTargetType } from '../../../common/prisma/prisma-client';

export class ListDiscussionsDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by course id (required unless filtering by section/lecture).' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filter by section id' })
  @IsOptional()
  @IsString()
  sectionId?: string;

  @ApiPropertyOptional({ description: 'Filter by lecture id' })
  @IsOptional()
  @IsString()
  lectureId?: string;

  @ApiPropertyOptional({ enum: DiscussionTargetType })
  @IsOptional()
  @IsEnum(DiscussionTargetType)
  targetType?: DiscussionTargetType;

  @ApiPropertyOptional({ enum: DiscussionStatus })
  @IsOptional()
  @IsEnum(DiscussionStatus)
  status?: DiscussionStatus;

  @ApiPropertyOptional({ description: 'Search across title and body', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort: latest | oldest | top',
    default: 'latest',
  })
  @IsOptional()
  @IsString()
  sort?: 'latest' | 'oldest' | 'top';
}
