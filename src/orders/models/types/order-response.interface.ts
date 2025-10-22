import type { OrderStatus } from "../enums/order-status.enum";
import type { OrderItem } from "./order-item.interface";

export interface OrderResponse {
	id: string;
	createdAt: Date;
	lastUpdatedAt?: Date;
	userId: string;
	status: OrderStatus;
	amount: number;
	shippingMethod: string;
	shippingAddress: string;
	items: OrderItem[];
}
