import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
} from '../client/warehouse/warehouse-responses.interface';
import { OrderRequest } from '../model/interface/order-request.interface';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  create(
    @Body() orderRequest: OrderRequest,
  ):
    | Promise<
        | OrderAcceptedResponse
        | OrderScheduledResponse
        | OrderPartiallyAcceptedResponse
        | OrderRejectedResponse
        | WarehouseNotReadyResponse
      >
    | string {
    try {
      return this.orderService.createOrder(orderRequest);
    } catch {
      return 'Failed to create an order.';
    }
  }
}
