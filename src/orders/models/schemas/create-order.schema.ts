import { OrderItemBuilder } from "@thepierrre/ecom-common";
import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

export const CreateOrderBuilder = vine.object({
	userId: vine.string(),
	contactEmail: vine.string().email(),
	amount: vine.number().positive(),
	shippingMethod: vine.string(),
	shippingAddress: vine.string(),
	items: vine.array(OrderItemBuilder).minLength(1),
});

export const CreateOrderSchema = vine.compile(CreateOrderBuilder);

export type CreateOrder = Infer<typeof CreateOrderBuilder>;
