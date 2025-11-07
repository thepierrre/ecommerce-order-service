import vine from "@vinejs/vine";
import { OrderStatus } from "../enums/order-status.enum";
import { Infer } from "@vinejs/vine/types";

export const UpdateOrderBuilder = vine.object({
	contactEmail: vine.string().email().optional(),
	shippingAddress: vine.string().optional(),
	status: vine.enum(OrderStatus).optional(),
});

export const UpdateOrderSchema = vine.compile(UpdateOrderBuilder);

export type UpdateOrder = Infer<typeof UpdateOrderBuilder>;
