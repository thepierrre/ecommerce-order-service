import { z } from "zod";
import type { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemSchema } from "./order-item.schema";
import { PublicOrderStatusSchema } from "./public-order-status.schema";

export const OrderPublicSchema = z.object({
	id: z.string(),
	contactEmail: z.email(),
	amount: z.number(),
	placedAt: z.date(),
	status: PublicOrderStatusSchema,
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderPublic = z.infer<typeof OrderPublicSchema>;

const toOrderPublicStatus = (s: OrderStatus): OrderPublic["status"] => {
	switch (s) {
		case OrderStatus.PENDING_WAREHOUSE_RESPONSE:
		case OrderStatus.WAREHOUSE_NOT_READY:
			return "Placed";
		case OrderStatus.PROCESSING_BY_WAREHOUSE:
			return "Processing";
		case OrderStatus.SHIPPED:
			return "Shipped";
		case OrderStatus.DELIVERED:
			return "Delivered";
		case OrderStatus.RETURN_INITIATED:
			return "Return initiated";
		case OrderStatus.RETURNED:
		case OrderStatus.REFUNDED:
			return "Return completed";
	}
};

export const toOrderPublic = (o: Order): OrderPublic => ({
	id: o.id,
	contactEmail: o.contactEmail,
	amount: o.amount,
	placedAt: o.createdAt,
	status: toOrderPublicStatus(o.status),
	shippingMethod: o.shippingMethod,
	shippingAddress: o.shippingAddress,
	items: o.items,
});
