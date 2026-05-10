import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DiscussionTargetType } from '../../../common/prisma/prisma-client';

export class CreateDiscussionDto {
  @ApiProperty({ description: 'Course id the discussion belongs to' })
  @IsString()
  courseId!: string;

  @ApiPropertyOptional({ enum: DiscussionTargetType, default: DiscussionTargetType.course })
  @IsOptional()
  @IsEnum(DiscussionTargetType)
  targetType?: DiscussionTargetType;

  @ApiPropertyOptional({ description: 'Section id when targetType=section' })
  @IsOptional()
  @IsString()
  sectionId?: string;

  @ApiPropertyOptional({ description: 'Lecture id when targetType=lecture' })
  @IsOptional()
  @IsString()
  lectureId?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ minLength: 1, maxLength: 8000 })
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  body!: string;
}
