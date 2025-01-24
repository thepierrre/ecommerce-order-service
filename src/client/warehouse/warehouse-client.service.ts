import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Order } from '../../model/entity/order.entity';
import { externalApiUrls } from '../../config/external-api-urls';
import { WarehouseResponse } from './warehouse-responses.interface';
import { firstValueFrom } from 'rxjs';
import { OrderReturn } from '../../model/interface/order-return.interface';

@Injectable()
export class WarehouseClientService {
  private readonly logger = new Logger(WarehouseClientService.name);
  private readonly warehouseUrl = externalApiUrls.warehouseService;

  constructor(private readonly httpService: HttpService) {}

  async createReturn(orderReturn: OrderReturn): Promise<void> {
    const { orderId } = orderReturn;
    try {
      this.httpService.post<OrderReturn>(
        `${this.warehouseUrl}/v1/orders/${orderId}/return`,
        orderReturn,
      );
    } catch (error) {
      this.logger.error('Unable to reach the warehouse service: ', error);
      throw new Error('Unable to send the order to the warehouse.');
    }
  }

  async sendNewOrderToWarehouse(order: Order): Promise<WarehouseResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<WarehouseResponse>(
          `${this.warehouseUrl}/v1/orders}`,
          { order },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Unable to reach the warehouse service: ', error);
      throw new Error('Unable to send the order to the warehouse.');
    }
  }
}
