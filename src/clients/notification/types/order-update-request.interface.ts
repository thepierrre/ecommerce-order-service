import { OrderStatus } from '../../../order/models/enums/order-status.enum';

export interface OrderUpdateRequest {
  orderId?: string;
  orderStatus?: OrderStatus;
  message?: string;
}
