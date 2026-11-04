import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const PUBLIC_SETTING_KEYS = [
  'storeName',
  'logoUrl',
  'faviconUrl',
  'contactEmail',
  'contactPhone',
  'contactAddress',
  'socialLinksJson',
  'footerText',
  'newsletterHeading',
  'newsletterSubtext',
  'defaultSeoTitle',
  'defaultSeoDescription',
  'defaultOgImage',
];

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  private isLive(status: string, publishedAt?: Date | null) {
    if (status === 'PUBLISHED') return true;
    if (status === 'SCHEDULED' && publishedAt && publishedAt <= new Date()) return true;
    return false;
  }

  async findAll(type?: string) {
    return this.prisma.cmsPage.findMany({
      where: {
        published: true,
        status: { in: ['PUBLISHED', 'SCHEDULED'] },
        ...(type ? { type } : {}),
      },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        type: true,
        published: true,
        featuredImageUrl: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findFirst({
      where: { slug, published: true },
    });
    if (!page || !this.isLive(page.status, page.publishedAt)) {
      throw new NotFoundException(`Page "${slug}" not found`);
    }
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      type: page.type,
      published: page.published,
      featuredImageUrl: page.featuredImageUrl,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoKeywords: page.seoKeywords,
      canonicalUrl: page.canonicalUrl,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImage: page.ogImage,
      publishedAt: page.publishedAt,
      updatedAt: page.updatedAt,
    };
  }

  async getHome() {
    const sections = await this.prisma.homepageSection.findMany({
      where: { enabled: true, status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
    });

    const resolved = await Promise.all(
      sections.map(async (section) => {
        const payload = (section.payload ?? {}) as Record<string, unknown>;
        let featuredProducts: unknown[] = [];
        let featuredCategories: unknown[] = [];
        const productIds = Array.isArray(payload.productIds)
          ? (payload.productIds as string[])
          : [];
        const categoryIds = Array.isArray(payload.categoryIds)
          ? (payload.categoryIds as string[])
          : [];

        if (productIds.length) {
          const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isPublished: true, status: { not: 'ARCHIVED' } },
            include: { images: { take: 1 }, brand: true },
          });
          featuredProducts = products.map((p) => ({
            id: p.id,
            name: p.name,
            brand: p.brand?.name ?? '',
            price: Number(p.price),
            img: p.images[0]?.url ?? '',
          }));
        }
        if (categoryIds.length) {
          featuredCategories = await this.prisma.category.findMany({
            where: { id: { in: categoryIds }, archived: false },
            select: { id: true, name: true, imageUrl: true },
          });
        }

        return {
          id: section.id,
          key: section.key,
          title: section.title,
          sortOrder: section.sortOrder,
          payload,
          featuredProducts,
          featuredCategories,
        };
      }),
    );

    return { sections: resolved };
  }

  async getBanners() {
    const now = new Date();
    const banners = await this.prisma.banner.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
    });
    return banners.filter((b) => {
      if (b.startsAt && b.startsAt > now) return false;
      if (b.endsAt && b.endsAt < now) return false;
      return true;
    });
  }

  async getNav() {
    const menus = await this.prisma.navMenu.findMany({
      include: {
        items: {
          where: { enabled: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    const byLocation: Record<string, Array<{ label: string; url: string }>> = {};
    for (const menu of menus) {
      byLocation[menu.location] = menu.items.map((i) => ({ label: i.label, url: i.url }));
    }
    return byLocation;
  }

  async getPublicSettings() {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: [...PUBLIC_SETTING_KEYS] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    let social: Record<string, string> = {};
    try {
      social = map.socialLinksJson ? JSON.parse(map.socialLinksJson) : {};
    } catch {
      social = {};
    }
    return { ...map, social };
  }

  async listBlog() {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },
    });
    return posts
      .filter((p) => this.isLive(p.status, p.publishedAt))
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        featuredImageUrl: p.featuredImageUrl,
        authorName: p.authorName,
        category: p.category,
        publishedAt: p.publishedAt,
        tags: p.tags.map((t) => t.tag),
      }));
  }

  async getBlogBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { tags: true },
    });
    if (!post || !this.isLive(post.status, post.publishedAt)) {
      throw new NotFoundException(`Post "${slug}" not found`);
    }
    return {
      ...post,
      tags: post.tags.map((t) => t.tag),
    };
  }
}
