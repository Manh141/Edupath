import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { InternalService } from './internal.service';

@ApiTags('Internal Payments')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/payments')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @ApiOperation({ summary: 'Get order details for internal services' })
  @Get('orders/:orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.internalService.getOrder(orderId);
  }

  @ApiOperation({ summary: 'Get paid sales analytics for course ids' })
  @Post('analytics/course-sales')
  getCourseSalesAnalytics(
    @Body() body: { courseIds?: string[]; days?: number; instructorShareBps?: number },
  ) {
    return this.internalService.getCourseSalesAnalytics(
      Array.isArray(body.courseIds) ? body.courseIds : [],
      body.days,
      body.instructorShareBps,
    );
  }

  @ApiOperation({ summary: 'Refund an order from an internal service' })
  @Post('orders/:orderId/refund')
  refund(@Param('orderId') orderId: string, @Body() body: { reason?: string }) {
    return this.internalService.refundOrder(orderId, body.reason);
  }
}
