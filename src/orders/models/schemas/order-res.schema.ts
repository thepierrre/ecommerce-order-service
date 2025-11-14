
// export const OrderResBuilder = vine.object({
// 	id: vine.string(),
// 	orderNumber: vine.string(),
// 	userId: vine.string(),
// 	contactEmail: vine.string().email(),
// 	createdAt: vine.date({ formats: ["iso"] }),
// 	lastUpdatedAt: vine.date({ formats: ["iso"] }).optional(),
// 	status: vine.enum(OrderStatus).transform((v) => v.toLowerCase()),
// 	amount: vine.number(),
// 	shippingMethod: vine.string(),
// 	shippingAddress: vine.string(),
// 	items: vine.array(OrderItemBuilder).minLength(1),
// });

import { OrderItem } from "./create-order.schema";

// export const OrderResSchema = vine.compile(OrderResBuilder);

export type OrderRes = {
	id: string;
	orderNumber: string;
	userId: string;
	contactEmail: string;
	createdAt: string;
	lastUpdatedAt: string;
	status: string;
	amount: number;
	shippingMethod: string;
	shippingAddress: string;
	items: OrderItem[];
}
