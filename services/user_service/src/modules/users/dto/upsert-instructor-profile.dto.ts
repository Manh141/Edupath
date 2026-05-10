import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpsertInstructorProfileDto {
  @ApiProperty({ example: 'Manh Hoang' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  displayName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  about?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'websiteUrl must be a valid URL' })
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'twitterUrl must be a valid URL' })
  twitterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'linkedinUrl must be a valid URL' })
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'youtubeUrl must be a valid URL' })
  youtubeUrl?: string;
}
