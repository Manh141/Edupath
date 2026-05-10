import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CreateSectionDto } from './dto/create-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('instructor')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  createSection(
    @Param('courseId') courseId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionsService.createSection(courseId, currentUser, dto);
  }

  @Patch('sections/:sectionId')
  updateSection(
    @Param('sectionId') sectionId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionsService.updateSection(sectionId, currentUser, dto);
  }

  @Delete('sections/:sectionId')
  deleteSection(
    @Param('sectionId') sectionId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.sectionsService.deleteSection(sectionId, currentUser);
  }

  @Put('courses/:courseId/sections/reorder')
  reorderSections(
    @Param('courseId') courseId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ReorderSectionsDto,
  ) {
    return this.sectionsService.reorderSections(courseId, currentUser, dto);
  }
}
