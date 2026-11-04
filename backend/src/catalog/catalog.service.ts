import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
  ) {}

  async getHomepage() {
    const [products, categories, brands] = await Promise.all([
      this.productsService.findAll({ sort: 'trending', limit: 20 }),
      this.categoriesService.findAllWithCounts(),
      this.brandsService.findAll(),
    ]);

    return {
      products,
      categories,
      brands: brands.map((b) => b.name.toUpperCase()),
    };
  }
}
