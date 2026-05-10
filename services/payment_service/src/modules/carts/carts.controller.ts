import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CartsService } from './carts.service';

@ApiTags('Carts')
@ApiBearerAuth()
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('me')
  getMyCart(@CurrentUser() user: CurrentUserInterface) {
    return this.cartsService.getActiveCart(user.sub);
  }

  @Post('me/items')
  addItem(@CurrentUser() user: CurrentUserInterface, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(user.sub, dto);
  }

  @Delete('me/items/:courseId')
  removeItem(@CurrentUser() user: CurrentUserInterface, @Param('courseId') courseId: string) {
    return this.cartsService.removeItem(user.sub, courseId);
  }

  @Patch('me/coupon')
  applyCoupon(@CurrentUser() user: CurrentUserInterface, @Body() dto: ApplyCouponDto) {
    return this.cartsService.applyCoupon(user.sub, dto.code);
  }

  @Delete('me/coupon')
  clearCoupon(@CurrentUser() user: CurrentUserInterface) {
    return this.cartsService.clearCoupon(user.sub);
  }
}
