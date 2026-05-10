import { IsString } from 'class-validator';

export class ResendAuthCodeDto {
  @IsString()
  challengeId!: string;
}
