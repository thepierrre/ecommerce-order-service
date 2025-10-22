import type { RefundMethod } from "../enums/refund-option.enum";
import type { ReturnedItem } from "./returned-item.interface";

export interface OrderReturn {
	orderId: string;
	returnedItems: ReturnedItem[];
	refundOption: RefundMethod;
}
