import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ActivateInstructorRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;
}
