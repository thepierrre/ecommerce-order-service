import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "../services/orders.service";
import { OrdersRepository } from "../repositories/orders.repository";
import {
	CARRIER_ORDER_DELIVERED_SUBJECT,
	OrderStatus,
	WAREHOUSE_ORDER_ACCEPTED_SUBJECT,
	WAREHOUSE_ORDER_PICKED_SUBJECT,
	WAREHOUSE_ORDER_PROCESSING_STARTED_SUBJECT,
	WAREHOUSE_ORDER_SHIPPED_SUBJECT,
} from "@thepierrre/ecom-common";

@Controller()
export class WarehouseOrderEventsListener {
	private readonly logger = new Logger(WarehouseOrderEventsListener.name);

	constructor(
		private readonly ordersSvc: OrdersService,
		@Inject("OrdersRepository") private readonly orderRepo: OrdersRepository,
	) {}

	@EventPattern(WAREHOUSE_ORDER_ACCEPTED_SUBJECT)
	async onOrderAccepted(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_ACCEPTED_SUBJECT,
			payload,
			OrderAcceptedEventSchema,
			OrderStatus.ACCEPTED_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PROCESSING_STARTED_SUBJECT)
	async onOrderProcessingStarted(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_PROCESSING_STARTED_SUBJECT,
			payload,
			Warehouse_OrderProcessingStartedSchema,
			OrderStatus.PROCESSING_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PICKED_SUBJECT)
	async onOrderPacked(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_PICKED_SUBJECT,
			payload,
			Warehouse_OrderPickedSchema,
			OrderStatus.PACKED,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_SHIPPED_SUBJECT)
	async onOrderShipped(@Payload() payload: unknown) {
		await this.processEvent(
			WAREHOUSE_ORDER_SHIPPED_SUBJECT,
			payload,
			Warehouse_OrderShippedSchema,
			OrderStatus.SHIPPED,
		);
	}

	@EventPattern(CARRIER_ORDER_DELIVERED_SUBJECT)
	async onOrderDelivered(@Payload() payload: unknown) {
		await this.processEvent(
			CARRIER_ORDER_DELIVERED_SUBJECT,
			payload,
			Warehouse_OrderDeliveredSchema,
			OrderStatus.DELIVERED,
		);
	}

	private async processEvent<T>(
		eventName: string,
		payload: unknown,
		schema: { parse: (data: unknown) => T },
		newStatus: OrderStatus,
	) {
		try {
			const event = schema.parse(payload);
			const { orderNumber } = event as WarehouseEvent;
			this.logger.log(
				`Received event ${eventName} for order with number ${orderNumber}`,
			);
			await this.ordersSvc.updateOrderByOrderNumber(
				orderNumber,
				{ status: newStatus },
				undefined,
				{ skipEtagCheck: true },
			);
		} catch (err: unknown) {
			const e = err as Error;
			this.logger.error(`Failed to process event ${eventName}`, e.stack, {
				message: e.message,
			});
		}
	}
}
