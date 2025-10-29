import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { WAREHOUSE_ORDER_PACKED_S } from "../../events/warehouse-service/orders/order.packed.v1";
import { WAREHOUSE_ORDER_PROCESSING_STARTED_S } from "../../events/warehouse-service/orders/order.processing-started.v1";
import type { Warehouse_ReturnCompleted } from "../../events/warehouse-service/returns/return.completed.v1";
import type { Warehouse_ReturnReceived } from "../../events/warehouse-service/returns/return.received.v1";
import { ReturnsService } from "../services/returns.service";

@Controller()
export class WarehouseReturnEventsListener {
	private readonly logger = new Logger(WarehouseReturnEventsListener.name);

	constructor(private readonly returnsSvc: ReturnsService) {}

	@EventPattern(WAREHOUSE_ORDER_PACKED_S)
	async onReturnReceived(@Payload() event: Warehouse_ReturnReceived) {
		const { orderNumber, returnNumber } = event;
		await this.returnsSvc.processReturnReceived(orderNumber, returnNumber);
	}

	@EventPattern(WAREHOUSE_ORDER_PROCESSING_STARTED_S)
	async onReturnCompleted(@Payload() event: Warehouse_ReturnCompleted) {
		const { orderNumber, returnNumber } = event;
		
		await this.returnsSvc.processReturnCompleted(orderNumber, returnNumber);
	}
}
