import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CourseReviewSubmissionStatus } from '../../../common/prisma/prisma-client';

export class QueryReviewSubmissionsDto {
  @ApiPropertyOptional({ enum: CourseReviewSubmissionStatus })
  @IsOptional()
  @IsEnum(CourseReviewSubmissionStatus)
  status?: CourseReviewSubmissionStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
