import { ReturnedItem } from './returned-item.interface';
import { RefundMethod } from '../enum/refund-option.enum';

export interface OrderReturn {
  orderId: string;
  returnedItems: ReturnedItem[];
  refundOption: RefundMethod;
}
