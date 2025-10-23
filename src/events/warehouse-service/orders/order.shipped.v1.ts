import { z } from "zod";

export const WAREHOUSE_ORDER_SHIPPED_S = "warehouse.order.shipped.v1";

export const Warehouse_OrderShippedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	shippedAt: z.iso.datetime(),
	trackingNumber: z.string(),
	warehouseNumber: z.string().nullish(),
	carrier: z.string(),
	orderNumber: z.string(),
});

export type Warehouse_OrderShipped = z.infer<
	typeof Warehouse_OrderShippedSchema
>;
