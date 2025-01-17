import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Order } from '../model/entity/order.entity';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { externalApiUrls } from '../config/external-api-urls';

@Injectable()
export class WarehouseApiServiceClient {
  constructor(private readonly httpService: HttpService) {}

  sendOrder(order: Order): Observable<AxiosResponse<void>> {
    return this.httpService.post(`${externalApiUrls}/v1/orders}`, { order });
  }
}
