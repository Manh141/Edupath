import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../../common/prisma/prisma-client';

export class CreateOrderDto {
  @IsEnum(PaymentMethod)
  provider!: PaymentMethod;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
