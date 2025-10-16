import { z } from "zod";
import { OrderItemSchema } from "./order-item.schema";

export const OrderPublicSchema = z.object({
	id: z.string(),
	amount: z.number(),
	placedAt: z.date(),
	status: z.string(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	isPaid: z.boolean(),
	items: z.array(OrderItemSchema),
});

export type OrderPublicSchema = z.infer<typeof OrderPublicSchema>;
