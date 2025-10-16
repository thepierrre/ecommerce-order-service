import { z } from "zod";

export const CreateOrderResponseSchema = z.object({
	message: z.string(),
	id: z.string(),
	createdAt: z.date(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
