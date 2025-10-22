import { z } from "zod";
import type { Order } from "../../../orders/models/entities/order.entity";
import { v4 as uuidv4 } from "uuid";

export const WAREHOUSE_ORDER_DELIVERED_S = "warehouse.order.delivered.v1";

export const Warehouse_OrderDeliveredV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	deliveredAt: z.iso.datetime(),
	orderId: z.string(),
});

export type Warehouse_OrderDeliveredV1 = z.infer<
	typeof Warehouse_OrderDeliveredV1Schema
>;

export const toOrderDeliveredV1 = (o: Order): Warehouse_OrderDeliveredV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	deliveredAt: new Date().toISOString(),
	orderId: o.id,
});
