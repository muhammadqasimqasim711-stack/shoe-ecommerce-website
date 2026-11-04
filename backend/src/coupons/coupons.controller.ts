import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('validate')
  @ApiOperation({ summary: 'Validate a coupon against a cart' })
  validate(@Query('code') code: string, @Query('cartId') cartId: string) {
    return this.couponsService.validate(code, cartId);
  }
}
