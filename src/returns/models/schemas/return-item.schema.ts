import { z } from "zod";

export const ReturnItemSchema = z.object({
	productId: z.string(),
	quantity: z.number().int().positive(),
	reason: z.string(),
});
