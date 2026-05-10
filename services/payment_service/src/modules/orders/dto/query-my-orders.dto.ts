import { IsEnum, IsOptional, IsIn } from 'class-validator';
import { OrderStatus } from '../../../common/prisma/prisma-client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMyOrdersDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    default: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'paidAt', 'totalAmount', 'newest'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'paidAt', 'totalAmount', 'newest'])
  sortBy: 'createdAt' | 'updatedAt' | 'paidAt' | 'totalAmount' | 'newest' = 'createdAt';
}
