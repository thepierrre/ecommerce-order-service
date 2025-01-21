import { OrderStatus } from '../enum/order-status.enum';
import { OrderItem } from './order-item.interface';
import { ShippingAddress } from './shipping-address.interface';

export interface OrderResponse {
  id: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
  userId: string;
  status: OrderStatus;
  amount: number;
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}
