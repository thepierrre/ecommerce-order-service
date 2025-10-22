import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const WAREHOUSE_RETURN_ACCEPTED_S = "warehouse.return.accepted.v1";

export const Warehouse_ReturnAcceptedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	acceptedAt: z.iso.datetime(),
	returnId: z.string(),
	orderId: z.string(),
	warehouseId: z.string(),
});

export type Warehouse_ReturnAcceptedV1 = z.infer<
	typeof Warehouse_ReturnAcceptedV1Schema
>;

export const toReturnAccepted = (
	returnId: string,
	orderId: string,
	warehouseId: string,
): Warehouse_ReturnAcceptedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	acceptedAt: new Date().toISOString(),
	returnId,
	orderId,
	warehouseId,
});
