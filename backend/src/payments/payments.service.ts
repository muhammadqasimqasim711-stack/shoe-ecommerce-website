import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getByOrder(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
      throw new NotFoundException(`Payment for order ${orderId} not found`);
    }
    return {
      orderId: payment.orderId,
      provider: payment.provider,
      status: payment.status,
      amount: Number(payment.amount),
      currency: payment.currency,
      providerPaymentId: payment.providerPaymentId,
    };
  }

  async pay(orderId: string, provider: 'mock', cardLast4?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.payment && (order.status === 'Paid' || order.status === 'Confirmed')) {
      return {
        orderId,
        status: order.status,
        payment: {
          provider: order.payment.provider,
          status: order.payment.status,
          amount: Number(order.payment.amount),
        },
      };
    }

    if (order.status !== 'Pending') {
      throw new BadRequestException(`Order cannot be paid in status ${order.status}`);
    }

    if (provider !== 'mock') {
      throw new BadRequestException('Only mock payments are supported');
    }

    const providerPaymentId = `mock_${orderId.slice(0, 8)}_${cardLast4 ?? '4242'}`;

    const payment = await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant) {
          throw new BadRequestException(`Variant ${item.variantId} not found`);
        }
        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${variant.product.name}`,
          );
        }
        const nextStock = variant.stock - item.quantity;
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: nextStock },
        });
        await tx.stockAdjustment.create({
          data: {
            variantId: variant.id,
            previous: variant.stock,
            next: nextStock,
            delta: -item.quantity,
            reason: `Order ${orderId} payment`,
          },
        });

        const threshold = variant.product.lowStockThreshold ?? 5;
        if (nextStock <= 0) {
          await tx.product.update({
            where: { id: variant.productId },
            data: {
              status:
                variant.product.status === 'ARCHIVED' ? 'ARCHIVED' : 'OUT_OF_STOCK',
            },
          });
        } else if (
          variant.product.status === 'OUT_OF_STOCK' &&
          nextStock > 0
        ) {
          await tx.product.update({
            where: { id: variant.productId },
            data: { status: 'ACTIVE', isPublished: true },
          });
        }

        // stash thresholds for notify after tx
        (item as { _nextStock?: number; _threshold?: number; _name?: string })._nextStock =
          nextStock;
        (item as { _threshold?: number })._threshold = threshold;
        (item as { _name?: string })._name = variant.product.name;
      }

      const created = await tx.payment.upsert({
        where: { orderId },
        update: {
          provider: 'mock',
          providerPaymentId,
          amount: order.totalAmount,
          currency: order.currency,
          status: 'Paid',
        },
        create: {
          orderId,
          provider: 'mock',
          providerPaymentId,
          amount: order.totalAmount,
          currency: order.currency,
          status: 'Paid',
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'Confirmed' },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId,
          status: 'Confirmed',
          note: 'Payment captured',
        },
      });

      if (order.couponCode) {
        await tx.coupon.updateMany({
          where: { code: order.couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (order.cartId) {
        await tx.cartItem.deleteMany({ where: { cartId: order.cartId } });
        await tx.cart.update({
          where: { id: order.cartId },
          data: { couponId: null },
        });
      }

      return created;
    });

    await this.notifications.notifyStaff('new_order', 'New paid order', {
      orderId,
      total: Number(order.totalAmount),
    });

    for (const item of order.items) {
      const next = (item as { _nextStock?: number })._nextStock;
      const threshold = (item as { _threshold?: number })._threshold ?? 5;
      const name = (item as { _name?: string })._name ?? 'Product';
      if (next != null && next <= 0) {
        await this.notifications.notifyStaff('out_of_stock', 'Out of stock', {
          product: name,
          variantId: item.variantId,
        });
      } else if (next != null && next <= threshold) {
        await this.notifications.notifyStaff('low_stock', 'Low stock alert', {
          product: name,
          variantId: item.variantId,
          stock: next,
        });
      }
    }

    return {
      orderId,
      status: 'Confirmed',
      payment: {
        provider: payment.provider,
        status: payment.status,
        amount: Number(payment.amount),
      },
    };
  }
}
