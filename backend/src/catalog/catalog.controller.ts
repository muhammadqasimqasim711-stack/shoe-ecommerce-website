import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('home')
  @ApiOperation({ summary: 'Homepage catalog data (products, categories, brands)' })
  getHomepage() {
    return this.catalogService.getHomepage();
  }
}
