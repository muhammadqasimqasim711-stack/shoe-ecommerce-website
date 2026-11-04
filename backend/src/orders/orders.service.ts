import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findOne(orderId: string) {
    const order = await this.loadOrder(orderId);
    return this.formatOrder(order);
  }

  async confirmation(orderId: string) {
    const order = await this.loadOrder(orderId);
    const formatted = this.formatOrder(order);
    return {
      orderId: formatted.id,
      status: formatted.status,
      email: formatted.email,
      createdAt: formatted.createdAt,
      items: formatted.items,
      shipping: formatted.shipping,
      payment: formatted.payment,
      totals: formatted.totals,
    };
  }

  async findMine(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: this.orderInclude(),
    });
    return orders.map((order) => this.formatOrder(order));
  }

  private async loadOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: this.orderInclude(),
    });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return order;
  }

  private orderInclude() {
    return {
      payment: true,
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

  private formatOrder(
    order: Awaited<ReturnType<typeof this.loadOrder>>,
  ) {
    const items = order.items.map((item) => ({
      name: item.variant.product.name,
      brand: item.variant.product.brand?.name ?? 'SOLE',
      img: item.variant.product.images[0]?.url ?? '',
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.quantity,
      price: Number(item.price),
    }));

    return {
      id: order.id,
      status: order.status,
      email: order.email,
      createdAt: order.createdAt,
      items,
      shipping: {
        method: order.shippingMethod,
        cost: Number(order.shippingCost),
        address: {
          name: order.shipName,
          line1: order.shipLine1,
          line2: order.shipLine2,
          city: order.shipCity,
          state: order.shipState,
          zipCode: order.shipZip,
          country: order.shipCountry,
        },
      },
      payment: order.payment
        ? {
            provider: order.payment.provider,
            status: order.payment.status,
            amount: Number(order.payment.amount),
          }
        : null,
      totals: {
        subtotal: Number(order.subtotal),
        discount: Number(order.discountAmount),
        shipping: Number(order.shippingCost),
        total: Number(order.totalAmount),
        currency: order.currency,
      },
    };
  }
}
