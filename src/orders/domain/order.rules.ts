import type { Order } from "../models/entities/order.entity";
import { OrderStatus } from "../models/enums/order-status.enum";

export const isOrderDelivered = (o: Order) =>
	o.status === OrderStatus.DELIVERED;
