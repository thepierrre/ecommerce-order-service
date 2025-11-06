import { Order } from "../models/entities/order.entity";
import { OrderRes, OrderResSchema } from "../models/schemas/order-res.schema";

export async function toOrderRes(o: Order): Promise<OrderRes> {
	const candidate = {
		id: o.id,
		orderNumber: o.orderNumber,
		userId: o.userId,
		contactEmail: o.contactEmail,
		createdAt: o.createdAt,
		lastUpdatedAt: o.lastUpdatedAt,
		status: o.status,
		amount: Number(o.amount),
		shippingMethod: o.shippingMethod,
		shippingAddress: o.shippingAddress,
		items: o.items,
	};

	return (await OrderResSchema.validate(candidate)) as OrderRes;
}
