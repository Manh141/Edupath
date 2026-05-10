import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { CoursePricingTier } from '../../../../common/prisma/prisma-client';

export class UpdateCoursePricingDto {
  @ApiProperty({ enum: CoursePricingTier })
  @IsEnum(CoursePricingTier)
  tier!: CoursePricingTier;

  @ApiProperty({ minimum: 0, description: 'Integer price in the smallest unit of the currency' })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPrice?: number;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @Length(3, 3)
  currency!: string;
}
