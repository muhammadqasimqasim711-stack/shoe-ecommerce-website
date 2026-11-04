import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CmsService } from './cms.service';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('home')
  @ApiOperation({ summary: 'Published homepage sections' })
  getHome() {
    return this.cmsService.getHome();
  }

  @Get('banners')
  @ApiOperation({ summary: 'Active published banners' })
  getBanners() {
    return this.cmsService.getBanners();
  }

  @Get('nav')
  @ApiOperation({ summary: 'Enabled navigation menus' })
  getNav() {
    return this.cmsService.getNav();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Public site settings' })
  getSettings() {
    return this.cmsService.getPublicSettings();
  }

  @Get('blog')
  @ApiOperation({ summary: 'Published blog posts' })
  listBlog() {
    return this.cmsService.listBlog();
  }

  @Get('blog/:slug')
  @ApiOperation({ summary: 'Published blog post' })
  getBlog(@Param('slug') slug: string) {
    return this.cmsService.getBlogBySlug(slug);
  }

  @Get('pages')
  @ApiOperation({ summary: 'List published CMS pages' })
  findAll(@Query('type') type?: string) {
    return this.cmsService.findAll(type);
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get a published CMS page by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }
}
