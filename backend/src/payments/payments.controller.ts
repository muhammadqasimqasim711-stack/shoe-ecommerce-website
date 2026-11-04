import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayOrderDto } from './dto/pay-order.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders/:orderId/pay')
  @ApiOperation({ summary: 'Pay for an order (mock)' })
  pay(@Param('orderId') orderId: string, @Body() body: PayOrderDto) {
    return this.paymentsService.pay(orderId, body.provider, body.cardLast4);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get payment status for an order' })
  getByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.getByOrder(orderId);
  }
}
