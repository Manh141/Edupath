import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { CoursesService } from './courses.service';
import { BatchCourseLookupDto } from './dto/batch-course-lookup.dto';

@ApiTags('Internal Courses')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/courses')
export class InternalCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Get authoritative lecture progress source for internal services' })
  @Get(':courseId/lectures/:lectureId/progress-source')
  getLectureProgressSource(
    @Param('courseId') courseId: string,
    @Param('lectureId') lectureId: string,
  ) {
    return this.coursesService.getLectureProgressSource(courseId, lectureId);
  }

  @ApiOperation({ summary: 'Get basic course details by id for internal services' })
  @Get(':id/basic')
  getBasic(@Param('id') id: string) {
    return this.coursesService.getBasicById(id);
  }

  @ApiOperation({ summary: 'Get basic course details in batch for internal services' })
  @Post('batch/basic')
  batchGetBasic(@Body() dto: BatchCourseLookupDto) {
    return this.coursesService.batchGetBasic(dto);
  }

  @ApiOperation({ summary: 'Get enrollment fulfillment snapshots in batch for internal services' })
  @Post('batch/fulfillment-snapshot')
  batchGetFulfillmentSnapshots(@Body() dto: BatchCourseLookupDto) {
    return this.coursesService.batchGetFulfillmentSnapshots(dto);
  }

  @ApiOperation({ summary: 'Enqueue asynchronous course stats recomputation' })
  @Post(':id/recompute-async')
  enqueueRecompute(@Param('id') id: string) {
    return this.coursesService.enqueueRecompute(id);
  }

  @ApiOperation({ summary: 'List courses owned by an instructor for internal services' })
  @Get('by-instructor/:instructorId')
  listByInstructor(@Param('instructorId') instructorId: string) {
    return this.coursesService.listInternalCoursesByInstructor(instructorId);
  }

  @ApiOperation({ summary: 'Get a course (with instructors) for internal services' })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.coursesService.getInternalCourseById(id);
  }
}
