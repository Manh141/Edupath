import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IssueCertificateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}
