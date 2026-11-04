import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my orders' })
  findMine(@Req() req: { user: { sub: string } }) {
    return this.ordersService.findMine(req.user.sub);
  }

  @Get(':orderId/confirmation')
  @ApiOperation({ summary: 'Order confirmation payload' })
  confirmation(@Param('orderId') orderId: string) {
    return this.ordersService.confirmation(orderId);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }
}
