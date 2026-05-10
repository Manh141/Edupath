import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';

export class AcceptTermsDto {
  @ApiProperty({ example: 'v1.0' })
  @IsString()
  @Matches(/^v\d+\.\d+$/)
  termsVersion!: string;

  @ApiProperty()
  @IsBoolean()
  accepted!: boolean;
}
