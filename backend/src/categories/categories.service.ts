import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: { children: true },
    });
  }

  async findAllWithCounts() {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: category._count.products,
      imageUrl: category.imageUrl,
    }));
  }
}
