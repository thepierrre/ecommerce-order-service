import { z } from "zod";
import { OrderStatus } from "../enums/order-status.enum";

export const UpdateOrderSchema = z.object({
	contactEmail: z.email().nullish(),
	shippingAddress: z.string().nullish(),
	status: z.enum(OrderStatus).nullish(),
});

export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
