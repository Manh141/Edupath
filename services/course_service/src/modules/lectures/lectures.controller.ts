import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
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
import { CreateLectureAssetDto } from './dto/create-lecture-asset.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { ReorderLecturesDto } from './dto/reorder-lectures.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { UploadLectureResourceDto, UploadLectureVideoDto } from './dto/upload-lecture-file.dto';
import { LecturesService } from './lectures.service';

@ApiTags('Lectures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('sections/:sectionId/lectures')
  createLecture(
    @Param('sectionId') sectionId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateLectureDto,
  ) {
    return this.lecturesService.createLecture(sectionId, currentUser, dto);
  }

  @Patch('lectures/:lectureId')
  updateLecture(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateLectureDto,
  ) {
    return this.lecturesService.updateLecture(lectureId, currentUser, dto);
  }

  @Delete('lectures/:lectureId')
  deleteLecture(@Param('lectureId') lectureId: string, @CurrentUser() currentUser: JwtPayload) {
    return this.lecturesService.deleteLecture(lectureId, currentUser);
  }

  @Put('sections/:sectionId/lectures/reorder')
  reorderLectures(
    @Param('sectionId') sectionId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReorderLecturesDto,
  ) {
    return this.lecturesService.reorderLectures(sectionId, currentUser, dto);
  }

  @Post('lectures/:lectureId/assets')
  createAsset(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateLectureAssetDto,
  ) {
    return this.lecturesService.createAsset(lectureId, currentUser, dto);
  }

  @Post('lectures/:lectureId/video')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        durationSec: { type: 'integer', minimum: 1 },
        name: { type: 'string' },
      },
      required: ['file'],
    },
  })
  uploadVideo(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @UploadedFile() file: UploadedStorageFile | undefined,
    @Body() dto: UploadLectureVideoDto,
  ) {
    return this.lecturesService.uploadVideo(lectureId, currentUser, file, dto);
  }

  @Post('lectures/:lectureId/video/upload-url')
  createVideoUploadUrl(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: InitiateDirectUploadDto,
  ) {
    return this.lecturesService.initiateVideoUpload(lectureId, currentUser, dto);
  }

  @Post('lectures/:lectureId/video/complete')
  completeVideoUpload(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CompleteDirectUploadDto,
  ) {
    return this.lecturesService.completeVideoUpload(lectureId, currentUser, dto);
  }

  @Post('lectures/:lectureId/resources')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string' },
      },
      required: ['file'],
    },
  })
  uploadResource(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @UploadedFile() file: UploadedStorageFile | undefined,
    @Body() dto: UploadLectureResourceDto,
  ) {
    return this.lecturesService.uploadResource(lectureId, currentUser, file, dto);
  }

  @Post('lectures/:lectureId/resources/upload-url')
  createResourceUploadUrl(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: InitiateDirectUploadDto,
  ) {
    return this.lecturesService.initiateResourceUpload(lectureId, currentUser, dto);
  }

  @Post('lectures/:lectureId/resources/complete')
  completeResourceUpload(
    @Param('lectureId') lectureId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CompleteDirectUploadDto,
  ) {
    return this.lecturesService.completeResourceUpload(lectureId, currentUser, dto);
  }

  @Delete('lecture-assets/:assetId')
  deleteAsset(@Param('assetId') assetId: string, @CurrentUser() currentUser: JwtPayload) {
    return this.lecturesService.deleteAsset(assetId, currentUser);
  }
}
