import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { externalApiUrls } from '../../config/external-api-urls';
import { OrderUpdateRequest } from './interface/order-update-request.interface';

@Injectable()
export class NotificationClientService {
  private readonly logger = new Logger(NotificationClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendOrderUpdateToNotificationService(
    orderUpdate: OrderUpdateRequest,
  ): Promise<void> {
    try {
      this.httpService.patch(
        `${externalApiUrls.notificationService}/v1/orders}`,
        { orderUpdate },
      );
    } catch (error) {
      this.logger.error(
        'Unable to send order update to the notification service: ',
        error,
      );
      throw new ServiceUnavailableException(
        'Unable to reach the notification service: ',
        error,
      );
    }
  }
}
