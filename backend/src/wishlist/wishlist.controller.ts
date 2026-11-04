import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a guest wishlist' })
  create() {
    return this.wishlistService.create();
  }

  @Get(':wishlistId')
  @ApiOperation({ summary: 'Get wishlist by ID' })
  findOne(@Param('wishlistId') wishlistId: string) {
    return this.wishlistService.findOne(wishlistId);
  }

  @Post(':wishlistId/items')
  @ApiOperation({ summary: 'Add item to wishlist' })
  addItem(@Param('wishlistId') wishlistId: string, @Body() body: AddWishlistItemDto) {
    return this.wishlistService.addItem(wishlistId, body.variantId);
  }

  @Delete(':wishlistId/items/:itemId')
  @ApiOperation({ summary: 'Remove wishlist item by item ID' })
  removeItem(@Param('wishlistId') wishlistId: string, @Param('itemId') itemId: string) {
    return this.wishlistService.removeItem(wishlistId, itemId);
  }

  @Delete(':wishlistId/variants/:variantId')
  @ApiOperation({ summary: 'Remove wishlist item by variant ID' })
  removeByVariant(
    @Param('wishlistId') wishlistId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.wishlistService.removeByVariant(wishlistId, variantId);
  }
}
