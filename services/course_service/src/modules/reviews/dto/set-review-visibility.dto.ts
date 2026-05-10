import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetReviewVisibilityDto {
  @ApiProperty()
  @IsBoolean()
  isVisible!: boolean;
}
