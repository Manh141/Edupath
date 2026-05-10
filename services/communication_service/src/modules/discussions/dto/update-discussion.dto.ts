import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DiscussionStatus } from '../../../common/prisma/prisma-client';

export class UpdateDiscussionDto {
  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ minLength: 1, maxLength: 8000 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  body?: string;

  @ApiPropertyOptional({ enum: DiscussionStatus })
  @IsOptional()
  @IsEnum(DiscussionStatus)
  status?: DiscussionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
