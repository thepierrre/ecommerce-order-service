import { z } from "zod";
import type { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemSchema } from "./order-item.schema";
import { PublicOrderStatusSchema } from "./public-order-status.schema";

export const OrderPublicSchema = z.object({
	id: z.string(),
	contactEmail: z.email(),
	amount: z.number(),
	placedAt: z.iso.datetime(),
	lastUpdatedAt: z.iso.datetime().nullish(),
	status: PublicOrderStatusSchema,
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderPublic = z.infer<typeof OrderPublicSchema>;

export type OrderPublicStatus =
	| "placed"
	| "processing"
	| "shipped"
	| "delivered"
	| "return initiated"
	| "return completed";

const toOrderPublicStatus = (s: OrderStatus): OrderPublicStatus => {
	switch (s) {
		case OrderStatus.PENDING_WAREHOUSE_RESPONSE:
		case OrderStatus.WAREHOUSE_NOT_READY:
			return "placed";
		case OrderStatus.PROCESSING_BY_WAREHOUSE:
			return "processing";
		case OrderStatus.SHIPPED:
			return "shipped";
		case OrderStatus.DELIVERED:
			return "delivered";
		case OrderStatus.RETURN_INITIATED:
			return "return initiated";
		case OrderStatus.RETURNED:
		case OrderStatus.REFUNDED:
			return "return completed";
	}
};

export const toOrderPublic = (o: Order): OrderPublic =>
	OrderPublicSchema.parse({
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
