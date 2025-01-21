import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
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
import { OrderStatus } from '../model/enum/order-status.enum';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Incoming from the user application.
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
      return this.orderService.createOrderAndSendToWarehouse(orderRequest);
    } catch {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to create the order.');
    }
  }

  // Incoming from the warehouse application.
  @Patch('orders/:id')
  async updateOrder(
    @Body() orderRequest: { id: string; status: OrderStatus },
  ): Promise<void> {
    const { id, status } = orderRequest;
    await this.orderService.updateOrder(id, status);
  }
}
