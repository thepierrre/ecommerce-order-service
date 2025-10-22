import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { InjectRepository } from "@nestjs/typeorm";
import type { DataSource, Repository } from "typeorm";
import {
	ORDER_RETURN_CREATED_S,
	toReturnCreatedV1,
} from "../../events/order-service/returns/return.created.v1";
import { isOrderDelivered } from "../../orders/domain/order.rules";
import { initializeReturn } from "../../orders/domain/order.state";
import { Order } from "../../orders/models/entities/order.entity";
import { Return } from "../models/entities/return.entity";
import type { CreateReturn } from "../models/schemas/create-return.schema";
import {
	type ReturnInternalRes,
	toReturnInternalRes,
} from "../models/schemas/return-internal-res.schema";
import {
	type ReturnPublicRes,
	toReturnPublicRes,
} from "../models/schemas/return-public-res.schema";

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

	async createReturn(
		orderId: string,
		dto: CreateReturn,
	): Promise<ReturnPublicRes> {
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

		const returnCreatedEvent = toReturnCreatedV1(savedReturn);

		this.nats.emit(ORDER_RETURN_CREATED_S, returnCreatedEvent);

		return toReturnPublicRes(savedReturn);
	}

	async findByIdInternal(orderId: string): Promise<ReturnInternalRes> {
		const existing = await this.returnRepo.findOneOrFail({
			where: { orderId },
		});
		return toReturnInternalRes(existing);
	}

	async findByIdPublic(orderId: string): Promise<ReturnPublicRes> {
		const existing = await this.returnRepo.findOneOrFail({
			where: { orderId },
		});
		return toReturnPublicRes(existing);
	}

	async doesReturnExist(orderId: string): Promise<boolean> {
		const existing = await this.returnRepo.findOne({ where: { orderId } });
		return !!existing;
	}
}
