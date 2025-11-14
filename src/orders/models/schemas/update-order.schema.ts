import vine from "@vinejs/vine";
import { OrderStatus } from "../enums/order-status.enum";

export const UpdateOrderBuilder = vine.object({
	contactEmail: vine.string().optional(),
	shippingAddress: vine.string().optional(),
	status: vine.enum(OrderStatus).optional(),
});

export const UpdateOrderSchema = vine.compile(UpdateOrderBuilder);

export type UpdateOrder = {
	contactEmail?: string;
	shippingAddress?: string;
	status?: OrderStatus;
}
