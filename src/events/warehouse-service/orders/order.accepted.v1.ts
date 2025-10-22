import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const WAREHOUSE_ORDER_ACCEPTED_S = "warehouse.order.accepted.v1";

export const Warehouse_OrderAcceptedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderId: z.string(),
	warehouseId: z.string(),
	estimatedShipDate: z.iso.datetime().nullish(),
});

export type Warehouse_OrderAcceptedV1 = z.infer<
	typeof Warehouse_OrderAcceptedV1Schema
>;

export const toOrderAcceptedV1 = (
	orderId: string,
	warehouseId: string,
	estimatedShipDate?: string,
): Warehouse_OrderAcceptedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	warehouseId,
	occurredAt: new Date().toISOString(),
	orderId,
	estimatedShipDate: estimatedShipDate ?? null,
});
