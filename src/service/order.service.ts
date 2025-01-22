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

  async updateOrder(orderId: string, orderStatus: OrderStatus): Promise<void> {
    const existingOrder = await this.orderRepository.findOneBy({ id: orderId });
    if (!existingOrder) {
      this.logger.error(`Order with the id ${orderId} not found.`);
      throw new NotFoundException(`Order with the id ${orderId} not found.`);
    }

    const updatedOrder = this.orderRepository.merge(existingOrder, {
      status: orderStatus,
    });
    await this.orderRepository.save(updatedOrder);
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
    let warehouseResponse:
      | OrderAcceptedResponse
      | OrderScheduledResponse
      | OrderPartiallyAcceptedResponse
      | OrderRejectedResponse
      | WarehouseNotReadyResponse;

    // Send the new order to the warehouse.
    try {
      warehouseResponse =
        await this.warehouseClientService.sendNewOrderToWarehouse(order);
    } catch (warehouseError) {
      this.logger.error(
        `Failed to send the order to the warehouse: ${warehouseError.message}`,
      );
      // Update the status order as WAREHOUSE_SERVICE_UNAVAILABLE if the warehouse is unreachable.
      try {
        await this.updateOrder(
          order.id,
          OrderStatus.WAREHOUSE_SERVICE_UNAVAILABLE,
        );
      } catch (updateError) {
        this.logger.error(
          `Failed to update the status of the order as WAREHOUSE_SERVICE_UNAVAILABLE: ${updateError.message}`,
        );
      }
      throw warehouseError;
    }

    // Update the order status from the order response if the warehouse responds.
    try {
      await this.updateOrder(order.id, warehouseResponse.status);
    } catch (updateError) {
      this.logger.error(
        `Successfuly sent the order to the warehouse, but failed to update the order in the database: ${updateError.message}`,
      );
      throw updateError;
    }

    return warehouseResponse;
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
