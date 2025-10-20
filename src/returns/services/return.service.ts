import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Return } from '../models/entities/return.entity';
import { Order } from '../../orders/models/entities/order.entity';
import { CreateReturn } from '../models/schemas/create-return.schema';
import { isOrderDelivered } from '../../orders/domain/order.rules';
import { ReturnStatus } from '../models/enums/return-status.enum';
import { initializeReturn } from '../../orders/domain/order.state';
import { ReturnPublicResponse } from '../models/schemas/return-public.schema';

@Injectable()
export class ReturnService {
	private readonly logger = new Logger(ReturnService.name);

	constructor(
		@InjectRepository(Return)
		private readonly returnRepo: Repository<Return>,
		@InjectRepository(Order)
		private readonly orderRepo: Repository<Order>,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
		private readonly dataSource: DataSource,
	) {}

	async createReturn(orderId: string; dto: CreateReturn): Promise<ReturnPublicResponse> {
		const { savedOrder, savedReturn } = await this.dataSource.transaction(async (m) => {
			const orderRepoTx = m.getRepository(Order);
			const returnRepoTx = m.getRepository(Return);

			const order = await orderRepoTx.findOneByOrFail(
				{ id: orderId },
			);

			if (!isOrderDelivered(order)) {
				throw new ConflictException(`Cannot create a return for the order with the id ${orderId}. Return is only available for delivered orders.`)
			}

			if (await this.doesReturnExist(orderId)) {
				throw new ConflictException(`Return for the order with the id ${orderId} already exists.`)
			}

			const ret = returnRepoTx.create({
				orderId,
				...dto,
			});

			const savedReturn = await returnRepoTx.save(ret);
			const savedOrder = await orderRepoTx.save(initializeReturn(order))

			return {savedOrder, savedReturn };
		});

		this.nats.emit()
	}

	async doesReturnExist(orderId: string): Promise<boolean> {
		const existing = await this.returnRepo.findOneBy({ id: orderId } );
		return !!existing;
}
}
