import { z } from "zod";

export const WAREHOUSE_RETURN_RECEIVED_S = "warehouse.return.received.v1";

export const Warehouse_ReturnReceivedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	receivedAt: z.iso.datetime(),
	returnNumber: z.string(),
	orderNumber: z.string(),
	warehouseNumber: z.string(),
});

export type Warehouse_ReturnReceived = z.infer<
	typeof Warehouse_ReturnReceivedSchema
>;
