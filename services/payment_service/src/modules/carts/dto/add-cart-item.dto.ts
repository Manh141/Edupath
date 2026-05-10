import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseTitle?: string;

  @IsOptional()
  @IsString()
  courseThumbnailUrl?: string;

  @IsOptional()
  @IsString()
  instructorName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
