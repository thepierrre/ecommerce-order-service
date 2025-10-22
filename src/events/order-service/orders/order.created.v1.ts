import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { Order } from "../../../orders/models/entities/order.entity";
import { OrderItemSchema } from "../../../orders/models/schemas/order-item.schema";

export const ORDER_ORDER_CREATED_S = "order.order.created.v1";

export const Order_OrderCreatedEventSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderNumber: z.string(),
	userId: z.string(),
	amount: z.number(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type Order_OrderCreatedEvent = z.infer<
	typeof Order_OrderCreatedEventSchema
>;

export const toOrder_OrderCreatedEvent = (
	o: Order,
): Order_OrderCreatedEvent => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	orderNumber: o.orderNumber,
	userId: o.userId,
	amount: Number(o.amount),
	shippingMethod: o.shippingMethod,
	shippingAddress: o.shippingAddress,
	items: o.items,
});
