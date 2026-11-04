import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminRoleGuard } from '../auth/admin-role.guard';
import { CurrentUser, AuthPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PERMISSIONS } from '../common/staff-roles';
import { FilesService } from '../files/files.service';
import { CmsAdminService } from './cms-admin.service';
import {
  BannerDto,
  BlogPostDto,
  CmsListQueryDto,
  CmsPageDto,
  CmsSettingsDto,
  HomepageSectionDto,
  MediaAltDto,
  ReorderDto,
  SaveNavMenuDto,
} from './dto/cms-admin.dto';

@ApiTags('Admin CMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/cms')
export class CmsAdminController {
  constructor(
    private readonly cms: CmsAdminService,
    private readonly files: FilesService,
  ) {}

  @Get('dashboard')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  dashboard() {
    return this.cms.dashboard();
  }

  @Get('pages')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  pages(@Query() query: CmsListQueryDto) {
    return this.cms.listPages(query);
  }

  @Get('pages/:id')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  page(@Param('id') id: string) {
    return this.cms.getPage(id);
  }

  @Post('pages')
  @RequirePermissions(PERMISSIONS.CMS_CREATE)
  createPage(@Body() body: CmsPageDto, @CurrentUser() user?: AuthPayload) {
    return this.cms.createPage(body, user?.sub);
  }

  @Patch('pages/:id')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  updatePage(
    @Param('id') id: string,
    @Body() body: CmsPageDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.cms.updatePage(id, body, user?.sub);
  }

  @Post('pages/:id/publish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  publishPage(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.setPageStatus(id, 'PUBLISHED', user?.sub);
  }

  @Post('pages/:id/unpublish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  unpublishPage(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.setPageStatus(id, 'DRAFT', user?.sub);
  }

  @Delete('pages/:id')
  @RequirePermissions(PERMISSIONS.CMS_DELETE)
  deletePage(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.deletePage(id, user?.sub);
  }

  @Get('homepage')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  homepage() {
    return this.cms.listSections();
  }

  @Patch('homepage/:id')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  updateSection(
    @Param('id') id: string,
    @Body() body: HomepageSectionDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.cms.updateSection(id, body, user?.sub);
  }

  @Post('homepage/reorder')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  reorderHomepage(@Body() body: ReorderDto, @CurrentUser() user?: AuthPayload) {
    return this.cms.reorderSections(body.items, user?.sub);
  }

  @Get('banners')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  banners() {
    return this.cms.listBanners();
  }

  @Post('banners')
  @RequirePermissions(PERMISSIONS.CMS_CREATE)
  createBanner(@Body() body: BannerDto, @CurrentUser() user?: AuthPayload) {
    return this.cms.createBanner(body, user?.sub);
  }

  @Patch('banners/:id')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  updateBanner(
    @Param('id') id: string,
    @Body() body: BannerDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.cms.updateBanner(id, body, user?.sub);
  }

  @Post('banners/:id/publish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  publishBanner(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.updateBanner(id, { status: 'PUBLISHED' }, user?.sub);
  }

  @Post('banners/:id/unpublish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  unpublishBanner(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.updateBanner(id, { status: 'DRAFT' }, user?.sub);
  }

  @Delete('banners/:id')
  @RequirePermissions(PERMISSIONS.CMS_DELETE)
  deleteBanner(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.deleteBanner(id, user?.sub);
  }

  @Get('blog')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  blog(@Query() query: CmsListQueryDto) {
    return this.cms.listBlog(query);
  }

  @Get('blog/:id')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  blogOne(@Param('id') id: string) {
    return this.cms.getBlog(id);
  }

  @Post('blog')
  @RequirePermissions(PERMISSIONS.CMS_CREATE)
  createBlog(@Body() body: BlogPostDto, @CurrentUser() user?: AuthPayload) {
    return this.cms.createBlog(body, user?.sub);
  }

  @Patch('blog/:id')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  updateBlog(
    @Param('id') id: string,
    @Body() body: BlogPostDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.cms.updateBlog(id, body, user?.sub);
  }

  @Post('blog/:id/publish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  publishBlog(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.updateBlog(id, { status: 'PUBLISHED' }, user?.sub);
  }

  @Post('blog/:id/unpublish')
  @RequirePermissions(PERMISSIONS.CMS_PUBLISH)
  unpublishBlog(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.updateBlog(id, { status: 'DRAFT' }, user?.sub);
  }

  @Delete('blog/:id')
  @RequirePermissions(PERMISSIONS.CMS_DELETE)
  deleteBlog(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.cms.deleteBlog(id, user?.sub);
  }

  @Get('media')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  media(@Query('search') search?: string) {
    return this.cms.listMedia(search);
  }

  @Post('media')
  @RequirePermissions(PERMISSIONS.MEDIA_UPLOAD)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: { originalname: string; mimetype: string; size: number; buffer?: Buffer; filename?: string; path?: string },
    @CurrentUser() user?: AuthPayload,
  ) {
    if (!file?.originalname) throw new BadRequestException('File is required');
    const saved = await this.files.saveUpload(file);
    return this.cms.createMedia({
      ...saved,
      altText: undefined,
    });
  }

  @Patch('media/:id')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  updateMedia(@Param('id') id: string, @Body() body: MediaAltDto) {
    return this.cms.updateMediaAlt(id, body.altText);
  }

  @Delete('media/:id')
  @RequirePermissions(PERMISSIONS.MEDIA_DELETE)
  async deleteMedia(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    const asset = await this.cms.deleteMedia(id, user?.sub);
    await this.files.removeByUrl(asset.url);
    return { ok: true };
  }

  @Get('navigation')
  @RequirePermissions(PERMISSIONS.CMS_VIEW)
  navigation() {
    return this.cms.listNav();
  }

  @Patch('navigation/:location')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE)
  saveNav(
    @Param('location') location: string,
    @Body() body: SaveNavMenuDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.cms.saveNav(location, body, user?.sub);
  }

  @Get('settings')
  @RequirePermissions(PERMISSIONS.CMS_VIEW, PERMISSIONS.SEO_MANAGE)
  settings() {
    return this.cms.getCmsSettings();
  }

  @Patch('settings')
  @RequirePermissions(PERMISSIONS.CMS_UPDATE, PERMISSIONS.SEO_MANAGE)
  updateSettings(@Body() body: CmsSettingsDto, @CurrentUser() user?: AuthPayload) {
    return this.cms.updateCmsSettings(body, user?.sub);
  }
}
