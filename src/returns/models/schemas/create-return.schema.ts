import { z } from "zod";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnItemSchema } from "./return-item.schema";

export const CreateReturnSchema = z.object({
	orderId: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
});

export type CreateReturn = z.infer<typeof CreateReturnSchema>;
