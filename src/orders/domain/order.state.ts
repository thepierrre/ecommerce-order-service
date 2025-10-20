import { Order } from '../models/entities/order.entity';
import { OrderStatus } from '../models/enums/order-status.enum';

export const initializeReturn = (o: Order) => {
  o.status = OrderStatus.RETURN_INITIATED;
  return o;
}
