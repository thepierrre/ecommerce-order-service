import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
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

@Injectable()
export class ReturnsService {
	private readonly logger = new Logger(ReturnsService.name);

	constructor(
		@Inject("ReturnsRepository")
		private readonly returnsRepo: ReturnsRepository,
		@Inject("OrdersRepository") private readonly ordersRepo: OrdersRepository,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
		@InjectDataSource() private readonly dataSource: DataSource,
	) {}

	async createReturn(orderId: string, dto: CreateReturn): Promise<ReturnRes> {
		const { savedOrder, savedReturn } = await this.dataSource.transaction(
			async (m) => {
				const orderRepoTx = m.getRepository(Order);
				const returnRepoTx = m.getRepository(Return);

				const order = await orderRepoTx.findOneByOrFail({ id: orderId });

				if (!isOrderDelivered(order)) {
					throw new ConflictException(
						`Cannot create a return for the order with the id ${orderId}. Return is only available for delivered orders.`,
					);
				}

				// To change if multiple returns are possible for an order.
				if (await this.doesReturnExist(orderId)) {
					throw new ConflictException(
						`Return for the order with the id ${orderId} already exists.`,
					);
				}

				const ret = returnRepoTx.create({
					orderId,
					...dto,
				});

				const savedReturn = await returnRepoTx.save(ret);
				const savedOrder = await orderRepoTx.save(initializeReturn(order));

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

	async findById(orderId: string): Promise<ReturnRes> {
		const existing = await this.returnsRepo.findOneOrFail({
			where: { orderId },
		});
		return toReturnRes(existing);
	}

	async processReturnReceived(orderNumber: string, returnNumber: string) {
		await this.dataSource.transaction(async (m) => {
			const ordersRepoTx = m.withRepository(this.ordersRepo);
			const returnsRepoTx = m.withRepository(this.returnsRepo);

			await ordersRepoTx.updateStatus(orderNumber, OrderStatus.RETURN_RECEIVED);
			await returnsRepoTx.updateStatus(returnNumber, ReturnStatus.RECEIVED);
		});
	}

	async processReturnCompleted(orderNumber: string, returnNumber: string) {
		await this.dataSource.transaction(async (m) => {
			const ordersRepoTx = m.withRepository(this.ordersRepo);
			const returnsRepoTx = m.withRepository(this.returnsRepo);

			await ordersRepoTx.updateStatus(
				orderNumber,
				OrderStatus.RETURN_COMPLETED,
			);
			await returnsRepoTx.updateStatus(returnNumber, ReturnStatus.COMPLETED);
		});
	}

	async doesReturnExist(orderId: string): Promise<boolean> {
		const existing = await this.returnsRepo.findOne({ where: { orderId } });
		return !!existing;
	}
}
