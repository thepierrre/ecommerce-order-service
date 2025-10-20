import { z } from "zod";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnItemSchema } from "./return-item.schema";

export const ReturnInternalSchema = z.object({
	id: z.string(),
	order: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
	createdAt: z.iso.datetime(),
	lastUpdatedAt: z.iso.datetime().nullish(),
});
export type ReturnInternalResponse = z.infer<typeof ReturnInternalSchema>;
