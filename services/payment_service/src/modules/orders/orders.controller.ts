import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryMyOrdersDto } from './dto/query-my-orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('me/checkout')
  checkout(@CurrentUser() user: CurrentUserInterface, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(user.sub, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: CurrentUserInterface, @Query() query: QueryMyOrdersDto) {
    return this.ordersService.findMyOrders(user.sub, query);
  }

  @Get(':orderId')
  findById(@Param('orderId') orderId: string, @CurrentUser() user: CurrentUserInterface) {
    return this.ordersService.findOneForUser(orderId, user.sub);
  }
}
