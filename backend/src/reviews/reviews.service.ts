import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto } from './dto/review.dto';

export type ReviewPublicDto = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  authorName: string;
  productId: string;
  productName?: string;
};

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(opts: { productId?: string; limit?: number } = {}): Promise<ReviewPublicDto[]> {
    const limit = Math.min(Math.max(opts.limit ?? 20, 1), 50);

    const reviews = await this.prisma.review.findMany({
      where: {
        approved: true,
        hidden: false,
        ...(opts.productId ? { productId: opts.productId } : {}),
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return reviews.map((r) => this.toPublic(r));
  }

  async create(userId: string, productId: string, dto: CreateReviewDto): Promise<ReviewPublicDto> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isPublished: true, status: { not: 'ARCHIVED' } },
    });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const existing = await this.prisma.review.findFirst({
      where: { userId, productId },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        title: dto.title?.trim() || null,
        comment: dto.comment?.trim() || null,
        approved: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { name: true } },
      },
    });

    await this.notifications.notifyStaff('new_review', 'New product review', {
      reviewId: review.id,
      productId,
      productName: product.name,
      rating: dto.rating,
    });

    return this.toPublic(review);
  }

  private toPublic(r: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: Date;
    productId: string;
    user: { firstName: string | null; lastName: string | null; email: string };
    product: { name: string };
  }): ReviewPublicDto {
    return {
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt,
      authorName: this.displayName(r.user),
      productId: r.productId,
      productName: r.product.name,
    };
  }

  private displayName(user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  }): string {
    const first = user.firstName?.trim();
    const last = user.lastName?.trim();
    if (first && last) return `${first} ${last.charAt(0)}.`;
    if (first) return first;
    return user.email.split('@')[0] ?? 'Customer';
  }
}
