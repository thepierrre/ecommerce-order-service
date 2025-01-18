import { Injectable, Logger } from '@nestjs/common';
import { OrderRequest } from '../model/interface/order-request.interface';
import { WarehouseClientService } from '../client/warehouse/warehouse-client.service';
import { DataSource } from 'typeorm';
import { Order } from '../model/entity/order.entity';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
} from '../client/warehouse/warehouse-responses.interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly warehouseClientService: WarehouseClientService,
    private dataSource: DataSource,
    private readonly logger = new Logger(WarehouseClientService.name),
  ) {}

  async saveOrderInternally(orderRequest: OrderRequest): Promise<Order> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        return await manager.save(Order, orderRequest);
      });
    } catch (error) {
      // Examine the difference in structure between error, error.response, error.data, error.stack etc.
      this.logger.error('Failed to save the order in the database: ', error);
      throw error;
    }
  }

  async sendOrderToWarehouse(
    order: Order,
  ): Promise<
    | OrderAcceptedResponse
    | OrderScheduledResponse
    | OrderPartiallyAcceptedResponse
    | OrderRejectedResponse
    | WarehouseNotReadyResponse
  > {
    return await this.warehouseClientService.sendOrderToWarehouse(order);
  }

  async createOrder(
    orderRequest: OrderRequest,
  ): Promise<
    | OrderAcceptedResponse
    | OrderScheduledResponse
    | OrderPartiallyAcceptedResponse
    | OrderRejectedResponse
    | WarehouseNotReadyResponse
  > {
    const order = await this.saveOrderInternally(orderRequest);
    return await this.sendOrderToWarehouse(order);
  }
}
