import { z } from "zod";
import type { Return } from "../entities/return.entity";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnItemSchema } from "./return-item.schema";

export const ReturnPublicResSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
	placedAt: z.iso.datetime(),
});

export type ReturnPublicRes = z.infer<typeof ReturnPublicResSchema>;

export const toReturnPublicRes = (r: Return): ReturnPublicRes =>
	ReturnPublicResSchema.parse({
		id: r.id,
		orderId: r.orderId,
		status: r.status,
		items: r.items,
		placedAt: r.createdAt,
	});
