import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PayoutAccountProvider } from '../../../common/prisma/prisma-client';

export class ConnectPayoutAccountDto {
  @ApiProperty({ enum: PayoutAccountProvider })
  @IsEnum(PayoutAccountProvider)
  provider!: PayoutAccountProvider;

  @ApiProperty({ description: 'Friendly label shown to the instructor' })
  @IsString()
  @Length(1, 120)
  displayName!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  holderName!: string;

  @ApiProperty({ description: 'IBAN / account number / provider identifier' })
  @IsString()
  @Length(4, 64)
  accountRef!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 32)
  bankCode?: string;

  @ApiPropertyOptional({ minLength: 2, maxLength: 2 })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;

  @ApiPropertyOptional({ minLength: 3, maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}
