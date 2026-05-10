import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { Roles } from '../../common/decorators/roles.decorator';
import { QueryAdminOrdersDto } from './dto/query-admin-orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@Roles(ROLES.ADMIN)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Query() query: QueryAdminOrdersDto) {
    return this.ordersService.listAdminOrders(query);
  }

  @Get('stats')
  stats() {
    return this.ordersService.getAdminOrderStats();
  }

  @Get(':orderId')
  findById(@Param('orderId') orderId: string) {
    return this.ordersService.findOneForAdmin(orderId);
  }
}
