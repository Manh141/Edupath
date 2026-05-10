import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { assertSameCurrency } from '../../common/utils/currency.util';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CouponsService } from '../coupons/coupons.service';
import { CourseCatalogService, SellableCourseSnapshot } from './course-catalog.service';

export interface TrustedCartItem {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseThumbnailUrl: string;
  instructorName: string;
  unitPrice: number;
  currency: string;
  totalLectures: number;
}

export interface ValidatedCheckoutCart {
  cartId: string;
  couponCode?: string | null;
  currency: string;
  items: TrustedCartItem[];
}

@Injectable()
export class CartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponsService: CouponsService,
    private readonly courseCatalogService: CourseCatalogService,
  ) {}

  async getActiveCart(userId: string) {
    const cart = await this.findOrCreateActiveCart(userId);

    const activeCart = await this.prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { items: true },
    });

    return this.toCartResponse(activeCart);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.findOrCreateActiveCart(userId);
    const course = await this.courseCatalogService.getSellableCourseById(dto.courseId);
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: { courseId: true, currency: true },
    });

    const existingCurrencies = cartItems
      .filter((item) => item.courseId !== course.id)
      .map((item) => item.currency);

    if (existingCurrencies.length) {
      assertSameCurrency([...existingCurrencies, course.currency]);
    }

    await this.prisma.cartItem.upsert({
      where: { cartId_courseId: { cartId: cart.id, courseId: course.id } },
      update: {
        courseTitle: course.title,
        courseThumbnailUrl: course.thumbnailUrl,
        instructorName: course.instructorName,
        unitPrice: course.unitPrice,
        currency: course.currency,
      },
      create: {
        cartId: cart.id,
        courseId: course.id,
        courseTitle: course.title,
        courseThumbnailUrl: course.thumbnailUrl,
        instructorName: course.instructorName,
        unitPrice: course.unitPrice,
        currency: course.currency,
      },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { currency: course.currency },
    });

    return this.getActiveCart(userId);
  }

  async removeItem(userId: string, courseId: string) {
    const cart = await this.findOrCreateActiveCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, courseId } });
    return this.getActiveCart(userId);
  }

  async applyCoupon(userId: string, code: string) {
    const cart = await this.findOrCreateActiveCart(userId);
    await this.couponsService.validateCouponOrThrow(code);
    await this.prisma.cart.update({ where: { id: cart.id }, data: { couponCode: code } });
    return this.getActiveCart(userId);
  }

  async clearCoupon(userId: string) {
    const cart = await this.findOrCreateActiveCart(userId);
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: null },
    });
    return this.getActiveCart(userId);
  }

  async markConverted(cartId: string, orderId: string) {
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { status: 'converted', convertedOrderId: orderId },
    });
  }

  private async findOrCreateActiveCart(userId: string) {
    const existing = await this.prisma.cart.findFirst({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) return existing;
    return this.prisma.cart.create({ data: { userId } });
  }

  async getValidatedCheckoutCart(userId: string): Promise<ValidatedCheckoutCart> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'active' },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!cart || !cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const trustedCourseMap = await this.courseCatalogService.getSellableCoursesByIds(
      cart.items.map((item) => item.courseId),
    );

    const trustedItems = cart.items.map<TrustedCartItem>((item) => {
      const course = trustedCourseMap.get(item.courseId);
      if (!course) {
        throw new NotFoundException(`Course ${item.courseId} not found`);
      }

      return {
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        courseThumbnailUrl: course.thumbnailUrl,
        instructorName: course.instructorName,
        unitPrice: course.unitPrice,
        currency: course.currency,
        totalLectures: course.totalLectures,
      };
    });

    assertSameCurrency(trustedItems.map((item) => item.currency));

    return {
      cartId: cart.id,
      couponCode: cart.couponCode,
      currency: trustedItems[0].currency,
      items: trustedItems,
    };
  }

  private async toCartResponse(cart: {
    id: string;
    userId: string;
    status: string;
    currency: string;
    couponCode: string | null;
    items: Array<{
      courseId: string;
      courseTitle: string;
      courseThumbnailUrl: string;
      instructorName: string;
      unitPrice: number;
      currency: string;
      createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    let courseMap = new Map<string, SellableCourseSnapshot>();

    if (cart.items.length) {
      try {
        courseMap = await this.courseCatalogService.getSellableCoursesByIds(
          cart.items.map((item) => item.courseId),
        );
      } catch {
        courseMap = new Map();
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice, 0);
    const discount = await this.resolveCartDiscount(cart.couponCode, subtotal);

    return {
      ...cart,
      items: cart.items.map((item) => {
        const course = courseMap.get(item.courseId);

        return {
          ...item,
          price: item.unitPrice,
          originalPrice: item.unitPrice,
          course: {
            id: item.courseId,
            slug: course?.slug ?? '',
            title: course?.title ?? item.courseTitle,
            thumbnailUrl: course?.thumbnailUrl ?? item.courseThumbnailUrl ?? null,
            instructorName: course?.instructorName ?? item.instructorName,
            totalLectures: course?.totalLectures ?? undefined,
          },
        };
      }),
      subtotal,
      discount,
      couponDiscount: discount,
      total: Math.max(0, subtotal - discount),
    };
  }

  private async resolveCartDiscount(couponCode: string | null, subtotal: number) {
    if (!couponCode || subtotal <= 0) {
      return 0;
    }

    try {
      const coupon = await this.couponsService.validateCouponOrThrow(couponCode);

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return 0;
      }

      let discount = 0;
      if (coupon.discountPercent) {
        discount = Math.floor((subtotal * coupon.discountPercent) / 100);
      }
      if (coupon.discountAmount) {
        discount = coupon.discountAmount;
      }
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }

      return Math.max(0, Math.min(discount, subtotal));
    } catch {
      return 0;
    }
  }
}
