import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AcceptPromotionalDto {
  @ApiProperty({ description: 'Whether the instructor opts-in to promotional program' })
  @IsBoolean()
  participate!: boolean;
}
