import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { InjectRepository } from "@nestjs/typeorm";
import type { DataSource, Repository } from "typeorm";
import {
	ORDER_RETURN_CREATED_S,
	toOrder_ReturnCreatedEvent,
} from "../../events/order-service/returns/return.created.v1";
import { isOrderDelivered } from "../../orders/domain/order.rules";
import { initializeReturn } from "../../orders/domain/order.state";
import { Order } from "../../orders/models/entities/order.entity";
import { Return } from "../models/entities/return.entity";
import type { CreateReturn } from "../models/schemas/create-return.schema";
import {
	type ReturnRes,
	toReturnRes,
} from "../models/schemas/return-res.schema";

@Injectable()
export class ReturnsService {
	private readonly logger = new Logger(ReturnsService.name);

	constructor(
		@InjectRepository(Return)
		private readonly returnRepo: Repository<Return>,
		@InjectRepository(Order)
		private readonly orderRepo: Repository<Order>,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
		private readonly dataSource: DataSource,
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

		const returnCreatedEvent = toOrder_ReturnCreatedEvent(savedReturn);

		this.nats.emit(ORDER_RETURN_CREATED_S, returnCreatedEvent);

		return toReturnRes(savedReturn);
	}

	async findByIdInternal(orderId: string): Promise<ReturnRes> {
		const existing = await this.returnRepo.findOneOrFail({
			where: { orderId },
		});
		return toReturnRes(existing);
	}

	async findByIdPublic(orderId: string): Promise<ReturnRes> {
		const existing = await this.returnRepo.findOneOrFail({
			where: { orderId },
		});
		return toReturnRes(existing);
	}

	async doesReturnExist(orderId: string): Promise<boolean> {
		const existing = await this.returnRepo.findOne({ where: { orderId } });
		return !!existing;
	}
}
