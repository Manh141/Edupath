import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const AVATAR_URL_PATTERN =
  /^$|^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$|^https?:\/\/\S+$/;

export class BootstrapUserProfileDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2_000_000)
  @Matches(AVATAR_URL_PATTERN, {
    message: 'avatarUrl must be an http(s) URL or data image URI',
  })
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: 'vi' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;
}
