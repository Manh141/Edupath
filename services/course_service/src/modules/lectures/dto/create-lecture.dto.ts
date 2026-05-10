import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LectureType } from '../../../common/prisma/prisma-client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateLectureDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: LectureType, default: LectureType.video })
  @IsOptional()
  @IsEnum(LectureType)
  type?: LectureType;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsUrl({ require_tld: false })
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  articleContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transcript?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
