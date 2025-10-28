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

@Controller()
export class WarehouseOrderEventsListener {
	private readonly logger = new Logger(WarehouseOrderEventsListener.name);

	constructor(@Inject("OrdersRepository") private readonly orderRepo: OrdersRepository) { }

	@EventPattern(WAREHOUSE_ORDER_ACCEPTED_S)
	async onOrderAccepted(@Payload() payload: unknown) {
		const event = Warehouse_OrderAcceptedSchema.parse(payload);
		const { orderNumber } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_ACCEPTED_S}: ${orderNumber}`);
		await this.orderRepo.updateStatus(
			orderNumber,
			OrderStatus.ACCEPTED_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PROCESSING_STARTED_S)
	async onOrderProcessingStarted(@Payload() payload: unknown) {
		const event = Warehouse_OrderProcessingStartedSchema.parse(payload);
		const { orderNumber } = event;
		this.logger.log(
			`Received ${WAREHOUSE_ORDER_PROCESSING_STARTED_S}: ${orderNumber}`,
		);
		await this.orderRepo.updateStatus(
			orderNumber,
			OrderStatus.PROCESSING_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PACKED_S)
	async handleOrderPacked(@Payload() payload: unknown) {
		const event = Warehouse_OrderPackedSchema.parse(payload);
		const { orderNumber } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_PACKED_S}: ${orderNumber}`);
		await this.orderRepo.updateStatus(orderNumber, OrderStatus.PACKED);
	}

	@EventPattern(WAREHOUSE_ORDER_SHIPPED_S)
	async handleOrderShipped(@Payload() payload: unknown) {
		const event = Warehouse_OrderShippedSchema.parse(payload);
		const { orderNumber } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_SHIPPED_S}: ${orderNumber}`);
		await this.orderRepo.updateStatus(orderNumber, OrderStatus.SHIPPED);
	}

	@EventPattern(WAREHOUSE_ORDER_DELIVERED_S)
	async handleOrderDelivered(@Payload() payload: unknown) {
		const event = Warehouse_OrderDeliveredSchema.parse(payload);
		const { orderNumber } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_DELIVERED_S}: ${orderNumber}`);
		await this.orderRepo.updateStatus(orderNumber, OrderStatus.DELIVERED);
	}
}

