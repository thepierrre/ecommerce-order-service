import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import {
	WAREHOUSE_ORDER_ACCEPTED_S,
	type Warehouse_OrderAcceptedV1,
} from "../../events/warehouse-service/orders/order.accepted.v1";
import type { ReturnsRepository } from "../repositories/returns.repository";
import { OrderStatus } from "../models/enums/order-status.enum";
import {
	WAREHOUSE_ORDER_DELIVERED_S,
	Warehouse_OrderDeliveredV1,
} from "../../events/warehouse-service/orders/order.delivered.v1";
import {
	WAREHOUSE_ORDER_PROCESSING_STARTED_S,
	Warehouse_OrderProcessingStartedV1,
} from "../../events/warehouse-service/orders/order.processing-started.v1";
import {
	WAREHOUSE_ORDER_PACKED_S,
	Warehouse_OrderPackedV1,
} from "../../events/warehouse-service/orders/order.packed.v1";
import {
	WAREHOUSE_ORDER_SHIPPED_S,
	Warehouse_OrderShippedV1,
} from "../../events/warehouse-service/orders/order.shipped.v1";
import { WAREHOUSE_RETURN_ACCEPTED_S } from "../../events/warehouse-service/returns/return.accepted.v1";

@Controller()
export class WarehouseEventsListener {
	private readonly logger = new Logger(WarehouseEventsListener.name);

	constructor(private readonly orderRepo: ReturnsRepository) {}

	@EventPattern(WAREHOUSE_RETURN_ACCEPTED_S)
	async handleReturnAccepted(@Payload() event: Warehouse_OrderAcceptedV1) {
		const { orderId } = event;
		this.logger.log(`Received ${WAREHOUSE_RETURN_ACCEPTED_S}: ${orderId}`);
		await this.orderRepo.updateStatus(
			orderId,
			OrderStatus.ACCEPTED_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PROCESSING_STARTED_S)
	async handleReturnCompleted(
		@Payload() event: Warehouse_OrderProcessingStartedV1,
	) {
		const { orderId } = event;
		this.logger.log(
			`Received ${WAREHOUSE_ORDER_PROCESSING_STARTED_S}: ${orderId}`,
		);
		await this.orderRepo.updateStatus(
			orderId,
			OrderStatus.PROCESSING_BY_WAREHOUSE,
		);
	}

	@EventPattern(WAREHOUSE_ORDER_PACKED_S)
	async handleReturnReceived(@Payload() event: Warehouse_OrderPackedV1) {
		const { orderId } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_PACKED_S}: ${orderId}`);
		await this.orderRepo.updateStatus(orderId, OrderStatus.PACKED);
	}

	@EventPattern(WAREHOUSE_ORDER_SHIPPED_S)
	async handleReturnRejected(@Payload() event: Warehouse_OrderShippedV1) {
		const { orderId } = event;
		this.logger.log(`Received ${WAREHOUSE_ORDER_SHIPPED_S}: ${orderId}`);
		await this.orderRepo.updateStatus(orderId, OrderStatus.SHIPPED);
	}
}
