import { z } from "zod";
import type { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderStatusPublic } from "../enums/order-status-public.enum";
import { OrderItemSchema } from "./order-item.schema";

export const OrderPublicResSchema = z.object({
	id: z.string(),
	contactEmail: z.email(),
	amount: z.number(),
	placedAt: z.iso.datetime(),
	lastUpdatedAt: z.iso.datetime().nullish(),
	status: OrderStatusPublic,
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderPublicRes = z.infer<typeof OrderPublicResSchema>;

const toOrderPublicStatus = (s: OrderStatus): OrderStatusPublic => {
	switch (s) {
		case OrderStatus.PENDING_WAREHOUSE_RESPONSE:
		case OrderStatus.WAREHOUSE_NOT_READY:
			return OrderStatusPublic.PLACED;
		case OrderStatus.PROCESSING_BY_WAREHOUSE:
			return OrderStatusPublic.PROCESSING;
		case OrderStatus.SHIPPED:
			return OrderStatusPublic.SHIPPED;
		case OrderStatus.DELIVERED:
			return OrderStatusPublic.DELIVERED;
		case OrderStatus.RETURN_INITIATED:
			return OrderStatusPublic.RETURN_INITIATED;
		case OrderStatus.RETURNED:
		case OrderStatus.REFUNDED:
			return OrderStatusPublic.RETURN_COMPLETED;
	}
};

export const toOrderPublicRes = (o: Order): OrderPublicRes =>
	OrderPublicResSchema.parse({
		id: o.id,
		contactEmail: o.contactEmail,
		amount: o.amount,
		placedAt: o.createdAt,
		lastUpdatedAt: o.lastUpdatedAt ?? null,
		status: toOrderPublicStatus(o.status),
		shippingMethod: o.shippingMethod,
		shippingAddress: o.shippingAddress,
		items: o.items,
	});
