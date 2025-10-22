import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const WAREHOUSE_ORDER_SHIPPED_S = "warehouse.order.shipped.v1";

export const Warehouse_OrderShippedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	shippedAt: z.iso.datetime(),
	trackingNumber: z.string(),
	warehouseId: z.string().nullish(),
	carrier: z.string(),
	orderId: z.string(),
});

export type Warehouse_OrderShippedV1 = z.infer<
	typeof Warehouse_OrderShippedV1Schema
>;

export const toOrderShipped = (
	orderId: string,
	trackingNumber: string,
	carrier: string,
	warehouseId: string,
): Warehouse_OrderShippedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	orderId,
	trackingNumber,
	carrier,
	shippedAt: new Date().toISOString(),
	warehouseId,
});
