import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UploadLectureVideoDto {
  @ApiPropertyOptional({
    description: 'Video duration in seconds, provided by the transcoder or client probe.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationSec?: number;

  @ApiPropertyOptional({ maxLength: 180 })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;
}

export class UploadLectureResourceDto {
  @ApiPropertyOptional({ maxLength: 180 })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;
}
