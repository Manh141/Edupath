import { ApiProperty } from '@nestjs/swagger';

class DependencyStatusDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ enum: ['up', 'down', 'disabled'] })
  status!: 'up' | 'down' | 'disabled';

  @ApiProperty({ required: false })
  latencyMs?: number;

  @ApiProperty({ required: false })
  message?: string;
}

export class ReadinessResponseDto {
  @ApiProperty()
  service!: string;

  @ApiProperty({ enum: ['ok', 'degraded'] })
  status!: 'ok' | 'degraded';

  @ApiProperty()
  timestamp!: string;

  @ApiProperty({ type: [DependencyStatusDto] })
  dependencies!: DependencyStatusDto[];
}
