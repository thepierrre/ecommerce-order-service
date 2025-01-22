import { OrderStatus } from '../../../model/enum/order-status.enum';

export interface OrderUpdateRequest {
  orderId: string;
  orderStatus?: OrderStatus;
  message?: string;
}
