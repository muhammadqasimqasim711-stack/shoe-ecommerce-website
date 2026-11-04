import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShippingRatesDto } from './dto/shipping-rates.dto';
import { ShippingService } from './shipping.service';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('rates')
  @ApiOperation({ summary: 'Get shipping rates for a cart' })
  getRates(@Body() body: ShippingRatesDto) {
    return this.shippingService.getRates(body.cartId, body.country, body.zipCode);
  }
}
