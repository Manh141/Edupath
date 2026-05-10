import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { COURSE_LIMITS } from '../../../common/constants/course.constants';

export class CourseFaqItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(250)
  question!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  answer!: string;
}

export class ReplaceCourseFaqsDto {
  @ApiProperty({ type: [CourseFaqItemDto] })
  @IsArray()
  @ArrayMaxSize(COURSE_LIMITS.MAX_FAQ_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => CourseFaqItemDto)
  items!: CourseFaqItemDto[];
}
