import {
  Body,
  Controller,
  Delete,
  UploadedFile,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import {
  CompleteDirectUploadDto,
  InitiateDirectUploadDto,
} from '../../common/storage/dto/direct-upload.dto';
import type { UploadedStorageFile } from '../../common/storage/uploaded-file.type';
import { CourseAssetType } from '../../common/prisma/prisma-client';
import { CoursesService } from './courses.service';
import { CourseReviewSubmissionService } from './moderation/course-review-submission.service';
import { CourseStatusHistoryService } from './moderation/course-status-history.service';
import { CourseValidationService } from './validation/course-validation.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryInstructorCoursesDto } from './dto/query-instructor-courses.dto';
import { ReplaceCourseFaqsDto } from './dto/replace-course-faqs.dto';
import { ReplaceCourseInstructorsDto } from './dto/replace-course-instructors.dto';
import { ReplaceCourseListDto } from './dto/replace-course-list.dto';
import { SubmitForReviewDto } from './dto/submit-for-review.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UploadCourseAssetDto } from './dto/upload-course-asset.dto';
import { UpsertCourseMessageDto } from './dto/upsert-course-message.dto';

@ApiTags('Instructor Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor/courses')
export class InstructorCoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly validationService: CourseValidationService,
    private readonly reviewSubmissionService: CourseReviewSubmissionService,
    private readonly statusHistoryService: CourseStatusHistoryService,
  ) {}

  @Get()
  listMine(
    @CurrentUser() currentUser: JwtPayload,
    @Query() query: QueryInstructorCoursesDto,
  ) {
    return this.coursesService.listInstructorCourses(currentUser, query);
  }

  @Post()
  createDraft(@CurrentUser() currentUser: JwtPayload, @Body() dto: CreateCourseDto) {
    return this.coursesService.createDraft(currentUser, dto);
  }

  @Get(':id')
  getCourse(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.getInstructorCourseById(id, currentUser);
  }

  @Patch(':id')
  updateDraft(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateDraft(id, currentUser, dto);
  }

  @Post(':id/assets/thumbnail')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        altText: { type: 'string' },
      },
      required: ['file'],
    },
  })
  uploadThumbnail(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @UploadedFile() file: UploadedStorageFile | undefined,
    @Body() dto: UploadCourseAssetDto,
  ) {
    return this.coursesService.uploadThumbnail(id, currentUser, file, dto);
  }

  @Post(':id/assets/thumbnail/upload-url')
  createThumbnailUploadUrl(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: InitiateDirectUploadDto,
  ) {
    return this.coursesService.initiateCourseAssetUpload(
      id,
      currentUser,
      dto,
      CourseAssetType.thumbnail,
    );
  }

  @Post(':id/assets/thumbnail/complete')
  completeThumbnailUpload(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CompleteDirectUploadDto,
  ) {
    return this.coursesService.completeCourseAssetUpload(
      id,
      currentUser,
      dto,
      CourseAssetType.thumbnail,
    );
  }

  @Post(':id/assets/promo-video')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        durationSec: { type: 'integer', minimum: 0 },
      },
      required: ['file'],
    },
  })
  uploadPromoVideo(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @UploadedFile() file: UploadedStorageFile | undefined,
    @Body() dto: UploadCourseAssetDto,
  ) {
    return this.coursesService.uploadPromoVideo(id, currentUser, file, dto);
  }

  @Post(':id/assets/promo-video/upload-url')
  createPromoVideoUploadUrl(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: InitiateDirectUploadDto,
  ) {
    return this.coursesService.initiateCourseAssetUpload(
      id,
      currentUser,
      dto,
      CourseAssetType.promo_video,
    );
  }

  @Post(':id/assets/promo-video/complete')
  completePromoVideoUpload(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CompleteDirectUploadDto,
  ) {
    return this.coursesService.completeCourseAssetUpload(
      id,
      currentUser,
      dto,
      CourseAssetType.promo_video,
    );
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.softDeleteCourse(id, currentUser);
  }

  @Get(':id/checklist')
  getChecklist(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.assertCanReadAndReturn(id, currentUser, () => this.validationService.getReport(id));
  }

  @Get(':id/status-history')
  getHistory(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.assertCanReadAndReturn(id, currentUser, () =>
      this.statusHistoryService.listForCourse(id),
    );
  }

  @Get(':id/review-submissions')
  listSubmissions(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.reviewSubmissionService.listSubmissions(id, currentUser);
  }

  @Post(':id/submit-review')
  submitForReview(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: SubmitForReviewDto,
  ) {
    return this.reviewSubmissionService.submitForReview(id, currentUser, dto.note);
  }

  private async assertCanReadAndReturn<T>(
    id: string,
    currentUser: JwtPayload,
    fn: () => Promise<T>,
  ): Promise<T> {
    await this.coursesService.getInstructorCourseById(id, currentUser);
    return fn();
  }

  @Put(':id/objectives')
  replaceObjectives(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReplaceCourseListDto,
  ) {
    return this.coursesService.replaceObjectives(id, currentUser, dto);
  }

  @Put(':id/requirements')
  replaceRequirements(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReplaceCourseListDto,
  ) {
    return this.coursesService.replaceRequirements(id, currentUser, dto);
  }

  @Put(':id/target-audiences')
  replaceTargetAudiences(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReplaceCourseListDto,
  ) {
    return this.coursesService.replaceTargetAudiences(id, currentUser, dto);
  }

  @Put(':id/faqs')
  replaceFaqs(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReplaceCourseFaqsDto,
  ) {
    return this.coursesService.replaceFaqs(id, currentUser, dto);
  }

  @Put(':id/message')
  upsertMessage(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpsertCourseMessageDto,
  ) {
    return this.coursesService.upsertMessage(id, currentUser, dto);
  }

  @Put(':id/instructors')
  replaceInstructors(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReplaceCourseInstructorsDto,
  ) {
    return this.coursesService.replaceInstructors(id, currentUser, dto);
  }

  @Post(':id/recompute')
  recompute(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.coursesService.recomputeAggregates(id, currentUser);
  }
}
