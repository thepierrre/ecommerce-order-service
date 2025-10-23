import { z } from "zod";

export const WAREHOUSE_ORDER_DELIVERED_S = "warehouse.order.delivered.v1";

export const Warehouse_OrderDeliveredSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	deliveredAt: z.iso.datetime(),
	orderNumber: z.string(),
});

export type Warehouse_OrderDelivered = z.infer<
	typeof Warehouse_OrderDeliveredSchema
>;
