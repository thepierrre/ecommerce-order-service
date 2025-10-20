import { z } from "zod";
import { ReturnItemSchema } from "./return-item.schema";
import { ReturnStatus } from '../enums/return-status.enum';

export const CreateReturnSchema = z.object({
	orderId: z.string(),
	status: z.enum(ReturnStatus),
	items: z.array(ReturnItemSchema).min(1),
});

export type CreateReturn = z.infer<typeof CreateReturnSchema>;
