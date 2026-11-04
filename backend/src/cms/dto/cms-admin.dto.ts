import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export const CMS_STATUSES = ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] as const;

export class CmsPageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn([...CMS_STATUSES])
  status?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsString()
  featuredImageUrl?: string | null;

  @IsOptional()
  @IsString()
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  seoKeywords?: string | null;

  @IsOptional()
  @IsString()
  canonicalUrl?: string | null;

  @IsOptional()
  @IsString()
  ogTitle?: string | null;

  @IsOptional()
  @IsString()
  ogDescription?: string | null;

  @IsOptional()
  @IsString()
  ogImage?: string | null;
}

export class HomepageSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @IsIn([...CMS_STATUSES])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}

export class BannerDto {
  @IsOptional()
  @IsString()
  desktopImageUrl?: string;

  @IsOptional()
  @IsString()
  mobileImageUrl?: string | null;

  @IsOptional()
  @IsString()
  title?: string | null;

  @IsOptional()
  @IsString()
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  buttonText?: string | null;

  @IsOptional()
  @IsString()
  buttonLink?: string | null;

  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @IsOptional()
  @IsDateString()
  endsAt?: string | null;

  @IsOptional()
  @IsString()
  @IsIn([...CMS_STATUSES])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class BlogPostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  excerpt?: string | null;

  @IsOptional()
  @IsString()
  featuredImageUrl?: string | null;

  @IsOptional()
  @IsString()
  authorName?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @IsIn([...CMS_STATUSES])
  status?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsString()
  seoKeywords?: string | null;

  @IsOptional()
  @IsString()
  canonicalUrl?: string | null;

  @IsOptional()
  @IsString()
  ogTitle?: string | null;

  @IsOptional()
  @IsString()
  ogDescription?: string | null;

  @IsOptional()
  @IsString()
  ogImage?: string | null;
}

export class NavItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  label!: string;

  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class SaveNavMenuDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  items!: NavItemDto[];
}

export class ReorderDto {
  @IsArray()
  items!: Array<{ id: string; sortOrder: number }>;
}

export class CmsSettingsDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactAddress?: string;

  @IsOptional()
  @IsString()
  socialLinksJson?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsString()
  newsletterHeading?: string;

  @IsOptional()
  @IsString()
  newsletterSubtext?: string;

  @IsOptional()
  @IsString()
  defaultSeoTitle?: string;

  @IsOptional()
  @IsString()
  defaultSeoDescription?: string;

  @IsOptional()
  @IsString()
  defaultOgImage?: string;
}

export class MediaAltDto {
  @IsOptional()
  @IsString()
  altText?: string | null;
}

export class CmsListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
