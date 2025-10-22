import { z } from "zod";

export const OrderItemSchema = z.object({
	productId: z.string(),
	price: z.number().positive(),
	quantity: z.number().int().positive(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
