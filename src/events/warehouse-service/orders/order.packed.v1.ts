import { z } from "zod";

export const WAREHOUSE_ORDER_PACKED_S = "warehouse.order.packed.v1";

export const Warehouse_OrderPackedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	orderNumber: z.string(),
	packedAt: z.iso.datetime(),
	warehouseNumber: z.string(),
	packerId: z.string().nullish(),
	weightKg: z.number().nullish(),
	dimensionsCm: z.tuple([z.number(), z.number(), z.number()]).nullish(),
});

export type Warehouse_OrderPacked = z.infer<typeof Warehouse_OrderPackedSchema>;
