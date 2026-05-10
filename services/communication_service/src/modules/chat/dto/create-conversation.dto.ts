import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ConversationType } from '../../../common/prisma/prisma-client';

export class CreateConversationDto {
  @ApiPropertyOptional({ enum: ConversationType, default: ConversationType.direct })
  @IsOptional()
  @IsEnum(ConversationType)
  type?: ConversationType;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Course ID when type=course' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiProperty({
    type: [String],
    description: 'Other participant user IDs (besides the current user)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  participantIds!: string[];

  @ApiPropertyOptional({
    description: 'Optional initial message to send when creating the conversation',
    maxLength: 4000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  initialMessage?: string;
}
