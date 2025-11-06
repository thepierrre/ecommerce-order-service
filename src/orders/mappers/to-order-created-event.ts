import {
	OrderCreatedEvent,
	OrderCreatedEventSchema,
} from "@thepierrre/ecom-common";
import { Order } from "../models/entities/order.entity";
import { v4 as uuidv4 } from "uuid";

export async function toOrderCreatedEvent(
	o: Order,
): Promise<OrderCreatedEvent> {
	const candidate = {
		schemaVersion: 1 as const,
		eventId: uuidv4(),
		occurredAt: new Date().toISOString(),
		orderNumber: o.orderNumber,
		userId: o.userId,
		amount: Number(o.amount),
		shippingMethod: o.shippingMethod,
		shippingAddress: o.shippingAddress,
		items: o.items,
	};

	return OrderCreatedEventSchema.validate(candidate) as OrderCreatedEvent;
}
