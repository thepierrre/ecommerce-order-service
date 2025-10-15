import { ReturnedItem } from './returned-item.interface';
import { RefundMethod } from '../enums/refund-option.enum';

export interface OrderReturn {
  orderId: string;
  returnedItems: ReturnedItem[];
  refundOption: RefundMethod;
}
