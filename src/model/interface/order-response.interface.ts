import { OrderStatus } from '../enum/order-status.enum';
import { OrderItem } from './order-item.interface';

export interface OrderResponse {
  id: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
  userId: string;
  status: OrderStatus;
  amount: number;
  transactionId: string;
  items: OrderItem[];
}
