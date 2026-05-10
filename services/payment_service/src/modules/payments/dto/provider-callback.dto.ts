import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../../common/prisma/prisma-client';

export class ProviderCallbackDto {
  @IsString()
  orderId!: string;

  @IsString()
  transactionId!: string;

  @IsString()
  checksum!: string;

  @IsOptional()
  @IsString()
  providerRef?: string;

  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @IsOptional()
  @IsObject()
  rawResponse?: Record<string, unknown>;
}
