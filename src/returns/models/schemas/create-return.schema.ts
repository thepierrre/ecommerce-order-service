import { z } from "zod";
import { ReturnItemSchema } from "./return-item.schema";

export const CreateReturnSchema = z.object({
	items: z.array(ReturnItemSchema).min(1),
});

export type CreateReturn = z.infer<typeof CreateReturnSchema>;
