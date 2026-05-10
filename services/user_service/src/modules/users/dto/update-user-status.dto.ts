import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../../common/prisma/prisma-client';
import { IsEnum } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.active })
  @IsEnum(UserStatus)
  status!: UserStatus;
}
