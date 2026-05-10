import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CoursesService } from './courses.service';
import { QueryCoursesDto } from './dto/query-courses.dto';

@ApiTags('Public Courses')
@Controller('courses')
export class PublicCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  listCourses(@Query() query: QueryCoursesDto) {
    return this.coursesService.listPublicCourses(query);
  }

  @Public()
  @Get(':identifier')
  getCourse(@Param('identifier') identifier: string) {
    return this.coursesService.getPublicCourse(identifier);
  }
}
