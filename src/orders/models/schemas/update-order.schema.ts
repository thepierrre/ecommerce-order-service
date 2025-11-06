
import vine from "@vinejs/vine";
import { OrderStatus } from "../enums/order-status.enum";
import { Infer } from "@vinejs/vine/types";

export const UpdateOrderSchema = vine.object({
	contactEmail: vine.string().email().nullable(),
	shippingAddress: vine.string().nullable(),
	status: vine.enum(OrderStatus).nullable(),
});

export type UpdateOrder = Infer<typeof UpdateOrderSchema>;
