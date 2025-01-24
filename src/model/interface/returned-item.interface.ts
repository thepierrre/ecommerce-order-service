import { ReturnReason } from '../enum/return-reason.enum';

export interface ReturnedItem {
  productId: string;
  amount: number;
  reason: ReturnReason;
  priceForUnit: number;
  totalPrice: number;
}
