import { z } from "zod";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnItemSchema } from "./return-item.schema";

export const ReturnPublicSchema = z.object({
	id: z.string(),
	order: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
	placedAt: z.iso.datetime(),
});
export type ReturnPublicResponse = z.infer<typeof ReturnPublicSchema>;
