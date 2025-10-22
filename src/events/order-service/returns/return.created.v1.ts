import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { Return } from "../../../returns/models/entities/return.entity";
import { ReturnItemSchema } from "../../../returns/models/schemas/return-item.schema";

export const ORDER_RETURN_CREATED_S = "order.return.created.v1";

export const Order_ReturnCreatedEventSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderNumber: z.string(),
	returnNumber: z.string(),
	items: z.array(ReturnItemSchema).min(1),
});

export type Order_ReturnCreatedEvent = z.infer<
	typeof Order_ReturnCreatedEventSchema
>;

export const toOrder_ReturnCreatedEvent = (
	r: Return,
	orderNumber: string,
): Order_ReturnCreatedEvent => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	orderNumber,
	returnNumber: r.returnNumber,
	items: r.items,
});
