import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { OrderRequest } from "../models/types/order-request.interface";
import { WarehouseClientService } from "../../clients/warehouse/warehouse-client.service";
import { Repository } from "typeorm";
import { Order } from "../models/entities/order.entity";
import { WarehouseResponse } from "../../clients/warehouse/warehouse-responses.interface";
import { OrderStatus } from "../models/enums/order-status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderReturn } from "../models/types/order-return.interface";
import { OrderUpdateRequest } from "../../clients/notification/types/order-update-request.interface";
import {
	CreateOrder,
	CreateOrderSchema,
} from "../models/schemas/create-order.schema";
import { ClientProxy } from "@nestjs/microservices";
import { OrderPublic, toOrderPublic } from "../models/schemas/order.public";
import {
	ORDER_CREATED_SUBJECT,
	toOrderCreatedV1,
} from "../../contracts/orders/order-created-v1.schema";
import { OrderInternal, toOrderInternal } from '../models/schemas/order.internal';

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);

	constructor(
		private readonly warehouseClientService: WarehouseClientService,
		@InjectRepository(Order)
		private orderRepository: Repository<Order>,

		@Inject("NATS_SERVICE")
		private readonly nats: ClientProxy,
	) {}

	async create(dto: CreateOrder): Promise<OrderPublic> {
		try {
			const createOrder: Order = this.orderRepository.create({
				...dto,
				status: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
			});
			const saved = await this.orderRepository.save(createOrder);

			const orderCreatedEvent = toOrderCreatedV1(saved);

			this.nats.emit(ORDER_CREATED_SUBJECT, orderCreatedEvent);

			return toOrderPublic(saved);
		} catch (err: unknown) {
			const e = err as Error;
			this.logger.error(`Failed to place the order: ${e.message}`, e.stack);
			throw new InternalServerErrorException(`Failed to place the order: ${e.message}`);
		}
	}

	async findByIdInternal(id: string): Promise<OrderInternal> {
		const order = await this.orderRepository.findOneBy({ id });
		return toOrderInternal(order);
	}

	async findByIdPublic(id: string): Promise<OrderPublic> {
		const order = await this.orderRepository.findOneBy({ id });
		return toOrderPublic(order);
	}

	async createReturn(orderReturn: OrderReturn): Promise<void> {
		const orderUpdate: OrderUpdateRequest = {
			orderId: orderReturn.orderId,
			orderStatus: OrderStatus.RETURN_INITIATED,
		};
		await this.updateOrder(orderUpdate);
		await this.warehouseClientService.createReturn(orderReturn);
	}



	async updateOrder(orderUpdate: OrderUpdateRequest): Promise<void> {
		const { orderId, orderStatus } = orderUpdate;
		const existingOrder: Order = await this.orderRepository.findOneBy({
			id: orderId,
		});
		if (!existingOrder) {
			this.logger.error(`Order with the id ${orderId} not found.`);
			throw new NotFoundException(`Order with the id ${orderId} not found.`);
		}

		const updatedOrder = this.orderRepository.merge(existingOrder, {
			status: orderStatus,
		});
		await this.orderRepository.save(updatedOrder);
	}
}
