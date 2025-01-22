import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Order } from '../../model/entity/order.entity';
import { externalApiUrls } from '../../config/external-api-urls';
import {
  OrderAcceptedResponse,
  OrderPartiallyAcceptedResponse,
  OrderRejectedResponse,
  OrderScheduledResponse,
  WarehouseNotReadyResponse,
} from './warehouse-responses.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WarehouseClientService {
  private readonly logger = new Logger(WarehouseClientService.name);

  constructor(private readonly httpService: HttpService) {}

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
      const response = await firstValueFrom(
        this.httpService.post<
          | OrderAcceptedResponse
          | OrderScheduledResponse
          | OrderPartiallyAcceptedResponse
          | OrderRejectedResponse
          | WarehouseNotReadyResponse
        >(`${externalApiUrls.warehouseService}/v1/orders}`, { order }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Unable to reach the warehouse service: ', error);
      throw new ServiceUnavailableException(
        'Unable to reach the warehouse service: ',
        error,
      );
    }
  }
}
