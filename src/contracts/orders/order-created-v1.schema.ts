import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { Order } from "../../order/models/entities/order.entity";
import { OrderItemSchema } from "../../order/models/schemas/order-item.schema";

export const OrderCreatedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderId: z.string(),
	userId: z.string(),
	amount: z.number(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderCreatedV1 = z.infer<typeof OrderCreatedV1Schema>;

export const ORDER_CREATED_SUBJECT = "orders.created.v1";

export const toOrderCreatedV1 = (o: Order): OrderCreatedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	orderId: o.id,
	userId: o.userId,
	amount: Number(o.amount),
	shippingMethod: o.shippingMethod,
	shippingAddress: o.shippingAddress,
	items: o.items,
});
