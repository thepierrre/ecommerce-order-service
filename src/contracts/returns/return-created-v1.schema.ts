import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Return } from '../../returns/models/entities/return.entity';
import { ReturnItemSchema } from '../../returns/models/schemas/return-item.schema';
import { ReturnReason } from '../../returns/models/enums/return-reason.enum';


export const ReturnCreatedV1Schema = z.object({
  schemaVersion: z.literal(1),
  eventId: z.uuid(),
  occurredAt: z.iso.datetime(),
  orderId: z.string(),
  returnId: z.string(),
  items: z.array(ReturnItemSchema).min(1),
});

export type ReturnCreatedV1 = z.infer<typeof ReturnCreatedV1Schema>;

export const RETURN_CREATED_SUBJECT = "returns.created.v1";

export const toReturnCreatedV1 = (r: Return): ReturnCreatedV1 => ({
  schemaVersion: 1,
  eventId: uuidv4(),
  occurredAt: new Date().toISOString(),
  orderId: r.orderId,
  returnId: r.id,
  items: r.items,
});
