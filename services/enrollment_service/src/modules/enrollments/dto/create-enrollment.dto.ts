import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseSlug!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseTitle!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseThumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Total lectures snapshot at enrollment time or latest known total',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalLectures?: number;
}
