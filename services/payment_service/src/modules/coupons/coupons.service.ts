import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCouponDto) {
    if (!dto.discountPercent && !dto.discountAmount) {
      throw new BadRequestException('Coupon must have discountPercent or discountAmount');
    }

    return this.prisma.coupon.create({
      data: {
        ...dto,
        code: dto.code.trim().toUpperCase(),
        isActive: dto.isActive ?? true,
      },
    });
  }

  getByCode(code: string) {
    return this.prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  }

  async validateCouponOrThrow(code: string) {
    const coupon = await this.getByCode(code);
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon inactive');
    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) throw new BadRequestException('Coupon not started');
    if (coupon.endsAt && coupon.endsAt < now) throw new BadRequestException('Coupon expired');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon exhausted');
    }
    return coupon;
  }

  async consumeCoupon(couponId: string) {
    await this.prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
  }
}
