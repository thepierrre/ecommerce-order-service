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
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly warehouseClientService: WarehouseClientService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderRequest: OrderRequest): Promise<Order> {
    try {
      const newOrder = this.orderRepository.create({
        ...orderRequest,
        status: OrderStatus.PENDING,
      });
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      //TODO: Examine the difference in structure between error, error.response, error.data, error.stack etc.
      this.logger.error(`Failed to save the order: ${error.message}`);
      throw error;
    }
  }

  async updateOrder(orderId: string, orderStatus: OrderStatus): Promise<Order> {
    const existingOrder = await this.orderRepository.findOneBy({ id: orderId });
    if (!existingOrder) {
      this.logger.error(`Order with the id ${orderId} not found.`);
      throw new NotFoundException(`Order with the id ${orderId} not found.`);
    }

    const updatedOrder = this.orderRepository.merge(existingOrder, {
      status: orderStatus,
    });
    return await this.orderRepository.save(updatedOrder);
  }

  async sendNewOrderToWarehouse(
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
        `Failed to send order to sendOrderToWarehouse: ${error.message}`,
      );

      await this.updateOrder(
        order.id,
        OrderStatus.WAREHOUSE_SERVICE_UNAVAILABLE,
      );

      throw error;
    }
  }

  async createOrderAndSendToWarehouse(
    orderRequest: OrderRequest,
  ): Promise<
    | OrderAcceptedResponse
    | OrderScheduledResponse
    | OrderPartiallyAcceptedResponse
    | OrderRejectedResponse
    | WarehouseNotReadyResponse
  > {
    const order = await this.createOrder(orderRequest);
    return await this.sendNewOrderToWarehouse(order);
  }
}
