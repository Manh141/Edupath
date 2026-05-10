import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequireRoles } from '../../../common/decorators/roles.decorator';
import { Roles } from '../../../common/constants/roles.constant';
import { IssueCertificateDto } from '../dto/issue-certificate.dto';
import { EnrollmentsService } from '../services/enrollments.service';

@ApiTags('Admin Enrollments')
@ApiBearerAuth()
@RequireRoles(Roles.ADMIN)
@Controller('admin/enrollments')
export class AdminEnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('stats')
  stats() {
    return this.enrollmentsService.getAdminEnrollmentStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.getEnrollmentByIdOrThrow(id);
  }

  @Post('certificate')
  issueCertificate(@Body() dto: IssueCertificateDto) {
    return this.enrollmentsService.issueCertificate(dto);
  }
}
