import { z } from "zod";
import { OrderItemSchema } from "./order-item.schema";

export const CreateOrderSchema = z.object({
	userId: z.string(),
	contactEmail: z.email(),
	amount: z.number().positive(),
	shippingMethod: z.string(),
	shippingAddress: z.string(),
	items: z.array(OrderItemSchema).min(1),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
