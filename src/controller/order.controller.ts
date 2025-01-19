import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
} from '../client/warehouse/warehouse-responses.interface';
import { OrderRequest } from '../model/interface/order-request.interface';
import { Response } from 'express';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  create(
    @Body() orderRequest: OrderRequest,
    @Res() response: Response,
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
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to create the order.');
    }
  }
}
