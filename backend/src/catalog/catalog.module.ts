import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';

@Module({
  imports: [ProductsModule, CategoriesModule, BrandsModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
