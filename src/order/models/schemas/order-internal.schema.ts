import { z } from "zod";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemSchema } from "./order-item.schema";

export const OrderInternalSchema = z.object({
	id: z.string(),
	userId: z.string(),
	isPaid: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date().nullish(),
	status: z.enum(OrderStatus),
	amount: z.number().positive(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema),
});

export type OrderInternalSchema = z.infer<typeof OrderInternalSchema>;
