import type { OrderStatus } from "../enums/order-status.enum";
import type { OrderItem } from "../types/order-item.interface";
import { Order } from "../entities/order.entity";

export class OrderResponseDto {
	constructor(order: Order) {
		this.id = order.id;
		this.userId = order.userId;
		this.isPaid = order.isPaid;
		this.createdAt = order.createdAt;
		this.updatedAt = order.updatedAt;
		this.status = order.status;
		this.amount = order.amount;
		this.shippingMethod = order.shippingMethod;
		this.shippingAddress = order.shippingAddress;
		this.items = order.items;
	}

	id: string;
	userId: string;
	isPaid: boolean;
	createdAt: Date;
	updatedAt: Date;
	status: OrderStatus;
	amount: number;
	shippingMethod: string;
	shippingAddress: string;
	items: OrderItem[];
}
