import { z } from "zod";
import { OrderItemSchema } from "./order-item.schema";

export const CreateOrderSchema = z.object({
	userId: z.string(),
	isPaid: z.boolean().optional().default(false),
	amount: z.number().positive(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
