import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BannerDto,
  BlogPostDto,
  CmsPageDto,
  CmsSettingsDto,
  HomepageSectionDto,
  SaveNavMenuDto,
} from './dto/cms-admin.dto';

const CMS_SETTING_KEYS = [
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
] as const;

@Injectable()
export class CmsAdminService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private syncPublished(status?: string) {
    const s = status ?? 'DRAFT';
    return {
      status: s,
      published: s === 'PUBLISHED',
      publishedAt: s === 'PUBLISHED' ? new Date() : undefined,
    };
  }

  async dashboard() {
    const now = new Date();
    const [
      publishedPages,
      draftPages,
      activeBanners,
      categories,
      blogPosts,
      mediaFiles,
      recentPages,
      recentPosts,
    ] = await Promise.all([
      this.prisma.cmsPage.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.cmsPage.count({ where: { status: 'DRAFT' } }),
      this.prisma.banner.count({
        where: {
          status: 'PUBLISHED',
          OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
        },
      }),
      this.prisma.category.count({ where: { archived: false } }),
      this.prisma.blogPost.count(),
      this.prisma.mediaAsset.count(),
      this.prisma.cmsPage.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
      this.prisma.blogPost.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
    ]);

    return {
      publishedPages,
      draftPages,
      activeBanners,
      categories,
      blogPosts,
      mediaFiles,
      recentChanges: [
        ...recentPages.map((p) => ({ ...p, entity: 'page' as const })),
        ...recentPosts.map((p) => ({ ...p, entity: 'blog' as const })),
      ].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 8),
    };
  }

  async listPages(params: { search?: string; status?: string; type?: string; page?: number; limit?: number }) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Prisma.CmsPageWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.type) where.type = params.type;
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [{ title: { contains: q } }, { slug: { contains: q } }];
    }
    const [items, total] = await Promise.all([
      this.prisma.cmsPage.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.cmsPage.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async getPage(id: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async createPage(dto: CmsPageDto, userId?: string) {
    if (!dto.title || !dto.slug) throw new BadRequestException('Title and slug are required');
    const sync = this.syncPublished(dto.status);
    try {
      const page = await this.prisma.cmsPage.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          content: dto.content ?? '',
          type: dto.type ?? 'page',
          featuredImageUrl: dto.featuredImageUrl ?? undefined,
          seoTitle: dto.seoTitle ?? undefined,
          seoDescription: dto.seoDescription ?? undefined,
          seoKeywords: dto.seoKeywords ?? undefined,
          canonicalUrl: dto.canonicalUrl ?? undefined,
          ogTitle: dto.ogTitle ?? undefined,
          ogDescription: dto.ogDescription ?? undefined,
          ogImage: dto.ogImage ?? undefined,
          ...sync,
          publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : sync.publishedAt,
        },
      });
      await this.audit.log({ action: 'CREATE', entity: 'CmsPage', entityId: page.id, userId });
      return page;
    } catch {
      throw new BadRequestException('Could not create page (slug may already exist)');
    }
  }

  async updatePage(id: string, dto: Partial<CmsPageDto>, userId?: string) {
    const existing = await this.getPage(id);
    const status = dto.status ?? existing.status;
    const sync = dto.status ? this.syncPublished(status) : {};
    const page = await this.prisma.cmsPage.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.featuredImageUrl !== undefined ? { featuredImageUrl: dto.featuredImageUrl } : {}),
        ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
        ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription } : {}),
        ...(dto.seoKeywords !== undefined ? { seoKeywords: dto.seoKeywords } : {}),
        ...(dto.canonicalUrl !== undefined ? { canonicalUrl: dto.canonicalUrl } : {}),
        ...(dto.ogTitle !== undefined ? { ogTitle: dto.ogTitle } : {}),
        ...(dto.ogDescription !== undefined ? { ogDescription: dto.ogDescription } : {}),
        ...(dto.ogImage !== undefined ? { ogImage: dto.ogImage } : {}),
        ...sync,
        ...(dto.publishedAt !== undefined ? { publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null } : {}),
      },
    });
    await this.audit.log({ action: 'UPDATE', entity: 'CmsPage', entityId: id, userId });
    return page;
  }

  async setPageStatus(id: string, status: string, userId?: string) {
    return this.updatePage(id, { status }, userId);
  }

  async deletePage(id: string, userId?: string) {
    await this.getPage(id);
    await this.prisma.cmsPage.delete({ where: { id } });
    await this.audit.log({ action: 'DELETE', entity: 'CmsPage', entityId: id, userId });
    return { ok: true };
  }

  async listSections() {
    return this.prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async updateSection(id: string, dto: HomepageSectionDto, userId?: string) {
    try {
      const section = await this.prisma.homepageSection.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
          ...(dto.payload !== undefined ? { payload: dto.payload as Prisma.InputJsonValue } : {}),
        },
      });
      await this.audit.log({ action: 'UPDATE', entity: 'HomepageSection', entityId: id, userId });
      return section;
    } catch {
      throw new NotFoundException('Section not found');
    }
  }

  async reorderSections(items: Array<{ id: string; sortOrder: number }>, userId?: string) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.homepageSection.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    await this.audit.log({ action: 'REORDER', entity: 'HomepageSection', userId });
    return this.listSections();
  }

  async listBanners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async getBanner(id: string) {
    const b = await this.prisma.banner.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Banner not found');
    return b;
  }

  async createBanner(dto: BannerDto, userId?: string) {
    if (!dto.desktopImageUrl) throw new BadRequestException('Desktop image is required');
    const banner = await this.prisma.banner.create({
      data: {
        desktopImageUrl: dto.desktopImageUrl,
        mobileImageUrl: dto.mobileImageUrl ?? undefined,
        title: dto.title ?? undefined,
        subtitle: dto.subtitle ?? undefined,
        buttonText: dto.buttonText ?? undefined,
        buttonLink: dto.buttonLink ?? undefined,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        status: dto.status ?? 'DRAFT',
        sortOrder: dto.sortOrder ?? 0,
      },
    });
    await this.audit.log({ action: 'CREATE', entity: 'Banner', entityId: banner.id, userId });
    return banner;
  }

  async updateBanner(id: string, dto: Partial<BannerDto>, userId?: string) {
    await this.getBanner(id);
    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        ...(dto.desktopImageUrl !== undefined ? { desktopImageUrl: dto.desktopImageUrl } : {}),
        ...(dto.mobileImageUrl !== undefined ? { mobileImageUrl: dto.mobileImageUrl } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.subtitle !== undefined ? { subtitle: dto.subtitle } : {}),
        ...(dto.buttonText !== undefined ? { buttonText: dto.buttonText } : {}),
        ...(dto.buttonLink !== undefined ? { buttonLink: dto.buttonLink } : {}),
        ...(dto.startsAt !== undefined ? { startsAt: dto.startsAt ? new Date(dto.startsAt) : null } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
    await this.audit.log({ action: 'UPDATE', entity: 'Banner', entityId: id, userId });
    return banner;
  }

  async deleteBanner(id: string, userId?: string) {
    await this.getBanner(id);
    await this.prisma.banner.delete({ where: { id } });
    await this.audit.log({ action: 'DELETE', entity: 'Banner', entityId: id, userId });
    return { ok: true };
  }

  async listBlog(params: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Prisma.BlogPostWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [{ title: { contains: q } }, { slug: { contains: q } }];
    }
    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { tags: true },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return {
      items: items.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag) })),
      total,
      page,
      limit,
    };
  }

  async getBlog(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return { ...post, tags: post.tags.map((t) => t.tag) };
  }

  async createBlog(dto: BlogPostDto, userId?: string) {
    if (!dto.title || !dto.slug) throw new BadRequestException('Title and slug are required');
    const status = dto.status ?? 'DRAFT';
    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content ?? '',
        excerpt: dto.excerpt ?? undefined,
        featuredImageUrl: dto.featuredImageUrl ?? undefined,
        authorName: dto.authorName ?? undefined,
        category: dto.category ?? undefined,
        status,
        publishedAt:
          status === 'PUBLISHED'
            ? dto.publishedAt
              ? new Date(dto.publishedAt)
              : new Date()
            : dto.publishedAt
              ? new Date(dto.publishedAt)
              : undefined,
        seoTitle: dto.seoTitle ?? undefined,
        seoDescription: dto.seoDescription ?? undefined,
        seoKeywords: dto.seoKeywords ?? undefined,
        canonicalUrl: dto.canonicalUrl ?? undefined,
        ogTitle: dto.ogTitle ?? undefined,
        ogDescription: dto.ogDescription ?? undefined,
        ogImage: dto.ogImage ?? undefined,
        tags: dto.tags?.length
          ? { create: dto.tags.map((tag) => ({ tag })) }
          : undefined,
      },
      include: { tags: true },
    });
    await this.audit.log({ action: 'CREATE', entity: 'BlogPost', entityId: post.id, userId });
    return { ...post, tags: post.tags.map((t) => t.tag) };
  }

  async updateBlog(id: string, dto: Partial<BlogPostDto>, userId?: string) {
    await this.getBlog(id);
    if (dto.tags) {
      await this.prisma.blogPostTag.deleteMany({ where: { postId: id } });
    }
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
        ...(dto.featuredImageUrl !== undefined ? { featuredImageUrl: dto.featuredImageUrl } : {}),
        ...(dto.authorName !== undefined ? { authorName: dto.authorName } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.status !== undefined
          ? {
              status: dto.status,
              publishedAt:
                dto.status === 'PUBLISHED'
                  ? dto.publishedAt
                    ? new Date(dto.publishedAt)
                    : new Date()
                  : dto.publishedAt
                    ? new Date(dto.publishedAt)
                    : undefined,
            }
          : {}),
        ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
        ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription } : {}),
        ...(dto.seoKeywords !== undefined ? { seoKeywords: dto.seoKeywords } : {}),
        ...(dto.canonicalUrl !== undefined ? { canonicalUrl: dto.canonicalUrl } : {}),
        ...(dto.ogTitle !== undefined ? { ogTitle: dto.ogTitle } : {}),
        ...(dto.ogDescription !== undefined ? { ogDescription: dto.ogDescription } : {}),
        ...(dto.ogImage !== undefined ? { ogImage: dto.ogImage } : {}),
        ...(dto.tags
          ? { tags: { create: dto.tags.map((tag) => ({ tag })) } }
          : {}),
      },
      include: { tags: true },
    });
    await this.audit.log({ action: 'UPDATE', entity: 'BlogPost', entityId: id, userId });
    return { ...post, tags: post.tags.map((t) => t.tag) };
  }

  async deleteBlog(id: string, userId?: string) {
    await this.getBlog(id);
    await this.prisma.blogPost.delete({ where: { id } });
    await this.audit.log({ action: 'DELETE', entity: 'BlogPost', entityId: id, userId });
    return { ok: true };
  }

  async listMedia(search?: string) {
    return this.prisma.mediaAsset.findMany({
      where: search?.trim()
        ? {
            OR: [
              { filename: { contains: search.trim() } },
              { altText: { contains: search.trim() } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMedia(data: {
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    altText?: string;
  }) {
    return this.prisma.mediaAsset.create({ data });
  }

  async updateMediaAlt(id: string, altText?: string | null) {
    try {
      return await this.prisma.mediaAsset.update({
        where: { id },
        data: { altText: altText ?? null },
      });
    } catch {
      throw new NotFoundException('Media not found');
    }
  }

  async deleteMedia(id: string, userId?: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Media not found');
    await this.prisma.mediaAsset.delete({ where: { id } });
    await this.audit.log({ action: 'DELETE', entity: 'MediaAsset', entityId: id, userId });
    return asset;
  }

  async listNav() {
    return this.prisma.navMenu.findMany({
      include: { items: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { location: 'asc' },
    });
  }

  async saveNav(location: string, dto: SaveNavMenuDto, userId?: string) {
    const menu = await this.prisma.navMenu.findUnique({ where: { location } });
    if (!menu) throw new NotFoundException('Menu not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.navItem.deleteMany({ where: { menuId: menu.id } });
      for (const item of dto.items) {
        await tx.navItem.create({
          data: {
            menuId: menu.id,
            label: item.label,
            url: item.url,
            parentId: item.parentId ?? undefined,
            sortOrder: item.sortOrder ?? 0,
            enabled: item.enabled ?? true,
          },
        });
      }
    });
    await this.audit.log({ action: 'UPDATE', entity: 'NavMenu', entityId: menu.id, userId });
    return this.prisma.navMenu.findUnique({
      where: { id: menu.id },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async getCmsSettings() {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: [...CMS_SETTING_KEYS] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  }

  async updateCmsSettings(dto: CmsSettingsDto, userId?: string) {
    const entries = Object.entries(dto).filter(
      ([, v]) => v !== undefined,
    ) as Array<[string, string]>;
    for (const [key, value] of entries) {
      await this.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    await this.audit.log({ action: 'UPDATE', entity: 'CmsSettings', userId });
    return this.getCmsSettings();
  }
}
