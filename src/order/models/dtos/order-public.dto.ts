import { OrderItem } from "../types/order-item.interface";

export class OrderPublicDto {
	id: string;
	items: OrderItem[];
	total: number;
}
