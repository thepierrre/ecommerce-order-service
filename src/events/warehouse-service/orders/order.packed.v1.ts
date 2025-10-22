import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const WAREHOUSE_ORDER_PACKED_S = "warehouse.order.packed.v1";

export const Warehouse_OrderPackedV1Schema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderId: z.string(),
	packedAt: z.iso.datetime(),
	warehouseId: z.string(),
	packerId: z.string().nullish(),
	weightKg: z.number().nullish(),
	dimensionsCm: z.tuple([z.number(), z.number(), z.number()]).nullish(),
});

export type Warehouse_OrderPackedV1 = z.infer<
	typeof Warehouse_OrderPackedV1Schema
>;

export const toOrderPackedV1 = (
	orderId: string,
	warehouseId: string,
	packerId?: string,
	weightKg?: number,
	dimensionsCm?: [number, number, number],
): Warehouse_OrderPackedV1 => ({
	schemaVersion: 1,
	eventId: uuidv4(),
	occurredAt: new Date().toISOString(),
	orderId,
	packedAt: new Date().toISOString(),
	packerId,
	weightKg: weightKg ?? null,
	dimensionsCm: dimensionsCm ?? null,
	warehouseId,
});
