import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { WarehouseResponse } from '../../clients/warehouse/warehouse-responses.interface';
import { OrderRequest } from '../models/types/order-request.interface';
import { Response } from 'express';
import { OrderUpdateRequest } from '../../clients/notification/types/order-update-request.interface';
import { OrderReturn } from '../models/types/order-return.interface';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Incoming from the User Service.
  @Post('orders')
  createOrder(
    @Body() orderRequest: OrderRequest,
    @Res() response: Response,
  ): Promise<WarehouseResponse> | string {
    try {
      return this.orderService.createOrderAndSendToWarehouse(orderRequest);
    } catch {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to create the order.');
    }
  }

  // Incoming from the Warehouse Service.
  @Patch('orders/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() orderUpdateRequest: OrderUpdateRequest,
  ): Promise<void> {
    const orderUpdate = { ...orderUpdateRequest, id };
    await this.orderService.updateOrder(orderUpdate);
  }

  // Incoming from the User Service.
  @Patch('orders/:id/return')
  async createReturn(
    @Param('id') id: string,
    @Body() orderReturn: OrderReturn,
  ): Promise<void> {
    await this.orderService.createReturn(orderReturn);
  }
}
