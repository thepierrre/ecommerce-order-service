import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const WAREHOUSE_ORDER_PROCESSING_STARTED_S =
	"warehouse.order.processing-started.v1";

export const Warehouse_OrderProcessingStartedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	startedAt: z.iso.datetime(),
	orderId: z.string(),
	pickerId: z.string().nullish(),
});

export type Warehouse_OrderProcessingStartedV1 = z.infer<
	typeof Warehouse_OrderProcessingStartedV1Schema
>;

export const toOrderProcessingStarted = (
	orderId: string,
	pickerId?: string,
): Warehouse_OrderProcessingStartedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	startedAt: new Date().toISOString(),
	orderId,
	pickerId: pickerId ?? null,
});
