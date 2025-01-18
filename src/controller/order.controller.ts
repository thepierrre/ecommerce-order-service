import { Controller, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
  WarehouseServiceUnavailableResponse,
} from '../client/warehouse/warehouse-responses.interface';
import { OrderRequest } from '../model/interface/order-request.interface';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  createOrder(
    orderRequest: OrderRequest,
  ):
    | OrderAcceptedResponse
    | OrderScheduledResponse
    | OrderPartiallyAcceptedResponse
    | OrderRejectedResponse
    | WarehouseNotReadyResponse
    | WarehouseServiceUnavailableResponse {
    return this.orderService.createOrder(orderRequest);
  }
}
