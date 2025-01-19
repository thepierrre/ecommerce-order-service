import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderRequest } from '../model/interface/order-request.interface';
import { WarehouseClientService } from '../client/warehouse/warehouse-client.service';
import { Repository } from 'typeorm';
import { Order } from '../model/entity/order.entity';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
} from '../client/warehouse/warehouse-responses.interface';
import { OrderStatus } from '../model/enum/order-status.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(WarehouseClientService.name);

  constructor(
    private readonly warehouseClientService: WarehouseClientService,
    private orderRepository: Repository<Order>,
  ) {}

  async saveOrder(orderRequest: OrderRequest): Promise<Order> {
    try {
      const newOrder = this.orderRepository.create(orderRequest);
      return this.orderRepository.save(newOrder);
    } catch (error) {
      // Examine the difference in structure between error, error.response, error.data, error.stack etc.
      this.logger.error('Failed to save the order in the database: ', error);
      throw error;
    }
  }

  async updateOrder(orderId: string, status: OrderStatus): Promise<void> {
    const existingOrder = await this.orderRepository.findOneBy({ id: orderId });
    if (!existingOrder) {
      this.logger.error(`Order with the id ${orderId} not found.`);
      throw new NotFoundException(`Order with the id ${orderId} not found.`);
    }

    const updatedOrder = this.orderRepository.merge(existingOrder, { status });
    await this.orderRepository.save(updatedOrder);
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
    try {
      const warehouseResponse =
        await this.warehouseClientService.sendOrderToWarehouse(order);

      await this.updateOrder(order.id, warehouseResponse.status);

      return warehouseResponse;
    } catch (error) {
      this.logger.error(
        'Failed to send order to sendOrderToWarehouse: ',
        error,
      );

      await this.updateOrder(
        order.id,
        OrderStatus.WAREHOUSE_SERVICE_UNAVAILABLE,
      );

      throw error;
    }
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
    const order = await this.saveOrder(orderRequest);
    return await this.sendOrderToWarehouse(order);
  }
}
