import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async create() {
    const guest = await this.ensureGuestUser();
    const wishlist = await this.prisma.wishlist.create({
      data: { userId: guest.id },
    });
    return { id: wishlist.id };
  }

  private async ensureGuestUser() {
    const email = 'guest-wishlist@sole.local';
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return existing;

    let role = await this.prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (!role) {
      role = await this.prisma.role.create({
        data: { name: 'CUSTOMER', description: 'Standard customer user' },
      });
    }

    return this.prisma.user.create({
      data: {
        email,
        passwordHash: 'guest-no-login',
        firstName: 'Guest',
        lastName: 'Wishlist',
        roleId: role.id,
      },
    });
  }

  async findOne(wishlistId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { id: wishlistId },
      include: this.wishlistInclude(),
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    return this.formatWishlist(wishlist);
  }

  async addItem(wishlistId: string, variantId: string) {
    await this.ensureWishlist(wishlistId);

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    const existing = await this.prisma.wishlistItem.findFirst({
      where: { wishlistId, variantId },
    });

    if (!existing) {
      await this.prisma.wishlistItem.create({
        data: { wishlistId, variantId },
      });
    }

    return this.findOne(wishlistId);
  }

  async removeItem(wishlistId: string, itemId: string) {
    await this.ensureWishlistItem(wishlistId, itemId);
    await this.prisma.wishlistItem.delete({ where: { id: itemId } });
    return this.findOne(wishlistId);
  }

  async removeByVariant(wishlistId: string, variantId: string) {
    const item = await this.prisma.wishlistItem.findFirst({
      where: { wishlistId, variantId },
    });
    if (!item) {
      throw new NotFoundException(`Wishlist item for variant ${variantId} not found`);
    }
    await this.prisma.wishlistItem.delete({ where: { id: item.id } });
    return this.findOne(wishlistId);
  }

  private async ensureWishlist(wishlistId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({ where: { id: wishlistId } });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }
  }

  private async ensureWishlistItem(wishlistId: string, itemId: string) {
    const item = await this.prisma.wishlistItem.findFirst({
      where: { id: itemId, wishlistId },
    });
    if (!item) {
      throw new NotFoundException(`Wishlist item ${itemId} not found`);
    }
  }

  private wishlistInclude() {
    return {
      items: {
        orderBy: { id: 'desc' as const },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: true,
                  reviews: { select: { rating: true, approved: true } },
                },
              },
            },
          },
        },
      },
    } as const;
  }

  private formatWishlist(wishlist: {
    id: string;
    items: Array<{
      id: string;
      variantId: string;
      variant: {
        size: string | null;
        color: string | null;
        priceOffset: unknown;
        product: {
          id: string;
          name: string;
          price: unknown;
          compareAtPrice: unknown | null;
          gender: string | null;
          brand: { name: string } | null;
          images: Array<{ url: string }>;
          reviews: Array<{ rating: number; approved: boolean }>;
        };
      };
    }>;
  }) {
    const items = wishlist.items.map((item) => {
      const product = item.variant.product;
      const price = Number(product.price) + Number(item.variant.priceOffset);
      const approved = product.reviews.filter((r) => r.approved);
      const rating =
        approved.length > 0
          ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
          : 0;

      return {
        id: item.id,
        variantId: item.variantId,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand?.name ?? 'SOLE',
          price,
          oldPrice: product.compareAtPrice != null ? Number(product.compareAtPrice) : undefined,
          img: product.images[0]?.url ?? '',
          gender: product.gender ?? undefined,
          rating: Math.round(rating * 10) / 10,
          reviewCount: approved.length || 0,
          colors: [item.variant.color].filter(Boolean) as string[],
          defaultVariantId: item.variantId,
          size: item.variant.size,
          color: item.variant.color,
        },
      };
    });

    return {
      id: wishlist.id,
      itemCount: items.length,
      items,
    };
  }
}
