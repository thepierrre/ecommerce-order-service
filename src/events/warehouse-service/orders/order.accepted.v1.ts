import { z } from "zod";

export const WAREHOUSE_ORDER_ACCEPTED_S = "warehouse.order.accepted.v1";

export const Warehouse_OrderAcceptedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderNumber: z.string(),
	warehouseNumber: z.string(),
	estimatedShipDate: z.iso.datetime().nullish(),
});

export type Warehouse_OrderAccepted = z.infer<
	typeof Warehouse_OrderAcceptedSchema
>;
