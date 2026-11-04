import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FREE_SHIPPING_THRESHOLD,
  expressShippingAmount,
  standardShippingAmount,
  computeDiscount,
} from '../common/checkout-pricing';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async getRates(cartId: string, _country: string, _zipCode?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        coupon: true,
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const unit = Number(item.variant.product.price) + Number(item.variant.priceOffset);
      return sum + unit * item.quantity;
    }, 0);

    const { freeShipping } = computeDiscount(cart.coupon, subtotal);

    return {
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      methods: [
        {
          id: 'standard',
          label: 'Standard Shipping',
          amount: standardShippingAmount(subtotal, freeShipping),
          etaDays: 5,
        },
        {
          id: 'express',
          label: 'Express Shipping',
          amount: expressShippingAmount(),
          etaDays: 2,
        },
      ],
    };
  }
}
