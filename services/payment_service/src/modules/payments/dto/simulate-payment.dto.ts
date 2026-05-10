import { IsIn, IsOptional, IsString } from 'class-validator';

export type SimulatePaymentStatus = 'success' | 'failed' | 'cancelled';

export class SimulatePaymentDto {
  @IsIn(['success', 'failed', 'cancelled'])
  status!: SimulatePaymentStatus;

  @IsOptional()
  @IsString()
  providerRef?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}
