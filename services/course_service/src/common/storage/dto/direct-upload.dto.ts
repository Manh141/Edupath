import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class InitiateDirectUploadDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  originalName!: string;

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @MaxLength(120)
  mimeType!: string;

  @ApiProperty({ minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sizeBytes!: number;
}

export class CompleteDirectUploadDto extends InitiateDirectUploadDto {
  @ApiProperty({ maxLength: 600 })
  @IsString()
  @MaxLength(600)
  storageKey!: string;

  @ApiPropertyOptional({
    description: 'Video duration in seconds when the uploaded object is video.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationSec?: number;

  @ApiPropertyOptional({ maxLength: 180 })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;
}
