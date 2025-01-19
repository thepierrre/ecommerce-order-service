import { OrderItem } from './order-item.interface';
import { ShippingAddress } from './shipping-address.interface';

export interface OrderRequest {
  userId: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  shippingMethod: string;
}
