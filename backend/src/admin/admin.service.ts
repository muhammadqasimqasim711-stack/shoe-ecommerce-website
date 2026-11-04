import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';
import { STAFF_ROLES } from '../common/staff-roles';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CategoryDto,
  CouponDto,
  CreateAdminUserDto,
  CreateBrandDto,
  CreateProductDto,
  CustomerNoteDto,
  ORDER_STATUSES,
  ReorderCategoriesDto,
  ReturnRequestDto,
  SettingsDto,
  StockAdjustDto,
  UpdateAdminUserDto,
  UpdateBrandDto,
  UpdateCustomerDto,
  UpdateProductDto,
  UpdateReturnDto,
  UpdateVariantDto,
} from './dto/admin.dto';

type ProductListParams = {
  search?: string;
  status?: string;
  category?: string;
  brandId?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

type InventoryListParams = {
  search?: string;
  lowStock?: string;
  page?: number;
  limit?: number;
};

type OrderListParams = {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

type CustomerListParams = {
  search?: string;
  segment?: string;
  page?: number;
  limit?: number;
};

type ReviewListParams = {
  approved?: string;
  limit?: number;
};

type ReturnListParams = {
  status?: string;
  limit?: number;
};

type PaymentListParams = {
  status?: string;
  page?: number;
  limit?: number;
};

type AnalyticsParams = {
  range?: string;
  from?: string;
  to?: string;
};

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notifications: NotificationsService,
  ) {}

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  async stats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const notCancelled: Prisma.OrderWhereInput = {
      status: { notIn: ['Cancelled'] },
    };

    const [
      totalSalesAgg,
      todaySalesAgg,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      orderStatusRows,
      salesOrders,
      variants,
      soldItems,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        where: notCancelled,
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { ...notCancelled, createdAt: { gte: startOfToday } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'Pending' } }),
      this.prisma.order.count({ where: { status: 'Delivered' } }),
      this.prisma.user.count({ where: { role: { name: 'CUSTOMER' } } }),
      this.prisma.product.count({ where: { status: { not: 'ARCHIVED' } } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.order.findMany({
        where: { ...notCancelled, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, totalAmount: true },
      }),
      this.prisma.productVariant.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              lowStockThreshold: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.orderItem.findMany({
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  images: { take: 1, orderBy: { sortOrder: 'asc' } },
                },
              },
            },
          },
          order: { select: { status: true } },
        },
      }),
    ]);

    const lowStockVariants = variants.filter(
      (v) => v.stock <= v.product.lowStockThreshold,
    );

    const salesByDay = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      salesByDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const o of salesOrders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (salesByDay.has(key)) {
        salesByDay.set(key, (salesByDay.get(key) ?? 0) + this.num(o.totalAmount));
      }
    }

    const soldByProduct = new Map<
      string,
      { id: string; name: string; sku: string | null; img: string; sold: number }
    >();
    for (const item of soldItems) {
      if (item.order.status === 'Cancelled') continue;
      const p = item.variant.product;
      const cur = soldByProduct.get(p.id) ?? {
        id: p.id,
        name: p.name,
        sku: p.sku,
        img: p.images[0]?.url ?? '',
        sold: 0,
      };
      cur.sold += item.quantity;
      soldByProduct.set(p.id, cur);
    }
    const bestSellingProducts = [...soldByProduct.values()]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    const orderStatusOverview: Record<string, number> = {};
    for (const row of orderStatusRows) {
      orderStatusOverview[row.status] = row._count._all;
    }

    return {
      totalSales: this.num(totalSalesAgg._sum.totalAmount),
      todaySales: this.num(todaySalesAgg._sum.totalAmount),
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts: lowStockVariants.length,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        status: o.status,
        email: o.email,
        user: o.user,
        itemCount: o._count.items,
        totalAmount: this.num(o.totalAmount),
        currency: o.currency,
        createdAt: o.createdAt,
      })),
      bestSellingProducts,
      lowStockList: lowStockVariants.slice(0, 10).map((v) => ({
        variantId: v.id,
        productId: v.product.id,
        productName: v.product.name,
        sku: v.sku ?? v.product.sku,
        size: v.size,
        color: v.color,
        stock: v.stock,
        threshold: v.product.lowStockThreshold,
      })),
      salesOverview: [...salesByDay.entries()].map(([date, revenue]) => ({
        date,
        revenue,
      })),
      orderStatusOverview,
    };
  }

  // ---------------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------------

  async listProducts(params: ProductListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 200);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (params.brandId) where.brandId = params.brandId;

    if (params.category) {
      where.categories = { some: { categoryId: params.category } };
    }

    if (params.status) {
      if (params.status === 'OUT_OF_STOCK') {
        where.AND = [
          { status: 'ACTIVE' },
          { variants: { every: { stock: 0 } } },
        ];
      } else {
        where.status = params.status;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { updatedAt: 'desc' };
    switch (params.sort) {
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'created_asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'created_desc':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { updatedAt: 'desc' };
    }

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: true,
          images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
          variants: true,
          categories: { include: { category: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: rows.map((p) => this.mapProductListItem(p)),
      total,
      page,
      limit,
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }] },
        variants: { orderBy: { size: 'asc' } },
        categories: { include: { category: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const stockTotal = product.variants.reduce((s, v) => s + v.stock, 0);
    return {
      ...product,
      price: this.num(product.price),
      compareAtPrice:
        product.compareAtPrice != null ? this.num(product.compareAtPrice) : null,
      costPrice: product.costPrice != null ? this.num(product.costPrice) : null,
      weight: product.weight != null ? this.num(product.weight) : null,
      length: product.length != null ? this.num(product.length) : null,
      width: product.width != null ? this.num(product.width) : null,
      height: product.height != null ? this.num(product.height) : null,
      stockTotal,
      displayStatus: this.displayStatus(product.status, stockTotal),
      categoryIds: product.categories.map((c) => c.categoryId),
      categories: product.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
      })),
      variants: product.variants.map((v) => ({
        ...v,
        priceOffset: this.num(v.priceOffset),
        price: v.price != null ? this.num(v.price) : null,
        available: v.stock - v.reservedStock,
      })),
    };
  }

  async createProduct(dto: CreateProductDto, userId?: string) {
    const status = dto.status ?? (dto.isPublished ? 'ACTIVE' : 'DRAFT');
    const isPublished = this.resolveIsPublished(status, dto.isPublished);

    const variantCreates =
      dto.variants && dto.variants.length > 0
        ? dto.variants
            .filter((v) => !v._delete)
            .map((v) => ({
              size: v.size ?? null,
              color: v.color ?? 'Default',
              material: v.material ?? null,
              sku: v.sku ?? null,
              stock: v.stock ?? 0,
              priceOffset: v.priceOffset ?? 0,
              price: v.price ?? null,
              imageUrl: v.imageUrl ?? null,
            }))
        : [
            { size: 'US 9', color: 'Default', stock: 10, priceOffset: 0 },
            { size: 'US 10', color: 'Default', stock: 10, priceOffset: 0 },
            { size: 'US 11', color: 'Default', stock: 10, priceOffset: 0 },
          ];

    const imageCreates =
      dto.images && dto.images.length > 0
        ? dto.images.map((img, i) => ({
            url: img.url,
            altText: img.altText ?? dto.name,
            sortOrder: img.sortOrder ?? i,
            isMain: img.isMain ?? i === 0,
          }))
        : dto.imageUrl
          ? [{ url: dto.imageUrl, altText: dto.name, sortOrder: 0, isMain: true }]
          : undefined;

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        sku: dto.sku,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        gender: dto.gender,
        brandId: dto.brandId || null,
        collection: dto.collection,
        isPublished,
        isFeatured: dto.isFeatured ?? false,
        status,
        weight: dto.weight,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        images: imageCreates ? { create: imageCreates } : undefined,
        variants: { create: variantCreates },
        categories: dto.categoryIds?.length
          ? {
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
    });

    await this.syncProductStatus(product.id);
    await this.audit('CREATE', 'Product', product.id, userId, {
      name: product.name,
      status,
    });

    return this.getProduct(product.id);
  }

  async updateProduct(id: string, dto: UpdateProductDto, userId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, categories: true },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const status = dto.status ?? existing.status;
    const isPublished =
      dto.status !== undefined
        ? this.resolveIsPublished(status, dto.isPublished)
        : dto.isPublished !== undefined
          ? dto.isPublished
          : undefined;

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.sku !== undefined ? { sku: dto.sku } : {}),
          ...(dto.price !== undefined ? { price: dto.price } : {}),
          ...(dto.compareAtPrice !== undefined
            ? { compareAtPrice: dto.compareAtPrice }
            : {}),
          ...(dto.costPrice !== undefined ? { costPrice: dto.costPrice } : {}),
          ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
          ...(dto.brandId !== undefined ? { brandId: dto.brandId || null } : {}),
          ...(dto.collection !== undefined ? { collection: dto.collection } : {}),
          ...(isPublished !== undefined ? { isPublished } : {}),
          ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.weight !== undefined ? { weight: dto.weight } : {}),
          ...(dto.length !== undefined ? { length: dto.length } : {}),
          ...(dto.width !== undefined ? { width: dto.width } : {}),
          ...(dto.height !== undefined ? { height: dto.height } : {}),
          ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
          ...(dto.seoDescription !== undefined
            ? { seoDescription: dto.seoDescription }
            : {}),
          ...(dto.lowStockThreshold !== undefined
            ? { lowStockThreshold: dto.lowStockThreshold }
            : {}),
          ...(dto.status === 'ARCHIVED' ? { archivedAt: new Date() } : {}),
          ...(dto.status && dto.status !== 'ARCHIVED' && existing.archivedAt
            ? { archivedAt: null }
            : {}),
        },
      });

      if (dto.categoryIds) {
        await tx.categoryProduct.deleteMany({ where: { productId: id } });
        if (dto.categoryIds.length) {
          await tx.categoryProduct.createMany({
            data: dto.categoryIds.map((categoryId) => ({
              categoryId,
              productId: id,
            })),
          });
        }
      }

      if (dto.images) {
        const keepIds = dto.images.filter((i) => i.id).map((i) => i.id!);
        await tx.productImage.deleteMany({
          where: { productId: id, id: { notIn: keepIds } },
        });
        for (let i = 0; i < dto.images.length; i++) {
          const img = dto.images[i];
          if (img.id) {
            await tx.productImage.update({
              where: { id: img.id },
              data: {
                url: img.url,
                altText: img.altText ?? dto.name ?? existing.name,
                sortOrder: img.sortOrder ?? i,
                isMain: img.isMain ?? i === 0,
              },
            });
          } else {
            await tx.productImage.create({
              data: {
                productId: id,
                url: img.url,
                altText: img.altText ?? dto.name ?? existing.name,
                sortOrder: img.sortOrder ?? i,
                isMain: img.isMain ?? i === 0,
              },
            });
          }
        }
      } else if (dto.imageUrl) {
        if (existing.images[0]) {
          await tx.productImage.update({
            where: { id: existing.images[0].id },
            data: { url: dto.imageUrl, altText: dto.name ?? existing.name },
          });
        } else {
          await tx.productImage.create({
            data: {
              productId: id,
              url: dto.imageUrl,
              altText: dto.name ?? existing.name,
              isMain: true,
            },
          });
        }
      }

      if (dto.variants) {
        for (const v of dto.variants) {
          if (v._delete && v.id) {
            const orderItemCount = await tx.orderItem.count({
              where: { variantId: v.id },
            });
            if (orderItemCount > 0) {
              throw new BadRequestException(
                `Cannot delete variant ${v.id}: it has order history. Set stock to 0 instead.`,
              );
            }
            await tx.productVariant.delete({ where: { id: v.id } });
            continue;
          }

          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                ...(v.size !== undefined ? { size: v.size } : {}),
                ...(v.color !== undefined ? { color: v.color } : {}),
                ...(v.material !== undefined ? { material: v.material } : {}),
                ...(v.sku !== undefined ? { sku: v.sku } : {}),
                ...(v.stock !== undefined ? { stock: v.stock } : {}),
                ...(v.priceOffset !== undefined
                  ? { priceOffset: v.priceOffset }
                  : {}),
                ...(v.price !== undefined ? { price: v.price } : {}),
                ...(v.imageUrl !== undefined ? { imageUrl: v.imageUrl } : {}),
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                size: v.size ?? null,
                color: v.color ?? 'Default',
                material: v.material ?? null,
                sku: v.sku ?? null,
                stock: v.stock ?? 0,
                priceOffset: v.priceOffset ?? 0,
                price: v.price ?? null,
                imageUrl: v.imageUrl ?? null,
              },
            });
          }
        }
      }
    });

    await this.syncProductStatus(id);
    await this.audit('UPDATE', 'Product', id, userId, { fields: Object.keys(dto) });
    return this.getProduct(id);
  }

  async duplicateProduct(id: string, userId?: string) {
    const source = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        categories: true,
      },
    });
    if (!source) throw new NotFoundException('Product not found');

    const copySku = source.sku
      ? `${source.sku}-COPY-${Date.now().toString(36).toUpperCase()}`
      : undefined;

    const product = await this.prisma.product.create({
      data: {
        name: `${source.name} (Copy)`,
        description: source.description,
        sku: copySku,
        price: source.price,
        compareAtPrice: source.compareAtPrice,
        costPrice: source.costPrice,
        gender: source.gender,
        brandId: source.brandId,
        collection: source.collection,
        currency: source.currency,
        isPublished: false,
        isFeatured: false,
        status: 'DRAFT',
        weight: source.weight,
        length: source.length,
        width: source.width,
        height: source.height,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        lowStockThreshold: source.lowStockThreshold,
        images: {
          create: source.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            sortOrder: img.sortOrder,
            isMain: img.isMain,
          })),
        },
        variants: {
          create: source.variants.map((v) => ({
            size: v.size,
            color: v.color,
            material: v.material,
            sku: v.sku
              ? `${v.sku}-COPY-${Date.now().toString(36).toUpperCase()}`
              : null,
            stock: v.stock,
            reservedStock: 0,
            priceOffset: v.priceOffset,
            price: v.price,
            imageUrl: v.imageUrl,
          })),
        },
        categories: source.categories.length
          ? {
              create: source.categories.map((c) => ({
                categoryId: c.categoryId,
              })),
            }
          : undefined,
      },
    });

    await this.audit('DUPLICATE', 'Product', product.id, userId, {
      sourceId: id,
    });
    return this.getProduct(product.id);
  }

  async archiveProduct(id: string, userId?: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    await this.prisma.product.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        isPublished: false,
        archivedAt: new Date(),
      },
    });

    await this.audit('ARCHIVE', 'Product', id, userId);
    return this.getProduct(id);
  }

  async restoreProduct(id: string, userId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const stockTotal = existing.variants.reduce((s, v) => s + v.stock, 0);
    const status = stockTotal === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';

    await this.prisma.product.update({
      where: { id },
      data: {
        status,
        isPublished: true,
        archivedAt: null,
      },
    });

    await this.audit('RESTORE', 'Product', id, userId, { status });
    return this.getProduct(id);
  }

  async deleteProduct(id: string, userId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: { select: { id: true } } },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const variantIds = existing.variants.map((v) => v.id);
    if (variantIds.length) {
      const orderItemCount = await this.prisma.orderItem.count({
        where: { variantId: { in: variantIds } },
      });
      if (orderItemCount > 0) {
        throw new BadRequestException(
          'Product has order history and cannot be deleted. Archive it instead.',
        );
      }
    }

    await this.prisma.product.delete({ where: { id } });
    await this.audit('DELETE', 'Product', id, userId, { name: existing.name });
    return { ok: true };
  }

  async syncProductStatus(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: { select: { stock: true } } },
    });
    if (!product) return;
    if (product.status === 'ARCHIVED' || product.status === 'DRAFT') return;

    const stockTotal = product.variants.reduce((s, v) => s + v.stock, 0);

    if (product.status === 'ACTIVE' && stockTotal === 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { status: 'OUT_OF_STOCK', isPublished: true },
      });
    } else if (product.status === 'OUT_OF_STOCK' && stockTotal > 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { status: 'ACTIVE', isPublished: true },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Brands
  // ---------------------------------------------------------------------------

  async listBrands() {
    const brands = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      logoUrl: b.logoUrl,
      productCount: b._count.products,
      createdAt: b.createdAt,
    }));
  }

  async createBrand(dto: CreateBrandDto, userId?: string) {
    const brand = await this.prisma.brand.create({
      data: {
        name: dto.name,
        description: dto.description,
        logoUrl: dto.logoUrl,
      },
    });
    await this.audit('CREATE', 'Brand', brand.id, userId, { name: brand.name });
    return brand;
  }

  async updateBrand(id: string, dto: UpdateBrandDto, userId?: string) {
    try {
      const brand = await this.prisma.brand.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.logoUrl !== undefined ? { logoUrl: dto.logoUrl } : {}),
        },
      });
      await this.audit('UPDATE', 'Brand', id, userId);
      return brand;
    } catch {
      throw new NotFoundException('Brand not found');
    }
  }

  // ---------------------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------------------

  async updateVariant(id: string, dto: UpdateVariantDto, userId?: string) {
    const existing = await this.prisma.productVariant.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Variant not found');

    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: {
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
        ...(dto.size !== undefined ? { size: dto.size } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.material !== undefined ? { material: dto.material } : {}),
        ...(dto.sku !== undefined ? { sku: dto.sku } : {}),
        ...(dto.priceOffset !== undefined ? { priceOffset: dto.priceOffset } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
      },
    });

    await this.syncProductStatus(variant.productId);
    await this.audit('UPDATE', 'ProductVariant', id, userId, dto as object);

    return {
      ...variant,
      priceOffset: this.num(variant.priceOffset),
      price: variant.price != null ? this.num(variant.price) : null,
    };
  }

  // ---------------------------------------------------------------------------
  // Inventory
  // ---------------------------------------------------------------------------

  async listInventory(params: InventoryListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductVariantWhereInput = {};
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { sku: { contains: q } },
        { size: { contains: q } },
        { color: { contains: q } },
        { product: { name: { contains: q } } },
        { product: { sku: { contains: q } } },
      ];
    }

    const variants = await this.prisma.productVariant.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            lowStockThreshold: true,
            status: true,
          },
        },
      },
      orderBy: [{ product: { name: 'asc' } }, { size: 'asc' }],
    });

    let rows = variants.map((v) => {
      const available = v.stock - v.reservedStock;
      const lowStock = v.stock <= v.product.lowStockThreshold;
      return {
        id: v.id,
        productId: v.product.id,
        productName: v.product.name,
        productSku: v.product.sku,
        sku: v.sku ?? v.product.sku,
        size: v.size,
        color: v.color,
        stock: v.stock,
        reservedStock: v.reservedStock,
        available,
        lowStock,
        threshold: v.product.lowStockThreshold,
        productStatus: v.product.status,
      };
    });

    if (params.lowStock === 'true') {
      rows = rows.filter((r) => r.lowStock);
    }

    const total = rows.length;
    const items = rows.slice(skip, skip + limit);
    return { items, total, page, limit };
  }

  async adjustStock(variantId: string, dto: StockAdjustDto, userId?: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: { select: { id: true, name: true, lowStockThreshold: true } },
      },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    const previous = variant.stock;
    let next = previous;
    if (dto.mode === 'increase') next = previous + dto.quantity;
    else if (dto.mode === 'decrease') next = Math.max(0, previous - dto.quantity);
    else next = dto.quantity;

    const delta = next - previous;

    await this.prisma.$transaction(async (tx) => {
      await tx.stockAdjustment.create({
        data: {
          variantId,
          previous,
          next,
          delta,
          reason: dto.reason,
          adminId: userId ?? null,
        },
      });

      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: next },
      });

      if (dto.lowStockThreshold !== undefined) {
        await tx.product.update({
          where: { id: variant.productId },
          data: { lowStockThreshold: dto.lowStockThreshold },
        });
      }
    });

    await this.syncProductStatus(variant.productId);

    const threshold = dto.lowStockThreshold ?? variant.product.lowStockThreshold;
    if (next === 0) {
      await this.notifications.notifyStaff('inventory.out_of_stock', 'Out of stock', {
        variantId,
        productId: variant.productId,
        productName: variant.product.name,
        stock: next,
      });
    } else if (next <= threshold) {
      await this.notifications.notifyStaff('inventory.low_stock', 'Low stock', {
        variantId,
        productId: variant.productId,
        productName: variant.product.name,
        stock: next,
        threshold,
      });
    }

    await this.audit('STOCK_ADJUST', 'ProductVariant', variantId, userId, {
      mode: dto.mode,
      previous,
      next,
      delta,
      reason: dto.reason,
    });

    return {
      variantId,
      previous,
      next,
      delta,
      reason: dto.reason,
    };
  }

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------

  async listCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    type CatNode = (typeof categories)[number] & { children: CatNode[] };
    const byId = new Map<string, CatNode>();
    for (const c of categories) {
      byId.set(c.id, { ...c, children: [] });
    }

    const roots: CatNode[] = [];
    for (const c of byId.values()) {
      if (c.parentId && byId.has(c.parentId)) {
        byId.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    }

    return roots.map((c) => this.mapCategoryNode(c));
  }

  async createCategory(dto: CategoryDto, userId?: string) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        parentId: dto.parentId ?? null,
        imageUrl: dto.imageUrl ?? null,
        order: dto.order ?? 0,
        archived: dto.archived ?? false,
      },
    });
    await this.audit('CREATE', 'Category', category.id, userId, {
      name: category.name,
    });
    return category;
  }

  async updateCategory(id: string, dto: CategoryDto, userId?: string) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
          ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
          ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
          ...(dto.order !== undefined ? { order: dto.order } : {}),
          ...(dto.archived !== undefined ? { archived: dto.archived } : {}),
        },
      });
      await this.audit('UPDATE', 'Category', id, userId);
      return category;
    } catch {
      throw new NotFoundException('Category not found');
    }
  }

  async deleteCategory(id: string, userId?: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (category._count.products > 0 || category._count.children > 0) {
      const updated = await this.prisma.category.update({
        where: { id },
        data: { archived: true },
      });
      await this.audit('ARCHIVE', 'Category', id, userId);
      return { ...updated, softArchived: true };
    }

    await this.prisma.category.delete({ where: { id } });
    await this.audit('DELETE', 'Category', id, userId, { name: category.name });
    return { ok: true, deleted: true };
  }

  async reorderCategories(dto: ReorderCategoriesDto, userId?: string) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    await this.audit('REORDER', 'Category', null, userId, {
      count: dto.items.length,
    });
    return this.listCategories();
  }

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------

  async listOrders(params: OrderListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { id: { contains: q } },
        { email: { contains: q } },
        { trackingNumber: { contains: q } },
        { user: { email: { contains: q } } },
        { user: { firstName: { contains: q } } },
        { user: { lastName: { contains: q } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          payment: { select: { status: true, provider: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: orders.map((o) => ({
        id: o.id,
        status: o.status,
        email: o.email,
        user: o.user,
        itemCount: o._count.items,
        totalAmount: this.num(o.totalAmount),
        currency: o.currency,
        trackingNumber: o.trackingNumber,
        shippingStatus: o.shippingStatus,
        paymentStatus: o.payment?.status ?? null,
        createdAt: o.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
        statusEvents: { orderBy: { createdAt: 'asc' } },
        returns: true,
        refunds: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { take: 1, orderBy: { sortOrder: 'asc' } },
                    brand: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    return {
      ...order,
      subtotal: this.num(order.subtotal),
      shippingCost: this.num(order.shippingCost),
      discountAmount: this.num(order.discountAmount),
      totalAmount: this.num(order.totalAmount),
      payment: order.payment
        ? { ...order.payment, amount: this.num(order.payment.amount) }
        : null,
      refunds: order.refunds.map((r) => ({
        ...r,
        amount: this.num(r.amount),
      })),
      tracking: {
        trackingNumber: order.trackingNumber,
        shippingStatus: order.shippingStatus,
        shippingMethod: order.shippingMethod,
      },
      timeline: order.statusEvents,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: this.num(item.price),
        size: item.variant.size,
        color: item.variant.color,
        variantId: item.variantId,
        productId: item.variant.product.id,
        productName: item.variant.product.name,
        brand: item.variant.product.brand?.name ?? null,
        img: item.variant.product.images[0]?.url ?? '',
      })),
    };
  }

  async updateOrderStatus(
    id: string,
    status: string,
    userId?: string,
    note?: string,
    trackingNumber?: string,
    shippingStatus?: string,
  ) {
    if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Order not found');

    const order = await this.prisma.$transaction(async (tx) => {
      await tx.orderStatusEvent.create({
        data: {
          orderId: id,
          status,
          note: note ?? null,
          createdBy: userId ?? null,
        },
      });

      return tx.order.update({
        where: { id },
        data: {
          status,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(shippingStatus !== undefined ? { shippingStatus } : {}),
        },
      });
    });

    await this.audit('STATUS_CHANGE', 'Order', id, userId, {
      from: existing.status,
      to: status,
      note,
      trackingNumber,
      shippingStatus,
    });

    if (existing.userId) {
      await this.prisma.notification.create({
        data: {
          userId: existing.userId,
          type: 'order.status',
          title: `Order ${status}`,
          payload: { orderId: id, status, note: note ?? null },
        },
      });
    }

    await this.notifications.notifyStaff('order.status', `Order ${status}`, {
      orderId: id,
      status,
      previousStatus: existing.status,
    });

    return {
      id: order.id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      shippingStatus: order.shippingStatus,
      totalAmount: this.num(order.totalAmount),
      updatedAt: order.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Customers & CRM
  // ---------------------------------------------------------------------------

  async crmStats() {
    const customers = await this.prisma.user.findMany({
      where: { role: { name: 'CUSTOMER' } },
      include: {
        orders: {
          where: { status: { notIn: ['Cancelled'] } },
          select: { id: true, totalAmount: true, createdAt: true, status: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    let totalLtv = 0;
    let repeatCustomerCount = 0;
    let activeCustomerCount = 0;
    let newCustomersThisMonth = 0;

    const segmentCounts: Record<string, number> = {
      new: 0,
      returning: 0,
      vip: 0,
      high_spending: 0,
      inactive: 0,
    };

    const customerSummaries = customers.map((c) => {
      const totalOrders = c.orders.length;
      const totalSpending = c.orders.reduce(
        (sum, o) => sum + this.num(o.totalAmount),
        0,
      );
      totalLtv += totalSpending;

      if (totalOrders >= 2) repeatCustomerCount++;

      const lastOrder = c.orders[0] ?? null;
      const registeredDaysAgo = (now - c.createdAt.getTime()) / day;
      const daysSinceLastOrder = lastOrder
        ? (now - lastOrder.createdAt.getTime()) / day
        : Infinity;

      if (daysSinceLastOrder <= 90) {
        activeCustomerCount++;
      }

      if (registeredDaysAgo <= 30) {
        newCustomersThisMonth++;
      }

      const segments: string[] = [];
      if (registeredDaysAgo <= 30) {
        segments.push('new');
        segmentCounts.new++;
      }
      if (totalOrders >= 2) {
        segments.push('returning');
        segmentCounts.returning++;
      }
      if (totalSpending >= 500) {
        segments.push('vip');
        segmentCounts.vip++;
      }
      if (totalSpending >= 200) {
        segments.push('high_spending');
        segmentCounts.high_spending++;
      }
      if (daysSinceLastOrder >= 90) {
        segments.push('inactive');
        segmentCounts.inactive++;
      }

      return {
        id: c.id,
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email,
        phone: c.phone,
        totalOrders,
        totalSpending,
        segments,
        lastOrderAt: lastOrder ? lastOrder.createdAt : null,
        registration: c.createdAt,
        disabled: c.disabled,
      };
    });

    const topCustomers = [...customerSummaries]
      .sort((a, b) => b.totalSpending - a.totalSpending)
      .slice(0, 10);

    const recentSignups = customerSummaries.slice(0, 5);

    const recentNotes = await this.prisma.customerNote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    const totalCustomers = customers.length;
    const averageLtv = totalCustomers > 0 ? totalLtv / totalCustomers : 0;
    const repeatRate = totalCustomers > 0 ? (repeatCustomerCount / totalCustomers) * 100 : 0;

    return {
      metrics: {
        totalCustomers,
        activeCustomers: activeCustomerCount,
        inactiveCustomers: totalCustomers - activeCustomerCount,
        totalLtv,
        averageLtv,
        repeatCustomerRate: Math.round(repeatRate),
        newCustomersThisMonth,
      },
      segments: segmentCounts,
      topCustomers,
      recentSignups,
      recentNotes: recentNotes.map((n) => ({
        id: n.id,
        body: n.body,
        createdAt: n.createdAt,
        author: n.author
          ? {
              name:
                [n.author.firstName, n.author.lastName].filter(Boolean).join(' ') ||
                n.author.email,
              email: n.author.email,
            }
          : null,
        customer: n.customer
          ? {
              id: n.customer.id,
              name:
                [n.customer.firstName, n.customer.lastName].filter(Boolean).join(' ') ||
                n.customer.email,
              email: n.customer.email,
            }
          : null,
      })),
    };
  }

  async listCustomers(params: CustomerListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: { name: 'CUSTOMER' },
    };

    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { email: { contains: q } },
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          where: { status: { notIn: ['Cancelled'] } },
          select: { id: true, totalAmount: true, createdAt: true, status: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    let mapped = users.map((u) => {
      const totalOrders = u.orders.length;
      const totalSpending = u.orders.reduce(
        (s, o) => s + this.num(o.totalAmount),
        0,
      );
      const lastOrder = u.orders[0] ?? null;
      const registeredDaysAgo = (now - u.createdAt.getTime()) / day;
      const daysSinceLastOrder = lastOrder
        ? (now - lastOrder.createdAt.getTime()) / day
        : Infinity;

      const segments: string[] = [];
      if (registeredDaysAgo <= 30) segments.push('new');
      if (totalOrders >= 2) segments.push('returning');
      if (totalSpending >= 500) segments.push('vip');
      if (totalSpending >= 200) segments.push('high_spending');
      if (daysSinceLastOrder >= 90) segments.push('inactive');

      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        name:
          [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
        phone: u.phone,
        totalOrders,
        totalSpending,
        lastOrder: lastOrder
          ? {
              id: lastOrder.id,
              createdAt: lastOrder.createdAt,
              totalAmount: this.num(lastOrder.totalAmount),
              status: lastOrder.status,
            }
          : null,
        accountStatus: u.disabled ? 'disabled' : 'active',
        disabled: u.disabled,
        registration: u.createdAt,
        segments,
      };
    });

    if (params.segment) {
      mapped = mapped.filter((c) => c.segments.includes(params.segment!));
    }

    const total = mapped.length;
    const items = mapped.slice(skip, skip + limit);
    return { items, total, page, limit };
  }

  async getCustomer(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: { select: { name: true } },
        addresses: true,
        customerNotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            returns: true,
            payment: true,
            _count: { select: { items: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Customer not found');

    const activeOrders = user.orders.filter((o) => o.status !== 'Cancelled');
    const totalSpending = activeOrders.reduce(
      (s, o) => s + this.num(o.totalAmount),
      0,
    );
    const returns = user.orders.flatMap((o) =>
      o.returns.map((r) => ({ ...r, orderId: o.id })),
    );

    const registeredDaysAgo =
      (Date.now() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000);
    const lastOrder = activeOrders[0] ?? null;
    const daysSinceLastOrder = lastOrder
      ? (Date.now() - lastOrder.createdAt.getTime()) / (24 * 60 * 60 * 1000)
      : Infinity;

    const segments: string[] = [];
    if (registeredDaysAgo <= 30) segments.push('new');
    if (activeOrders.length >= 2) segments.push('returning');
    if (totalSpending >= 500) segments.push('vip');
    if (totalSpending >= 200) segments.push('high_spending');
    if (daysSinceLastOrder >= 90) segments.push('inactive');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
      phone: user.phone,
      disabled: user.disabled,
      role: user.role.name,
      registration: user.createdAt,
      segments,
      metrics: {
        totalOrders: activeOrders.length,
        totalSpending,
        averageOrderValue:
          activeOrders.length > 0 ? totalSpending / activeOrders.length : 0,
        lastOrderAt: activeOrders[0]?.createdAt ?? null,
      },
      addresses: user.addresses,
      notes: user.customerNotes,
      customerNotes: user.customerNotes,
      returns,
      orders: user.orders.map((o) => ({
        id: o.id,
        status: o.status,
        totalAmount: this.num(o.totalAmount),
        currency: o.currency,
        itemCount: o._count.items,
        paymentStatus: o.payment?.status ?? null,
        createdAt: o.createdAt,
      })),
    };
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto, userId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!existing) throw new NotFoundException('Customer not found');
    if (existing.role.name !== 'CUSTOMER') {
      throw new BadRequestException('User is not a customer');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.disabled !== undefined ? { disabled: dto.disabled } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      },
    });

    await this.audit('UPDATE', 'Customer', id, userId, dto as object);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      disabled: user.disabled,
    };
  }

  async addCustomerNote(id: string, body: CustomerNoteDto, authorId: string) {
    const customer = await this.prisma.user.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');

    const note = await this.prisma.customerNote.create({
      data: {
        customerId: id,
        authorId,
        body: body.body,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    await this.audit('CREATE', 'CustomerNote', note.id, authorId, {
      customerId: id,
    });
    return note;
  }

  // ---------------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------------

  async listReviews(params: ReviewListParams = {}) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Prisma.ReviewWhereInput = {};
    if (params.approved === 'true') where.approved = true;
    else if (params.approved === 'false') where.approved = false;

    const reviews = await this.prisma.review.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      approved: r.approved,
      hidden: r.hidden,
      createdAt: r.createdAt,
      productId: r.productId,
      productName: r.product.name,
      authorName:
        [r.user.firstName, r.user.lastName].filter(Boolean).join(' ') ||
        r.user.email,
      authorEmail: r.user.email,
    }));
  }

  async updateReview(
    id: string,
    body: { approved?: boolean; hidden?: boolean },
    userId?: string,
  ) {
    try {
      const review = await this.prisma.review.update({
        where: { id },
        data: {
          ...(body.approved !== undefined ? { approved: body.approved } : {}),
          ...(body.hidden !== undefined ? { hidden: body.hidden } : {}),
        },
      });
      await this.audit('UPDATE', 'Review', id, userId, body);
      return {
        id: review.id,
        approved: review.approved,
        hidden: review.hidden,
      };
    } catch {
      throw new NotFoundException('Review not found');
    }
  }

  async deleteReview(id: string, userId?: string) {
    try {
      await this.prisma.review.delete({ where: { id } });
      await this.audit('DELETE', 'Review', id, userId);
      return { ok: true };
    } catch {
      throw new NotFoundException('Review not found');
    }
  }

  // ---------------------------------------------------------------------------
  // Coupons
  // ---------------------------------------------------------------------------

  async listCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: true,
        categories: true,
      },
    });

    return coupons.map((c) => ({
      ...c,
      discountValue: this.num(c.discountValue),
      maxDiscount: c.maxDiscount != null ? this.num(c.maxDiscount) : null,
      minOrderValue: this.num(c.minOrderValue),
      productIds: c.products.map((p) => p.productId),
      categoryIds: c.categories.map((cat) => cat.categoryId),
    }));
  }

  async createCoupon(dto: CouponDto, userId?: string) {
    const coupon = await this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        maxDiscount: dto.maxDiscount,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        usageLimit: dto.usageLimit,
        minOrderValue: dto.minOrderValue ?? 0,
        active: dto.active ?? true,
        appliesTo: dto.appliesTo ?? 'store',
        products: dto.productIds?.length
          ? {
              create: dto.productIds.map((productId) => ({ productId })),
            }
          : undefined,
        categories: dto.categoryIds?.length
          ? {
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      include: { products: true, categories: true },
    });

    await this.audit('CREATE', 'Coupon', coupon.id, userId, {
      code: coupon.code,
    });

    return {
      ...coupon,
      discountValue: this.num(coupon.discountValue),
      maxDiscount:
        coupon.maxDiscount != null ? this.num(coupon.maxDiscount) : null,
      minOrderValue: this.num(coupon.minOrderValue),
      productIds: coupon.products.map((p) => p.productId),
      categoryIds: coupon.categories.map((c) => c.categoryId),
    };
  }

  async updateCoupon(id: string, dto: CouponDto, userId?: string) {
    const existing = await this.prisma.coupon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Coupon not found');

    const coupon = await this.prisma.$transaction(async (tx) => {
      if (dto.productIds) {
        await tx.couponProduct.deleteMany({ where: { couponId: id } });
        if (dto.productIds.length) {
          await tx.couponProduct.createMany({
            data: dto.productIds.map((productId) => ({ couponId: id, productId })),
          });
        }
      }
      if (dto.categoryIds) {
        await tx.couponCategory.deleteMany({ where: { couponId: id } });
        if (dto.categoryIds.length) {
          await tx.couponCategory.createMany({
            data: dto.categoryIds.map((categoryId) => ({
              couponId: id,
              categoryId,
            })),
          });
        }
      }

      return tx.coupon.update({
        where: { id },
        data: {
          code: dto.code.toUpperCase(),
          description: dto.description,
          discountType: dto.discountType,
          discountValue: dto.discountValue,
          maxDiscount: dto.maxDiscount,
          startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          usageLimit: dto.usageLimit,
          minOrderValue: dto.minOrderValue ?? existing.minOrderValue,
          active: dto.active ?? existing.active,
          appliesTo: dto.appliesTo ?? existing.appliesTo,
        },
        include: { products: true, categories: true },
      });
    });

    await this.audit('UPDATE', 'Coupon', id, userId);
    return {
      ...coupon,
      discountValue: this.num(coupon.discountValue),
      maxDiscount:
        coupon.maxDiscount != null ? this.num(coupon.maxDiscount) : null,
      minOrderValue: this.num(coupon.minOrderValue),
      productIds: coupon.products.map((p) => p.productId),
      categoryIds: coupon.categories.map((c) => c.categoryId),
    };
  }

  async deleteCoupon(id: string, userId?: string) {
    try {
      await this.prisma.coupon.delete({ where: { id } });
      await this.audit('DELETE', 'Coupon', id, userId);
      return { ok: true };
    } catch {
      throw new NotFoundException('Coupon not found');
    }
  }

  // ---------------------------------------------------------------------------
  // Returns
  // ---------------------------------------------------------------------------

  async listReturns(params: ReturnListParams = {}) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Prisma.ReturnRequestWhereInput = {};
    if (params.status) where.status = params.status;

    const returns = await this.prisma.returnRequest.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            id: true,
            email: true,
            totalAmount: true,
            status: true,
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return returns.map((r) => ({
      id: r.id,
      status: r.status,
      reason: r.reason,
      resolution: r.resolution,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      orderId: r.orderId,
      orderTotal: this.num(r.order.totalAmount),
      orderStatus: r.order.status,
      customer: r.order.user,
      email: r.order.email,
    }));
  }

  async getReturn(id: string) {
    const ret = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
        refunds: true,
        order: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
            payment: true,
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: { images: { take: 1 } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!ret) throw new NotFoundException('Return not found');

    return {
      ...ret,
      refunds: ret.refunds.map((r) => ({ ...r, amount: this.num(r.amount) })),
      order: {
        ...ret.order,
        totalAmount: this.num(ret.order.totalAmount),
        payment: ret.order.payment
          ? {
              ...ret.order.payment,
              amount: this.num(ret.order.payment.amount),
            }
          : null,
        items: ret.order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: this.num(item.price),
          productName: item.variant.product.name,
          size: item.variant.size,
          color: item.variant.color,
          img: item.variant.product.images[0]?.url ?? '',
        })),
      },
    };
  }

  async createReturn(dto: ReturnRequestDto, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const ret = await this.prisma.returnRequest.create({
      data: {
        orderId: dto.orderId,
        reason: dto.reason,
        status: 'Requested',
        notes: dto.reason
          ? {
              create: {
                body: dto.reason,
                authorId: userId ?? null,
              },
            }
          : undefined,
      },
    });

    await this.audit('CREATE', 'ReturnRequest', ret.id, userId, {
      orderId: dto.orderId,
    });
    return ret;
  }

  async updateReturn(id: string, dto: UpdateReturnDto, userId?: string) {
    const existing = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: { order: { include: { payment: true } } },
    });
    if (!existing) throw new NotFoundException('Return not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.note) {
        await tx.returnNote.create({
          data: {
            returnId: id,
            body: dto.note,
            authorId: userId ?? null,
          },
        });
      }

      if (dto.refundAmount != null && dto.refundAmount > 0) {
        const payment = existing.order.payment;
        await tx.refund.create({
          data: {
            orderId: existing.orderId,
            paymentId: payment?.id ?? null,
            returnId: id,
            amount: dto.refundAmount,
            status: 'Processing',
            reason: dto.resolution ?? dto.note ?? existing.reason,
          },
        });

        if (payment) {
          const paid = this.num(payment.amount);
          const refundSum = await tx.refund.aggregate({
            where: { paymentId: payment.id },
            _sum: { amount: true },
          });
          const refundedTotal = this.num(refundSum._sum.amount);
          const paymentStatus =
            refundedTotal >= paid ? 'Refunded' : 'Partially Refunded';
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: paymentStatus },
          });
        }
      }

      return tx.returnRequest.update({
        where: { id },
        data: {
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.resolution !== undefined ? { resolution: dto.resolution } : {}),
        },
      });
    });

    await this.audit('UPDATE', 'ReturnRequest', id, userId, dto as object);
    return this.getReturn(updated.id);
  }

  // ---------------------------------------------------------------------------
  // Payments
  // ---------------------------------------------------------------------------

  async listPayments(params: PaymentListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};
    if (params.status) where.status = params.status;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              email: true,
              status: true,
              totalAmount: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      items: payments.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        provider: p.provider,
        providerPaymentId: p.providerPaymentId,
        amount: this.num(p.amount),
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
        orderStatus: p.order.status,
        customer: p.order.user,
        email: p.order.email,
      })),
      total,
      page,
      limit,
    };
  }

  // ---------------------------------------------------------------------------
  // Refunds
  // ---------------------------------------------------------------------------

  async listRefunds(limit = 50) {
    const take = Math.min(Math.max(limit, 1), 200);
    const refunds = await this.prisma.refund.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            id: true,
            email: true,
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
        returnReq: { select: { id: true, status: true } },
      },
    });

    return refunds.map((r) => ({
      id: r.id,
      orderId: r.orderId,
      paymentId: r.paymentId,
      returnId: r.returnId,
      amount: this.num(r.amount),
      status: r.status,
      reason: r.reason,
      createdAt: r.createdAt,
      customer: r.order.user,
      email: r.order.email,
      returnStatus: r.returnReq?.status ?? null,
    }));
  }

  // ---------------------------------------------------------------------------
  // Shipping settings
  // ---------------------------------------------------------------------------

  async getShippingSettings() {
    const keys = [
      'freeShippingThreshold',
      'shippingMethodsJson',
      'shippingZonesJson',
      'currency',
      'storeName',
    ];
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: keys } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

    return {
      storeName: map.storeName ?? 'Sole Elite Forge',
      currency: map.currency ?? 'USD',
      freeShippingThreshold: map.freeShippingThreshold
        ? Number(map.freeShippingThreshold)
        : 100,
      shippingMethodsJson: map.shippingMethodsJson ?? '[]',
      shippingZonesJson: map.shippingZonesJson ?? '[]',
    };
  }

  async updateShippingSettings(dto: SettingsDto, userId?: string) {
    const entries: { key: string; value: string }[] = [];
    if (dto.storeName !== undefined) {
      entries.push({ key: 'storeName', value: dto.storeName });
    }
    if (dto.currency !== undefined) {
      entries.push({ key: 'currency', value: dto.currency });
    }
    if (dto.freeShippingThreshold !== undefined) {
      entries.push({
        key: 'freeShippingThreshold',
        value: String(dto.freeShippingThreshold),
      });
    }
    if (dto.shippingMethodsJson !== undefined) {
      entries.push({
        key: 'shippingMethodsJson',
        value: dto.shippingMethodsJson,
      });
    }
    if (dto.shippingZonesJson !== undefined) {
      entries.push({ key: 'shippingZonesJson', value: dto.shippingZonesJson });
    }

    for (const entry of entries) {
      await this.prisma.setting.upsert({
        where: { key: entry.key },
        create: entry,
        update: { value: entry.value },
      });
    }

    await this.audit('UPDATE', 'Setting', 'shipping', userId, dto as object);
    return this.getShippingSettings();
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  async analytics(params: AnalyticsParams = {}) {
    const { from, to } = this.resolveAnalyticsRange(params);

    const orderWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: from, lte: to },
    };
    const revenueWhere: Prisma.OrderWhereInput = {
      ...orderWhere,
      status: { notIn: ['Cancelled'] },
    };

    const [
      revenueAgg,
      orderCount,
      cancelledCount,
      returnedCount,
      statusRows,
      variants,
      customers,
      soldItems,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        where: revenueWhere,
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
      this.prisma.order.count({ where: orderWhere }),
      this.prisma.order.count({
        where: { ...orderWhere, status: 'Cancelled' },
      }),
      this.prisma.order.count({
        where: { ...orderWhere, status: 'Returned' },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: orderWhere,
        _count: { _all: true },
      }),
      this.prisma.productVariant.findMany({
        include: {
          product: {
            select: { id: true, name: true, sku: true, lowStockThreshold: true },
          },
        },
      }),
      this.prisma.user.findMany({
        where: {
          role: { name: 'CUSTOMER' },
          createdAt: { lte: to },
        },
        select: {
          id: true,
          createdAt: true,
          orders: {
            where: { status: { notIn: ['Cancelled'] } },
            select: { createdAt: true },
          },
        },
      }),
      this.prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: from, lte: to },
            status: { notIn: ['Cancelled'] },
          },
        },
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
        },
      }),
    ]);

    const soldMap = new Map<
      string,
      { id: string; name: string; sku: string | null; sold: number }
    >();
    for (const item of soldItems) {
      const p = item.variant.product;
      const cur = soldMap.get(p.id) ?? {
        id: p.id,
        name: p.name,
        sku: p.sku,
        sold: 0,
      };
      cur.sold += item.quantity;
      soldMap.set(p.id, cur);
    }
    const ranked = [...soldMap.values()].sort((a, b) => b.sold - a.sold);

    const lowStock = variants
      .filter((v) => v.stock <= v.product.lowStockThreshold)
      .slice(0, 20)
      .map((v) => ({
        variantId: v.id,
        productId: v.product.id,
        productName: v.product.name,
        sku: v.sku ?? v.product.sku,
        stock: v.stock,
        threshold: v.product.lowStockThreshold,
      }));

    let newCustomers = 0;
    let returningCustomers = 0;
    for (const c of customers) {
      const ordersInRange = c.orders.filter(
        (o) => o.createdAt >= from && o.createdAt <= to,
      );
      if (!ordersInRange.length) continue;
      const priorOrders = c.orders.filter((o) => o.createdAt < from);
      if (priorOrders.length === 0 && c.createdAt >= from) newCustomers += 1;
      else if (priorOrders.length > 0 || ordersInRange.length >= 2) {
        returningCustomers += 1;
      } else if (c.createdAt < from) {
        returningCustomers += 1;
      } else {
        newCustomers += 1;
      }
    }

    const ordersByStatus: Record<string, number> = {};
    for (const row of statusRows) {
      ordersByStatus[row.status] = row._count._all;
    }

    const revenue = this.num(revenueAgg._sum.totalAmount);
    const aov = this.num(revenueAgg._avg.totalAmount);

    return {
      range: { from, to },
      revenue,
      orders: orderCount,
      aov,
      bestSelling: ranked.slice(0, 10),
      lowSelling: ranked.slice(-10).reverse(),
      lowStock,
      newCustomers,
      returningCustomers,
      ordersByStatus,
      cancelled: cancelledCount,
      returned: returnedCount,
    };
  }

  // ---------------------------------------------------------------------------
  // Admin users
  // ---------------------------------------------------------------------------

  async listAdminUsers() {
    const users = await this.prisma.user.findMany({
      where: { role: { name: { in: [...STAFF_ROLES] } } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        disabled: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      disabled: u.disabled,
      role: u.role.name,
      roleId: u.role.id,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async createAdminUser(dto: CreateAdminUserDto, userId?: string) {
    if (!(STAFF_ROLES as readonly string[]).includes(dto.role)) {
      throw new BadRequestException(`Invalid role: ${dto.role}`);
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: dto.role },
    });
    if (!role) {
      throw new BadRequestException(`Role ${dto.role} does not exist`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: role.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        disabled: true,
        role: { select: { name: true } },
        createdAt: true,
      },
    });

    await this.audit('CREATE', 'AdminUser', user.id, userId, {
      email: user.email,
      role: dto.role,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      disabled: user.disabled,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  async updateAdminUser(id: string, dto: UpdateAdminUserDto, userId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!existing) throw new NotFoundException('Admin user not found');
    if (!(STAFF_ROLES as readonly string[]).includes(existing.role.name)) {
      throw new BadRequestException('User is not an admin');
    }

    let roleId: string | undefined;
    if (dto.role) {
      if (!(STAFF_ROLES as readonly string[]).includes(dto.role)) {
        throw new BadRequestException(`Invalid role: ${dto.role}`);
      }
      const role = await this.prisma.role.findUnique({
        where: { name: dto.role },
      });
      if (!role) throw new BadRequestException(`Role ${dto.role} does not exist`);
      roleId = role.id;
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(dto.disabled !== undefined ? { disabled: dto.disabled } : {}),
        ...(roleId ? { roleId } : {}),
        ...(passwordHash ? { passwordHash } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        disabled: true,
        role: { select: { name: true } },
        updatedAt: true,
      },
    });

    await this.audit('UPDATE', 'AdminUser', id, userId, {
      fields: Object.keys(dto).filter((k) => k !== 'password'),
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      disabled: user.disabled,
      role: user.role.name,
      updatedAt: user.updatedAt,
    };
  }

  async listRoles() {
    const roles = await this.prisma.role.findMany({
      where: { name: { in: [...STAFF_ROLES] } },
      include: {
        permissions: true,
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      userCount: r._count.users,
      permissions: r.permissions.map((p) => ({
        id: p.id,
        action: p.action,
        description: p.description,
      })),
    }));
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  async listAuditLogs(limit = 100, entity?: string) {
    return this.auditService.list(limit, entity);
  }

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  async listNotifications(userId: string, limit = 50) {
    return this.notifications.listForUser(userId, limit);
  }

  async markNotificationRead(id: string, userId: string) {
    const n = await this.notifications.markRead(id, userId);
    if (!n) throw new NotFoundException('Notification not found');
    return n;
  }

  async markAllNotificationsRead(userId: string) {
    return this.notifications.markAllRead(userId);
  }

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------

  async getSettings() {
    const rows = await this.prisma.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      storeName: map.storeName ?? 'Sole Elite Forge',
      currency: map.currency ?? 'USD',
      freeShippingThreshold: map.freeShippingThreshold
        ? Number(map.freeShippingThreshold)
        : 100,
      shippingMethodsJson: map.shippingMethodsJson ?? '[]',
      shippingZonesJson: map.shippingZonesJson ?? '[]',
      ...map,
    };
  }

  async updateSettings(dto: SettingsDto, userId?: string) {
    return this.updateShippingSettings(dto, userId);
  }

  // ---------------------------------------------------------------------------
  // Support / Newsletter
  // ---------------------------------------------------------------------------

  async listSupport(limit = 50) {
    const take = Math.min(Math.max(limit, 1), 200);
    return this.prisma.supportMessage.findMany({
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSupport(id: string) {
    const msg = await this.prisma.supportMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Support message not found');
    return msg;
  }

  async listNewsletter(limit = 100) {
    const take = Math.min(Math.max(limit, 1), 500);
    return this.prisma.newsletterSubscriber.findMany({
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteNewsletter(id: string) {
    try {
      await this.prisma.newsletterSubscriber.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Subscriber not found');
    }
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async audit(
    action: string,
    entity: string,
    entityId?: string | null,
    userId?: string | null,
    details?: Prisma.InputJsonValue,
  ) {
    await this.auditService.log({
      action,
      entity,
      entityId,
      userId,
      details,
    });
  }

  private num(
    decimal: Prisma.Decimal | number | string | null | undefined,
  ): number {
    if (decimal == null) return 0;
    return Number(decimal);
  }

  private resolveIsPublished(
    status: string,
    explicit?: boolean,
  ): boolean {
    if (status === 'ACTIVE' || status === 'OUT_OF_STOCK') return true;
    if (status === 'DRAFT' || status === 'ARCHIVED') return false;
    return explicit ?? false;
  }

  private displayStatus(status: string, stockTotal: number): string {
    if (status === 'ARCHIVED') return 'ARCHIVED';
    if (stockTotal === 0 && status === 'ACTIVE') return 'OUT_OF_STOCK';
    return status;
  }

  private mapProductListItem(
    p: Prisma.ProductGetPayload<{
      include: {
        brand: true;
        images: true;
        variants: true;
        categories: { include: { category: true } };
      };
    }>,
  ) {
    const stockTotal = p.variants.reduce((s, v) => s + v.stock, 0);
    const displayStatus = this.displayStatus(p.status, stockTotal);
    return {
      id: p.id,
      image: p.images[0]?.url ?? '',
      img: p.images[0]?.url ?? '',
      name: p.name,
      sku: p.sku,
      categories: p.categories.map((c) => c.category.name),
      categoryNames: p.categories.map((c) => c.category.name),
      price: this.num(p.price),
      compareAtPrice:
        p.compareAtPrice != null ? this.num(p.compareAtPrice) : null,
      stockTotal,
      status: displayStatus,
      rawStatus: p.status,
      isPublished: p.isPublished,
      isFeatured: p.isFeatured,
      brandId: p.brandId,
      brandName: p.brand?.name ?? null,
      gender: p.gender,
      collection: p.collection,
      variantCount: p.variants.length,
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
      actions: {
        canEdit: true,
        canDuplicate: true,
        canArchive: p.status !== 'ARCHIVED',
        canRestore: p.status === 'ARCHIVED',
        canDelete: true,
      },
    };
  }

  private mapCategoryNode(node: {
    id: string;
    name: string;
    parentId: string | null;
    imageUrl: string | null;
    order: number | null;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: { products: number; children: number };
    children: Array<unknown>;
  }): Record<string, unknown> {
    return {
      id: node.id,
      name: node.name,
      parentId: node.parentId,
      imageUrl: node.imageUrl,
      order: node.order,
      archived: node.archived,
      productCount: node._count.products,
      childrenCount: node._count.children,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      children: (node.children as typeof node[]).map((c) =>
        this.mapCategoryNode(c as typeof node),
      ),
    };
  }

  private resolveAnalyticsRange(params: AnalyticsParams): {
    from: Date;
    to: Date;
  } {
    const to = params.to ? new Date(params.to) : new Date();
    to.setHours(23, 59, 59, 999);

    if (params.from) {
      const from = new Date(params.from);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    const from = new Date(to);
    from.setHours(0, 0, 0, 0);
    const range = (params.range ?? '30d').toLowerCase();
    if (range === '7d' || range === 'week') from.setDate(from.getDate() - 6);
    else if (range === '90d' || range === 'quarter')
      from.setDate(from.getDate() - 89);
    else if (range === '365d' || range === 'year')
      from.setDate(from.getDate() - 364);
    else from.setDate(from.getDate() - 29);

    return { from, to };
  }
}
