import { z } from "zod";

export const WAREHOUSE_ORDER_PROCESSING_STARTED_S =
	"warehouse.order.processing-started.v1";

export const Warehouse_OrderProcessingStartedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	startedAt: z.iso.datetime(),
	orderNumber: z.string(),
	pickerId: z.string().nullish(),
});

export type Warehouse_OrderProcessingStarted = z.infer<
	typeof Warehouse_OrderProcessingStartedSchema
>;
