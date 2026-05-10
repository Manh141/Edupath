import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CourseInstructorItemDto {
  @ApiProperty()
  @IsString()
  instructorId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  displayName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiProperty()
  @IsBoolean()
  isPrimary!: boolean;
}

export class ReplaceCourseInstructorsDto {
  @ApiProperty({ type: [CourseInstructorItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CourseInstructorItemDto)
  items!: CourseInstructorItemDto[];
}
