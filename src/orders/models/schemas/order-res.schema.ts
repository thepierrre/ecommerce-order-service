import type { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemBuilder } from "@thepierrre/ecom-common";
import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

export const OrderResBuilder = vine.object({
	id: vine.string(),
	orderNumber: vine.string(),
	userId: vine.string(),
	contactEmail: vine.string().email(),
	createdAt: vine.date({ formats: ["iso"]}),
	lastUpdatedAt: vine.date({ formats: ["iso"]}).nullable(),
	status: vine.enum(OrderStatus).transform((v) => v.toLowerCase()),
	amount: vine.number(),
	shippingMethod: vine.string(),
	shippingAddress: vine.string(),
	items: vine.array(OrderItemBuilder).minLength(1),
});

export const OrderResSchema = vine.compile(OrderResBuilder);

export type OrderRes = Infer<typeof OrderResSchema>;

export const toOrderRes = (o: Order): Promise<OrderRes> => OrderResSchema.validate(o);
