import { z } from "zod";

export const CreateOrderResponseSchema = z.object({
	message: z.string(),
	id: z.string(),
	createdAt: z.iso.datetime(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
