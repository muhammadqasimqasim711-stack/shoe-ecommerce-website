import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FREE_SHIPPING_THRESHOLD,
  computeDiscount,
  standardShippingAmount,
  validateCoupon,
} from '../common/checkout-pricing';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create() {
    const cart = await this.prisma.cart.create({ data: {} });
    return { id: cart.id };
  }

  async findOne(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: this.cartInclude(),
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    return this.formatCart(cart);
  }

  async addItem(cartId: string, variantId: string, quantity: number) {
    await this.ensureCart(cartId);

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId, variantId },
    });

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId, variantId, quantity },
      });
    }

    return this.findOne(cartId);
  }

  async updateItem(cartId: string, itemId: string, quantity: number) {
    await this.ensureCartItem(cartId, itemId);

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.findOne(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    await this.ensureCartItem(cartId, itemId);

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.findOne(cartId);
  }

  async applyCoupon(cartId: string, code: string) {
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

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { couponId: coupon!.id },
    });

    return this.findOne(cartId);
  }

  async removeCoupon(cartId: string) {
    await this.ensureCart(cartId);
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { couponId: null },
    });
    return this.findOne(cartId);
  }

  private async ensureCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }
  }

  private async ensureCartItem(cartId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
    });
    if (!item) {
      throw new NotFoundException(`Cart item ${itemId} not found`);
    }
  }

  private cartInclude() {
    return {
      coupon: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { brand: true, images: true },
              },
            },
          },
        },
      },
    } as const;
  }

  private formatCart(cart: Awaited<ReturnType<typeof this.findOneRaw>>) {
    const items = cart.items.map((item) => {
      const product = item.variant.product;
      const unitPrice = Number(product.price) + Number(item.variant.priceOffset);
      return {
        id: item.id,
        quantity: item.quantity,
        variantId: item.variantId,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand?.name ?? 'SOLE',
          img: product.images[0]?.url ?? '',
          size: item.variant.size,
          color: item.variant.color,
        },
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const { discount, freeShipping, code } = computeDiscount(cart.coupon, subtotal);
    const shippingEstimate = standardShippingAmount(subtotal, freeShipping);
    const total = Math.round((subtotal - discount + shippingEstimate) * 100) / 100;

    return {
      id: cart.id,
      itemCount,
      subtotal,
      discount,
      shippingEstimate,
      total: Math.max(0, total),
      couponCode: code,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShipping: subtotal >= FREE_SHIPPING_THRESHOLD || freeShipping,
      items,
    };
  }

  private findOneRaw(cartId: string) {
    return this.prisma.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: this.cartInclude(),
    });
  }
}
