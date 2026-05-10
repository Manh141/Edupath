import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateLectureProgressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lectureId!: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  progressSec!: number;

  @ApiPropertyOptional({
    default: 0,
    description: 'Deprecated: authoritative duration is resolved from course_service.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @ApiPropertyOptional({
    default: false,
    description: 'Deprecated: completion is derived server-side from authoritative lecture metadata.',
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Deprecated: total lectures are resolved server-side from course_service.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  totalLectures?: number;
}
