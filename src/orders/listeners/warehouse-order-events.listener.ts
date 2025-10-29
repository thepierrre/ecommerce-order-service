import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import {
	WAREHOUSE_ORDER_ACCEPTED_S,
	Warehouse_OrderAcceptedSchema,
} from "../../events/warehouse-service/orders/order.accepted.v1";
import {
	WAREHOUSE_ORDER_DELIVERED_S,
	Warehouse_OrderDeliveredSchema,
} from "../../events/warehouse-service/orders/order.delivered.v1";
import {
	WAREHOUSE_ORDER_PACKED_S,
	Warehouse_OrderPackedSchema,
} from "../../events/warehouse-service/orders/order.packed.v1";
import {
	WAREHOUSE_ORDER_PROCESSING_STARTED_S,
	Warehouse_OrderProcessingStartedSchema,
} from "../../events/warehouse-service/orders/order.processing-started.v1";
import {
	WAREHOUSE_ORDER_SHIPPED_S,
	Warehouse_OrderShippedSchema,
} from "../../events/warehouse-service/orders/order.shipped.v1";
import { OrderStatus } from "../models/enums/order-status.enum";
import { OrdersRepository } from "../repositories/orders.repository";
import { WarehouseEvent } from "src/events/warehouse-service/orders/warehouse-order-event.type";
import { OrdersService } from "../services/orders.service";

@Controller()
export class WarehouseOrderEventsListener {
	private readonly logger = new Logger(WarehouseOrderEventsListener.name);

	constructor(
		private readonly ordersSvc: OrdersService,
		@Inject("OrdersRepository") private readonly orderRepo: OrdersRepository
	) { }

	@EventPattern(WAREHOUSE_ORDER_ACCEPTED_S)
	async onOrderAccepted(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_ACCEPTED_S,
			payload,
			Warehouse_OrderAcceptedSchema,
			OrderStatus.ACCEPTED_BY_WAREHOUSE,
		)
	}

	@EventPattern(WAREHOUSE_ORDER_PROCESSING_STARTED_S)
	async onOrderProcessingStarted(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_PROCESSING_STARTED_S,
			payload,
			Warehouse_OrderProcessingStartedSchema,
			OrderStatus.PROCESSING_BY_WAREHOUSE,
		)
	}

	@EventPattern(WAREHOUSE_ORDER_PACKED_S)
	async onOrderPacked(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_PACKED_S,
			payload,
			Warehouse_OrderPackedSchema,
			OrderStatus.PACKED,
		)
	}

	@EventPattern(WAREHOUSE_ORDER_SHIPPED_S)
	async onOrderShipped(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_SHIPPED_S,
			payload,
			Warehouse_OrderShippedSchema,
			OrderStatus.SHIPPED,
		)
	}

	@EventPattern(WAREHOUSE_ORDER_DELIVERED_S)
	async onOrderDelivered(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_DELIVERED_S,
			payload,
			Warehouse_OrderDeliveredSchema,
			OrderStatus.DELIVERED,
		)
	}

	private async processEvent<T>(
		eventName: string,
		payload: unknown,
		schema: { parse: (data: unknown) => T },
		newStatus: OrderStatus) {
		try {
			const event = schema.parse(payload);
			const { orderNumber } = event as WarehouseEvent;
			this.logger.log(`Received event ${eventName} for order with number ${orderNumber}`);
			await this.ordersSvc.updateOrderByOrderNumber(orderNumber, { status: newStatus }, undefined, { skipEtagCheck: true });


		} catch (err: unknown) {
			const e = err as Error;
			this.logger.error(`Failed to process event ${eventName}`, e.stack, { message: e.message })
		}
	}


}

