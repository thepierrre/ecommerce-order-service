import { z } from "zod";

export const UpdateOrderSchema = z.object({
	contactEmail: z.email().nullish(),
	shippingAddress: z.string().nullish(),
});

export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
