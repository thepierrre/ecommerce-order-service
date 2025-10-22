import { z } from "zod";
import type { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemSchema } from "./order-item.schema";

export const OrderInternalResSchema = z.object({
	id: z.string(),
	userId: z.string(),
	contactEmail: z.email(),
	createdAt: z.iso.datetime(),
	lastUpdatedAt: z.iso.datetime().nullish(),
	status: z.enum(OrderStatus).transform((v) => v.toLowerCase()),
	amount: z.number(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderInternalRes = z.infer<typeof OrderInternalResSchema>;

export const toOrderInternalRes = (o: Order): OrderInternalRes =>
	OrderInternalResSchema.parse({
		id: o.id,
		userId: o.userId,
		contactEmail: o.contactEmail,
		createdAt: o.createdAt,
		lastUpdatedAt: o.lastUpdatedAt,
		status: o.status,
		amount: o.amount,
		shippingMethod: o.shippingMethod,
		shippingAddress: o.shippingAddress,
		items: o.items,
	});
