import { ConflictException, HttpException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";
import {
	ORDER_RETURN_CREATED_S,
	toOrder_ReturnCreatedEvent,
} from "../../events/order-service/returns/return.created.v1";
import { isOrderDelivered } from "../../orders/domain/order.rules";
import { initializeReturn } from "../../orders/domain/order.state";
import { Order } from "../../orders/models/entities/order.entity";
import { OrderStatus } from "../../orders/models/enums/order-status.enum";
import type { OrdersRepository } from "../../orders/repositories/orders.repository";
import { Return } from "../models/entities/return.entity";
import { ReturnStatus } from "../models/enums/return-status.enum";
import type { CreateReturn } from "../models/schemas/create-return.schema";
import {
	type ReturnRes,
	toReturnRes,
} from "../models/schemas/return-res.schema";
import type { ReturnsRepository } from "../repositories/returns.repository";
import { ensureOrderAndReturnExistOrThrow } from "../domain/returns.validator";
import { WAREHOUSE_ORDER_PICKED_S } from "src/events/warehouse-service/orders/order.picked.v1";
import { WAREHOUSE_ORDER_PROCESSING_STARTED_S } from "src/events/warehouse-service/orders/order.processing-started.v1";

@Injectable()
export class ReturnsService {
	private readonly logger = new Logger(ReturnsService.name);

	constructor(
		@Inject("ReturnsRepository")
		private readonly returnsRepo: ReturnsRepository,
		@Inject("OrdersRepository") private readonly ordersRepo: OrdersRepository,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
		@InjectDataSource() private readonly dataSource: DataSource,
	) { }

	async createReturn(orderId: string, dto: CreateReturn): Promise<ReturnRes> {
		const { savedOrder, savedReturn } = await this.dataSource.transaction(
			async (m) => {
				const orderRepoTx = m.getRepository(Order);
				const returnRepoTx = m.getRepository(Return);

				const existingOrder = await orderRepoTx.findOneBy({ id: orderId });
				if (!existingOrder) {
					throw new NotFoundException(`Order with the id ${orderId} not found`);
				}

				if (!isOrderDelivered(existingOrder)) {
					throw new ConflictException(
						`Cannot create return for order with id ${orderId}. Return is only available for delivered orders`,
					);
				}

				// To change if multiple returns are possible for an order.
				if (await this.doesReturnExist(orderId)) {
					throw new ConflictException(
						`Return for order with id ${orderId} already exists`,
					);
				}

				const ret = returnRepoTx.create({
					orderId,
					...dto,
				});

				const savedReturn = await returnRepoTx.save(ret);
				const savedOrder = await orderRepoTx.save(initializeReturn(existingOrder));

				return { savedOrder, savedReturn };
			},
		);

		const returnCreatedEvent = toOrder_ReturnCreatedEvent(
			savedReturn,
			savedOrder.orderNumber,
		);

		this.nats.emit(ORDER_RETURN_CREATED_S, returnCreatedEvent);

		return toReturnRes(savedReturn);
	}

	async findByOrderId(orderId: string): Promise<ReturnRes> {
		const existing = await this.returnsRepo.findOneByOrderId(orderId);

		if (!existing) {
			throw new NotFoundException(`Return for order with id ${orderId} not found`);
		}

		return toReturnRes(existing);
	}

	async processReturnReceived(orderNumber: string, returnNumber: string) {
		this.logger.log(
			`Received ${WAREHOUSE_ORDER_PICKED_S}: ${orderNumber}, ${returnNumber}`,
		);

		await this.dataSource.transaction(async (m) => {
			const ordersRepoTx = m.withRepository(this.ordersRepo);
			const returnsRepoTx = m.withRepository(this.returnsRepo);

			await ensureOrderAndReturnExistOrThrow(ordersRepoTx, returnsRepoTx, orderNumber, returnNumber);

			await ordersRepoTx.updateStatus(orderNumber, OrderStatus.RETURN_RECEIVED);
			await returnsRepoTx.updateStatus(returnNumber, ReturnStatus.RECEIVED);
		});
	} catch(err) {
		if (err instanceof HttpException) throw err;

		const e = err as Error;
		this.logger.error(`Failed to process return`, e.stack, { message: e.message });
		throw new InternalServerErrorException(
			`Failed to process return`,
		);
	}

	async processReturnCompleted(orderNumber: string, returnNumber: string) {
		this.logger.log(
			`Received ${WAREHOUSE_ORDER_PROCESSING_STARTED_S}: ${orderNumber}, ${returnNumber}`,
		);

		await this.dataSource.transaction(async (m) => {
			const ordersRepoTx = m.withRepository(this.ordersRepo);
			const returnsRepoTx = m.withRepository(this.returnsRepo);

			await ensureOrderAndReturnExistOrThrow(ordersRepoTx, returnsRepoTx, orderNumber, returnNumber);

			await ordersRepoTx.updateStatus(
				orderNumber,
				OrderStatus.RETURN_COMPLETED,
			);
			await returnsRepoTx.updateStatus(returnNumber, ReturnStatus.COMPLETED);
		});
	}

	async doesReturnExist(orderId: string): Promise<boolean> {
		const existing = await this.returnsRepo.findOneByOrderId(orderId);
		return !!existing;
	}
}



