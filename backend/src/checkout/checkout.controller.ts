import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CheckoutPreviewDto, PlaceOrderDto } from './dto/checkout.dto';
import { CheckoutService } from './checkout.service';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('preview')
  @ApiOperation({ summary: 'Preview checkout totals without creating an order' })
  preview(@Body() body: CheckoutPreviewDto) {
    return this.checkoutService.preview(body.cartId, body.shippingMethod, body.couponCode);
  }

  @Post('place')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place a pending order from cart' })
  place(
    @Body() body: PlaceOrderDto,
    @Req() req: { user?: { sub: string; email: string; role: string } },
  ) {
    return this.checkoutService.place(body, req.user ?? null);
  }
}
