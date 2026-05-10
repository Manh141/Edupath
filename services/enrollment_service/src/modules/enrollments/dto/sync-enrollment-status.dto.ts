import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../../../common/prisma/prisma-client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncEnrollmentStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;

  @ApiProperty({ enum: EnrollmentStatus })
  @IsEnum(EnrollmentStatus)
  status!: EnrollmentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
