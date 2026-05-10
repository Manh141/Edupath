import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EnrollmentStatus } from '../../../common/prisma/prisma-client';
import { IsEnum, IsInt, IsOptional, Max, Min, IsIn, IsString } from 'class-validator';

export class QueryMyEnrollmentsDto {
  @ApiPropertyOptional({ enum: EnrollmentStatus })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    default: 'enrolledAt',
    enum: ['enrolledAt', 'updatedAt', 'courseTitle'],
  })
  @IsOptional()
  @IsIn(['enrolledAt', 'updatedAt', 'courseTitle'])
  sortBy: 'enrolledAt' | 'updatedAt' | 'courseTitle' = 'enrolledAt';
}
