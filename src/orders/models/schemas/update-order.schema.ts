import vine from "@vinejs/vine";
import { OrderStatus } from "../enums/order-status.enum";
import { Infer } from "@vinejs/vine/types";

export const UpdateOrderSchema = vine.object({
	contactEmail: vine.string().email().optional(),
	shippingAddress: vine.string().optional(),
	status: vine.enum(OrderStatus).optional(),
});

export type UpdateOrder = Infer<typeof UpdateOrderSchema>;
