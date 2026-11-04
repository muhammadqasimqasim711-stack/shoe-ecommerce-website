import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { validateCoupon, computeDiscount } from '../common/checkout-pricing';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const unit = Number(item.variant.product.price) + Number(item.variant.priceOffset);
      return sum + unit * item.quantity;
    }, 0);

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    const check = validateCoupon(coupon, subtotal);
    if (!check.ok) {
      throw new BadRequestException(check.reason);
    }

    const { discount, freeShipping, code: applied } = computeDiscount(coupon, subtotal);
    return {
      valid: true,
      code: applied,
      discountType: coupon!.discountType,
      discount,
      freeShipping,
      subtotal,
    };
  }
}
