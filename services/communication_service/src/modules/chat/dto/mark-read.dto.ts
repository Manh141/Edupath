import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarkReadDto {
  @ApiPropertyOptional({
    description: 'Mark messages up to and including this message id as read',
  })
  @IsOptional()
  @IsString()
  upToMessageId?: string;
}
