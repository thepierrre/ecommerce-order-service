import { z } from "zod";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemSchema } from "./order-item.schema";
import { Order } from '../entities/order.entity';

export const OrderInternalSchema = z.object({
	id: z.string(),
	userId: z.string(),
	contactEmail: z.email(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullish(),
	status: z.enum(OrderStatus),
	amount: z.number(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderInternal = z.infer<typeof OrderInternalSchema>;

export const toOrderInternal = (o: Order): OrderInternal => ({
	id: o.id,
	userId: o.userId,
	contactEmail: o.contactEmail,
	createdAt: o.createdAt.toISOString(),
	updatedAt: o.updatedAt.toISOString(),
	status: o.status,
	amount: o.amount,
	shippingMethod: o.shippingMethod,
	shippingAddress: o.shippingAddress,
	items: o.items,
})