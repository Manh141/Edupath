import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteCategories?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningGoals?: string[];

  @ApiPropertyOptional({ example: 'Become a full-stack developer' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  learningGoal?: string;

  @ApiPropertyOptional({ example: 'vi' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;
}
