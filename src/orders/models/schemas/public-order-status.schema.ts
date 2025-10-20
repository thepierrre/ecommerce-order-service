import { z } from "zod";

export const PublicOrderStatusSchema = z.enum([
	"Placed",
	"Processing",
	"Shipped",
	"Delivered",
	"Return initiated",
	"Return completed",
]);

export type PublicOrderStatus = z.infer<typeof PublicOrderStatusSchema>;
