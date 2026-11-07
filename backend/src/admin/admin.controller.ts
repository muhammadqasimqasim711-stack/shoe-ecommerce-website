import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminRoleGuard } from '../auth/admin-role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthPayload } from '../auth/current-user.decorator';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PERMISSIONS } from '../common/staff-roles';
import { AdminService } from './admin.service';
import {
  AdminListQueryDto,
  CategoryDto,
  CouponDto,
  CreateAdminUserDto,
  CreateBrandDto,
  CreateProductDto,
  CustomerNoteDto,
  ReorderCategoriesDto,
  ReturnRequestDto,
  SettingsDto,
  StockAdjustDto,
  UpdateAdminUserDto,
  UpdateBrandDto,
  UpdateCustomerDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateReturnDto,
  UpdateReviewDto,
  UpdateVariantDto,
} from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  @RequirePermissions(PERMISSIONS.DASHBOARD)
  @ApiOperation({ summary: 'Admin dashboard stats' })
  stats() {
    return this.admin.stats();
  }

  @Get('analytics')
  @RequirePermissions(PERMISSIONS.ANALYTICS)
  analytics(@Query() query: AdminListQueryDto) {
    return this.admin.analytics({
      range: query.range,
      from: query.from,
      to: query.to,
    });
  }

  // ---- Products ----
  @Get('products')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  products(@Query() query: AdminListQueryDto) {
    return this.admin.listProducts({
      search: query.search,
      status: query.status,
      category: query.category,
      brandId: query.brandId,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('products/:id')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  product(@Param('id') id: string) {
    return this.admin.getProduct(id);
  }

  @Post('products')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  createProduct(@Body() body: CreateProductDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createProduct(body, user?.sub);
  }

  @Patch('products/:id')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateProduct(id, body, user?.sub);
  }

  @Post('products/:id/duplicate')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  duplicateProduct(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.duplicateProduct(id, user?.sub);
  }

  @Post('products/:id/archive')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  archiveProduct(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.archiveProduct(id, user?.sub);
  }

  @Post('products/:id/restore')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  restoreProduct(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.restoreProduct(id, user?.sub);
  }

  @Delete('products/:id')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  deleteProduct(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.deleteProduct(id, user?.sub);
  }

  // ---- Brands ----
  @Get('brands')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  brands() {
    return this.admin.listBrands();
  }

  @Post('brands')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  createBrand(@Body() body: CreateBrandDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createBrand(body, user?.sub);
  }

  @Patch('brands/:id')
  @RequirePermissions(PERMISSIONS.PRODUCTS)
  updateBrand(
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateBrand(id, body, user?.sub);
  }

  @Patch('variants/:id')
  @RequirePermissions(PERMISSIONS.PRODUCTS, PERMISSIONS.INVENTORY)
  updateVariant(
    @Param('id') id: string,
    @Body() body: UpdateVariantDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateVariant(id, body, user?.sub);
  }

  // ---- Categories ----
  @Get('categories')
  @RequirePermissions(PERMISSIONS.CATEGORIES, PERMISSIONS.PRODUCTS)
  categories() {
    return this.admin.listCategories();
  }

  @Post('categories')
  @RequirePermissions(PERMISSIONS.CATEGORIES)
  createCategory(@Body() body: CategoryDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createCategory(body, user?.sub);
  }

  @Patch('categories/:id')
  @RequirePermissions(PERMISSIONS.CATEGORIES)
  updateCategory(
    @Param('id') id: string,
    @Body() body: CategoryDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateCategory(id, body, user?.sub);
  }

  @Delete('categories/:id')
  @RequirePermissions(PERMISSIONS.CATEGORIES)
  deleteCategory(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.deleteCategory(id, user?.sub);
  }

  @Post('categories/reorder')
  @RequirePermissions(PERMISSIONS.CATEGORIES)
  reorderCategories(@Body() body: ReorderCategoriesDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.reorderCategories(body, user?.sub);
  }

  // ---- Inventory ----
  @Get('inventory')
  @RequirePermissions(PERMISSIONS.INVENTORY)
  inventory(@Query() query: AdminListQueryDto) {
    return this.admin.listInventory({
      search: query.search,
      lowStock: query.lowStock,
      page: query.page,
      limit: query.limit,
    });
  }

  @Post('inventory/:variantId/adjust')
  @RequirePermissions(PERMISSIONS.INVENTORY)
  adjustStock(
    @Param('variantId') variantId: string,
    @Body() body: StockAdjustDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.adjustStock(variantId, body, user?.sub);
  }

  // ---- Orders ----
  @Get('orders')
  @RequirePermissions(PERMISSIONS.ORDERS)
  orders(@Query() query: AdminListQueryDto) {
    return this.admin.listOrders({
      status: query.status,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('orders/:id')
  @RequirePermissions(PERMISSIONS.ORDERS)
  order(@Param('id') id: string) {
    return this.admin.getOrder(id);
  }

  @Patch('orders/:id')
  @RequirePermissions(PERMISSIONS.ORDERS)
  updateOrder(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateOrderStatus(
      id,
      body.status,
      user?.sub,
      body.note,
      body.trackingNumber,
      body.shippingStatus,
    );
  }

  // ---- Customers & CRM ----
  @Get('crm/stats')
  @RequirePermissions(PERMISSIONS.CUSTOMERS)
  @ApiOperation({ summary: 'CRM executive analytics, segments, and top customer metrics' })
  crmStats() {
    return this.admin.crmStats();
  }

  @Get('customers')
  @RequirePermissions(PERMISSIONS.CUSTOMERS)
  customers(@Query() query: AdminListQueryDto) {
    return this.admin.listCustomers({
      search: query.search,
      segment: query.segment,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('customers/:id')
  @RequirePermissions(PERMISSIONS.CUSTOMERS)
  customer(@Param('id') id: string) {
    return this.admin.getCustomer(id);
  }

  @Patch('customers/:id')
  @RequirePermissions(PERMISSIONS.CUSTOMERS)
  updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateCustomer(id, body, user?.sub);
  }

  @Post('customers/:id/notes')
  @RequirePermissions(PERMISSIONS.CUSTOMERS)
  addCustomerNote(
    @Param('id') id: string,
    @Body() body: CustomerNoteDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.addCustomerNote(id, body, user!.sub);
  }

  // ---- Reviews ----
  @Get('reviews')
  @RequirePermissions(PERMISSIONS.REVIEWS)
  reviews(@Query() query: AdminListQueryDto) {
    return this.admin.listReviews({
      approved: query.approved,
      limit: query.limit,
    });
  }

  @Patch('reviews/:id')
  @RequirePermissions(PERMISSIONS.REVIEWS)
  updateReview(
    @Param('id') id: string,
    @Body() body: UpdateReviewDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateReview(
      id,
      { approved: body.approved, hidden: body.hidden },
      user?.sub,
    );
  }

  @Delete('reviews/:id')
  @RequirePermissions(PERMISSIONS.REVIEWS)
  deleteReview(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.deleteReview(id, user?.sub);
  }

  // ---- Coupons ----
  @Get('coupons')
  @RequirePermissions(PERMISSIONS.COUPONS)
  coupons() {
    return this.admin.listCoupons();
  }

  @Post('coupons')
  @RequirePermissions(PERMISSIONS.COUPONS)
  createCoupon(@Body() body: CouponDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createCoupon(body, user?.sub);
  }

  @Patch('coupons/:id')
  @RequirePermissions(PERMISSIONS.COUPONS)
  updateCoupon(
    @Param('id') id: string,
    @Body() body: CouponDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateCoupon(id, body, user?.sub);
  }

  @Delete('coupons/:id')
  @RequirePermissions(PERMISSIONS.COUPONS)
  deleteCoupon(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.deleteCoupon(id, user?.sub);
  }

  // ---- Returns / Refunds ----
  @Get('returns')
  @RequirePermissions(PERMISSIONS.RETURNS)
  returns(@Query() query: AdminListQueryDto) {
    return this.admin.listReturns({ status: query.status, limit: query.limit });
  }

  @Get('returns/:id')
  @RequirePermissions(PERMISSIONS.RETURNS)
  getReturn(@Param('id') id: string) {
    return this.admin.getReturn(id);
  }

  @Post('returns')
  @RequirePermissions(PERMISSIONS.RETURNS)
  createReturn(@Body() body: ReturnRequestDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createReturn(body, user?.sub);
  }

  @Patch('returns/:id')
  @RequirePermissions(PERMISSIONS.RETURNS)
  updateReturn(
    @Param('id') id: string,
    @Body() body: UpdateReturnDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateReturn(id, body, user?.sub);
  }

  @Get('refunds')
  @RequirePermissions(PERMISSIONS.RETURNS, PERMISSIONS.PAYMENTS)
  refunds(@Query() query: AdminListQueryDto) {
    return this.admin.listRefunds(query.limit);
  }

  // ---- Payments ----
  @Get('payments')
  @RequirePermissions(PERMISSIONS.PAYMENTS)
  payments(@Query() query: AdminListQueryDto) {
    return this.admin.listPayments({
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  // ---- Shipping / Settings ----
  @Get('shipping/settings')
  @RequirePermissions(PERMISSIONS.SHIPPING, PERMISSIONS.SETTINGS)
  shippingSettings() {
    return this.admin.getShippingSettings();
  }

  @Patch('shipping/settings')
  @RequirePermissions(PERMISSIONS.SHIPPING, PERMISSIONS.SETTINGS)
  updateShippingSettings(@Body() body: SettingsDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.updateShippingSettings(body, user?.sub);
  }

  @Get('settings')
  @RequirePermissions(PERMISSIONS.SETTINGS)
  settings() {
    return this.admin.getSettings();
  }

  @Patch('settings')
  @RequirePermissions(PERMISSIONS.SETTINGS)
  updateSettings(@Body() body: SettingsDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.updateSettings(body, user?.sub);
  }

  // ---- Admin users / roles / audit / notifications ----
  @Get('users')
  @RequirePermissions(PERMISSIONS.ADMIN_USERS)
  adminUsers() {
    return this.admin.listAdminUsers();
  }

  @Post('users')
  @RequirePermissions(PERMISSIONS.ADMIN_USERS)
  createAdminUser(@Body() body: CreateAdminUserDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.createAdminUser(body, user?.sub);
  }

  @Patch('users/:id')
  @RequirePermissions(PERMISSIONS.ADMIN_USERS)
  updateAdminUser(
    @Param('id') id: string,
    @Body() body: UpdateAdminUserDto,
    @CurrentUser() user?: AuthPayload,
  ) {
    return this.admin.updateAdminUser(id, body, user?.sub);
  }

  @Get('roles')
  @RequirePermissions(PERMISSIONS.ADMIN_USERS)
  roles() {
    return this.admin.listRoles();
  }

  @Get('audit-logs')
  @RequirePermissions(PERMISSIONS.AUDIT)
  auditLogs(@Query() query: AdminListQueryDto) {
    return this.admin.listAuditLogs(query.limit, query.search);
  }

  @Get('notifications')
  @RequirePermissions(PERMISSIONS.NOTIFICATIONS)
  notifications(@Query() query: AdminListQueryDto, @CurrentUser() user?: AuthPayload) {
    return this.admin.listNotifications(user!.sub, query.limit);
  }

  @Post('notifications/:id/read')
  @RequirePermissions(PERMISSIONS.NOTIFICATIONS)
  markNotificationRead(@Param('id') id: string, @CurrentUser() user?: AuthPayload) {
    return this.admin.markNotificationRead(id, user!.sub);
  }

  @Post('notifications/read-all')
  @RequirePermissions(PERMISSIONS.NOTIFICATIONS)
  markAllNotificationsRead(@CurrentUser() user?: AuthPayload) {
    return this.admin.markAllNotificationsRead(user!.sub);
  }

  // ---- Legacy support / newsletter ----
  @Get('support')
  support(@Query() query: AdminListQueryDto) {
    return this.admin.listSupport(query.limit);
  }

  @Get('support/:id')
  supportOne(@Param('id') id: string) {
    return this.admin.getSupport(id);
  }

  @Get('newsletter')
  newsletter(@Query() query: AdminListQueryDto) {
    return this.admin.listNewsletter(query.limit);
  }

  @Delete('newsletter/:id')
  deleteNewsletter(@Param('id') id: string) {
    return this.admin.deleteNewsletter(id);
  }
}
