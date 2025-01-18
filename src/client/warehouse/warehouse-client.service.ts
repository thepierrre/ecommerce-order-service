import { Injectable, Logger } from '@nestjs/common';
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
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WarehouseClientService {
  private readonly logger = new Logger(WarehouseClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendOrderToWarehouse(
    order: Order,
  ): Promise<
    AxiosResponse<
      | OrderAcceptedResponse
      | OrderScheduledResponse
      | OrderPartiallyAcceptedResponse
      | OrderRejectedResponse
      | WarehouseNotReadyResponse,
      any
    >
  > {
    return await firstValueFrom(
      this.httpService
        .post<
          | OrderAcceptedResponse
          | OrderScheduledResponse
          | OrderPartiallyAcceptedResponse
          | OrderRejectedResponse
          | WarehouseNotReadyResponse
        >(`${externalApiUrls.warehouseService}/v1/orders}`, { order })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response);
            throw error;
          }),
        ),
    );
  }
}
