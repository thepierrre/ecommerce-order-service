import { z } from "zod";

export const WAREHOUSE_RETURN_COMPLETED_S = "warehouse.return.completed.v1";

export const ReturnedItemSchema = z.object({
	productId: z.uuid(),
	quantityReturned: z.int().nonnegative(),
	quantityAccepted: z.int().nonnegative(),
	quantityRejected: z.int().nonnegative(),
	quantityRestocked: z.int().nonnegative(),
	rejectionReason: z.string().nullish(),
});

export const Warehouse_ReturnCompletedSchema = z.object({
	schemaVersion: z.literal(1),
	eventId: z.uuid(),
	occurredAt: z.iso.datetime(),
	completedAt: z.iso.datetime(),
	returnNumber: z.string(),
	orderNumber: z.string(),
	warehouseNumber: z.string(),
	disposition: z.enum(["accepted", "partially_accepted", "rejected"]),
	reason: z.string().nullish(),
	items: z.array(ReturnedItemSchema),
});

export type Warehouse_ReturnCompleted = z.infer<
	typeof Warehouse_ReturnCompletedSchema
>;
