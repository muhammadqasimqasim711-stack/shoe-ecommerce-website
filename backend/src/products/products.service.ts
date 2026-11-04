import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCardDto } from './dto/product-card.dto';
import { ProductQueryDto } from './dto/product-query.dto';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    images: true;
    variants: true;
    categories: { include: { category: true } };
    reviews: { select: { rating: true; approved: true } };
  };
}>;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto = {}): Promise<ProductCardDto[]> {
    const where: Prisma.ProductWhereInput = {
      isPublished: true,
      status: { not: 'ARCHIVED' },
    };
    const searchNeedle = query.search?.trim().toLowerCase() ?? '';
    const hasSearch = searchNeedle.length > 0;

    // Search is applied in memory (SQLite has no case-insensitive contains)
    if (query.category) {
      const cats = await this.prisma.category.findMany();
      const needle = query.category.toLowerCase();
      const matched = cats.find(
        (c) => c.id.toLowerCase() === needle || c.name.toLowerCase() === needle,
      );
      where.categories = {
        some: { categoryId: matched?.id ?? '__none__' },
      };
    }

    if (query.brand) {
      const brands = await this.prisma.brand.findMany();
      const matched = brands.find((b) => b.name.toLowerCase() === query.brand!.toLowerCase());
      where.brandId = matched?.id ?? '__none__';
    }

    if (query.collection?.trim()) {
      where.collection = query.collection.trim().toLowerCase();
    }

    if (query.gender) {
      if (query.gender === 'kids') {
        where.gender = 'kids';
      } else if (query.gender === 'unisex') {
        where.gender = 'unisex';
      } else {
        where.gender = { in: [query.gender, 'unisex'] };
      }
    }

    if (query.onSale) {
      where.compareAtPrice = { not: null };
    }

    if (query.days) {
      const since = new Date();
      since.setDate(since.getDate() - query.days);
      where.createdAt = { gte: since };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'price_asc') orderBy = { price: 'asc' };
    if (query.sort === 'price_desc') orderBy = { price: 'desc' };
    if (query.sort === 'trending') orderBy = { createdAt: 'desc' };
    if (query.sort === 'newest') orderBy = { createdAt: 'desc' };

    const limit = query.limit ?? 100;

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      // When searching, fetch all filter matches then slice after in-memory match
      take: hasSearch ? undefined : limit,
      include: {
        brand: true,
        images: true,
        variants: true,
        categories: { include: { category: true } },
        reviews: { select: { rating: true, approved: true } },
      },
    });

    let filtered = products;

    if (hasSearch) {
      filtered = products.filter((p) => this.matchesSearch(p, searchNeedle));
    }

    if (query.onSale) {
      filtered = filtered.filter((p) => {
        if (p.compareAtPrice == null) return false;
        return Number(p.compareAtPrice) > Number(p.price);
      });
    }

    if (hasSearch) {
      filtered = filtered.slice(0, limit);
    }

    return filtered.map((product) => this.toCardDto(product));
  }

  private matchesSearch(product: ProductWithRelations, needle: string): boolean {
    const haystacks: Array<string | null | undefined> = [
      product.name,
      product.description,
      product.sku,
      product.brand?.name,
      ...product.categories.map((c) => c.category.name),
      ...product.categories.map((c) => c.category.id),
    ];

    return haystacks.some((value) => value?.toLowerCase().includes(needle));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: true,
        videos: true,
        variants: true,
        reviews: { include: { user: true } },
        categories: { include: { category: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    if (!product.isPublished || product.status === 'ARCHIVED') {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return {
      ...product,
      card: this.toCardDto(product as ProductWithRelations),
    };
  }

  private toCardDto(product: ProductWithRelations): ProductCardDto {
    const approvedReviews = product.reviews.filter((r) => r.approved);
    const reviewCount = approvedReviews.length;
    const rating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    const colors = [
      ...new Set(
        product.variants
          .map((v) => v.color)
          .filter((c): c is string => Boolean(c && c !== 'Default')),
      ),
    ];

    const price = Number(product.price);
    const compareAt =
      product.compareAtPrice != null ? Number(product.compareAtPrice) : undefined;
    const onSale = compareAt != null && compareAt > price;
    const tag = this.resolveTag(product, onSale, compareAt, price);

    return {
      id: product.id,
      name: product.name,
      brand: product.brand?.name ?? 'SOLE',
      price,
      oldPrice: onSale ? Math.round(compareAt!) : undefined,
      img: product.images[0]?.url ?? '',
      tag,
      colors,
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      defaultVariantId: product.variants[0]?.id,
      gender: product.gender ?? undefined,
    };
  }

  private resolveTag(
    product: ProductWithRelations,
    onSale: boolean,
    compareAt: number | undefined,
    price: number,
  ): string | undefined {
    if (onSale && compareAt) {
      const pct = Math.round(((compareAt - price) / compareAt) * 100);
      return `-${pct}%`;
    }

    const createdAt = product.createdAt.getTime();
    const isNew = Date.now() - createdAt < 1000 * 60 * 60 * 24 * 30;
    if (isNew) return 'New';

    const names = ['Trending', 'Bestseller'];
    const hash = product.name.length % names.length;
    return names[hash];
  }
}
