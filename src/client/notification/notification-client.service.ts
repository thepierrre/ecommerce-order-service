import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OrderStatus } from '../../model/enum/order-status.enum';

@Injectable()
export class NotificationClientService {
  private readonly logger = new Logger(NotificationClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendOrderUpdateToNotificationService(
    orderId: string,
    orderStatus?: OrderStatus,
    message?: string,
  ): Promise<void> {
    return;
  }
}
