import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsString, MaxLength } from 'class-validator';
import { COURSE_LIMITS } from '../../../common/constants/course.constants';

export class ReplaceCourseListDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(COURSE_LIMITS.MAX_STRING_LIST_ITEMS)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  items!: string[];
}
