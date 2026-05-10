import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
import { RequireRoles } from '../../../common/decorators/roles.decorator';
import { Roles } from '../../../common/constants/roles.constant';
import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';
import { QueryWishlistDto } from '../dto/query-wishlist.dto';
import { WishlistService } from '../services/wishlist.service';

@ApiTags('My Wishlist')
@ApiBearerAuth()
@RequireRoles(Roles.STUDENT, Roles.ADMIN)
@Controller('my/wishlist')
export class MyWishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  listMine(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryWishlistDto) {
    return this.wishlistService.listMyWishlist(user!.sub, query);
  }

  @Post()
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(user!.sub, dto);
  }

  @Delete(':courseId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('courseId') courseId: string) {
    return this.wishlistService.removeFromWishlist(user!.sub, courseId);
  }
}
