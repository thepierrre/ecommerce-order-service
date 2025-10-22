import { z } from "zod";
import type { Return } from "../entities/return.entity";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnItemSchema } from "./return-item.schema";

export const ReturnResSchema = z.object({
	id: z.string(),
	returnNumber: z.string(),
	order: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
	createdAt: z.iso.datetime(),
	lastUpdatedAt: z.iso.datetime().nullish(),
});

export type ReturnRes = z.infer<typeof ReturnResSchema>;

export const toReturnRes = (r: Return): ReturnRes =>
	ReturnResSchema.parse({
		id: r.id,
		returnNumber: r.returnNumber,
		orderId: r.orderId,
		status: r.status,
		items: r.items,
		createdAt: r.createdAt,
		lastUpdatedAt: r.lastUpdatedAt,
	});
