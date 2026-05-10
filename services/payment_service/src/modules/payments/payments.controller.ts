import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUserInterface } from '../../common/interfaces/current-user.interface';
import { PaymentsService } from './payments.service';
import { ProviderCallbackDto } from './dto/provider-callback.dto';
import { SimulatePaymentDto } from './dto/simulate-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction details by transaction id' })
  @Get('transactions/:transactionId')
  getTransaction(
    @Param('transactionId') transactionId: string,
    @CurrentUser() currentUser: CurrentUserInterface,
  ) {
    return this.paymentsService.getTransaction(transactionId, currentUser);
  }

  @Public()
  @ApiOperation({ summary: 'Handle asynchronous payment provider callback' })
  @Post('callbacks/provider')
  providerCallback(@Body() dto: ProviderCallbackDto) {
    return this.paymentsService.handleProviderCallback(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Simulate the outcome of a pending transaction (sandbox / dev only). Requires PAYMENT_SANDBOX_MODE.',
  })
  @Post('transactions/:transactionId/simulate')
  simulate(
    @Param('transactionId') transactionId: string,
    @Body() dto: SimulatePaymentDto,
    @CurrentUser() currentUser: CurrentUserInterface,
  ) {
    return this.paymentsService.simulateTransaction(transactionId, dto, currentUser);
  }
}
