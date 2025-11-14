import { OrderItemBuilder } from "@thepierrre/ecom-common";
import vine from "@vinejs/vine";

export const CreateOrderBuilder = vine.object({
	userId: vine.string(),
	contactEmail: vine.string().email(),
	amount: vine.number().positive(),
	shippingMethod: vine.string(),
	shippingAddress: vine.string(),
	items: vine.array(OrderItemBuilder).minLength(1),
});

export const CreateOrderSchema = vine.compile(CreateOrderBuilder);

export type CreateOrder = {
	userId: string;
	contactEmail: string;
	amount: number;
	shippingMethod: string;
	shippingAddress: string;
	items: OrderItem[];
}

export type OrderItem = {
	productId: string;
	sku: string;
	quantity: number;
}