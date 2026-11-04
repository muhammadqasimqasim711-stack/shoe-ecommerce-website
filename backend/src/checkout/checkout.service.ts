import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ShippingMethodId,
  computeTotals,
  validateCoupon,
} from '../common/checkout-pricing';
import { CheckoutAddressDto, PlaceOrderDto } from './dto/checkout.dto';

type JwtUser = { sub: string; email: string; role: string } | null;

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async preview(
    cartId: string,
    shippingMethod: ShippingMethodId,
    couponCode?: string,
  ) {
    const { cart, subtotal, coupon } = await this.loadCartTotals(cartId, couponCode);
    const totals = computeTotals({ subtotal, shippingMethod, coupon });

    const items = cart.items.map((item) => {
      const unitPrice = Number(item.variant.product.price) + Number(item.variant.priceOffset);
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          brand: item.variant.product.brand?.name ?? 'SOLE',
          img: item.variant.product.images[0]?.url ?? '',
          size: item.variant.size,
          color: item.variant.color,
        },
      };
    });

    return {
      cartId,
      items,
      ...totals,
      currency: 'USD',
    };
  }

  async place(dto: PlaceOrderDto, user: JwtUser) {
    const address = await this.resolveAddress(dto, user);
    const { cart, subtotal, coupon } = await this.loadCartTotals(
      dto.cartId,
      dto.couponCode,
    );

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totals = computeTotals({
      subtotal,
      shippingMethod: dto.shippingMethod,
      coupon,
    });

    const order = await this.prisma.order.create({
      data: {
        userId: user?.sub,
        email: dto.email,
        status: 'Pending',
        shippingMethod: dto.shippingMethod,
        shippingCost: totals.shipping,
        discountAmount: totals.discount,
        subtotal: totals.subtotal,
        totalAmount: totals.total,
        currency: 'USD',
        shipName: address.name,
        shipLine1: address.line1,
        shipLine2: address.line2,
        shipCity: address.city,
        shipState: address.state,
        shipZip: address.zipCode,
        shipCountry: address.country,
        couponCode: totals.couponCode,
        cartId: dto.cartId,
        items: {
          create: cart.items.map((item) => {
            const price =
              Number(item.variant.product.price) + Number(item.variant.priceOffset);
            return {
              variantId: item.variantId,
              quantity: item.quantity,
              price,
            };
          }),
        },
        statusEvents: {
          create: { status: 'Pending', note: 'Order placed' },
        },
      },
    });

    return {
      orderId: order.id,
      total: Number(order.totalAmount),
      currency: order.currency,
      status: order.status,
      clientSecret: null,
    };
  }

  private async resolveAddress(dto: PlaceOrderDto, user: JwtUser): Promise<CheckoutAddressDto> {
    if (dto.addressId) {
      if (!user?.sub) {
        throw new BadRequestException('Login required to use a saved address');
      }
      const saved = await this.prisma.address.findFirst({
        where: { id: dto.addressId, userId: user.sub },
      });
      if (!saved) {
        throw new NotFoundException('Address not found');
      }
      return {
        name: [user.email].filter(Boolean).join(' ') || 'Customer',
        line1: saved.line1,
        line2: saved.line2 ?? undefined,
        city: saved.city,
        state: saved.state,
        zipCode: saved.zipCode,
        country: saved.country,
      };
    }

    if (!dto.address) {
      throw new BadRequestException('Shipping address is required');
    }
    return dto.address;
  }

  private async loadCartTotals(cartId: string, couponCode?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        coupon: true,
        items: {
          include: {
            variant: {
              include: {
                product: { include: { brand: true, images: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const unit = Number(item.variant.product.price) + Number(item.variant.priceOffset);
      return sum + unit * item.quantity;
    }, 0);

    let coupon = cart.coupon;
    if (couponCode) {
      const found = await this.prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      const check = validateCoupon(found, subtotal);
      if (!check.ok) {
        throw new BadRequestException(check.reason);
      }
      coupon = found;
    }

    return { cart, subtotal, coupon };
  }
}
