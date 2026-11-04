import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a guest cart' })
  create() {
    return this.cartService.create();
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get cart by ID' })
  findOne(@Param('cartId') cartId: string) {
    return this.cartService.findOne(cartId);
  }

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Param('cartId') cartId: string, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(cartId, body.variantId, body.quantity ?? 1);
  }

  @Patch(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(cartId, itemId, body.quantity);
  }

  @Delete(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Remove cart item' })
  removeItem(@Param('cartId') cartId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(cartId, itemId);
  }

  @Post(':cartId/coupon')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  applyCoupon(@Param('cartId') cartId: string, @Body() body: ApplyCouponDto) {
    return this.cartService.applyCoupon(cartId, body.code);
  }

  @Delete(':cartId/coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  removeCoupon(@Param('cartId') cartId: string) {
    return this.cartService.removeCoupon(cartId);
  }
}
