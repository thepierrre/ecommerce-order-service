import { HttpException, HttpStatus } from '@nestjs/common';

export class WarehouseServiceException extends HttpException {
  constructor(orderId: string, reason: string) {
    super(
      {
        message: 'Warehouse service unavailable.',
        orderStatus: 'WAREHOUSE_SERVICE_UNAVAILABLE',
        orderId,
        reason,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
