import {
	HttpException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	PreconditionFailedException,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { Order } from "../models/entities/order.entity";
import { OrderStatus } from "../models/enums/order-status.enum";
import type { CreateOrder } from "../models/schemas/create-order.schema";
import { type OrderRes } from "../models/schemas/order-res.schema";
import type { UpdateOrder } from "../models/schemas/update-order.schema";
import { makeETag } from "../utils/make-etag";
import type { OrdersRepository } from "../repositories/orders.repository";
import { ORDER_ORDER_CREATED_SUBJECT } from "@thepierrre/ecom-common";
import { toOrderCreatedEvent } from "../mappers/to-order-created-event";
import { toOrderRes } from "../mappers/to-order-res";

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name);

	constructor(
		@Inject("OrdersRepository") private readonly orderRepo: OrdersRepository,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
	) { }

	async create(dto: CreateOrder): Promise<OrderRes> {
		try {
			const createOrder: Order = this.orderRepo.create({
				...dto,
				status: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
			});
			const saved = await this.orderRepo.save(createOrder);

			const orderCreatedEvent = await toOrderCreatedEvent(saved);

			this.nats.emit(ORDER_ORDER_CREATED_SUBJECT, orderCreatedEvent);

			return await toOrderRes(saved);
		} catch (err: unknown) {
			if (err instanceof HttpException) throw err;

			const e = err as Error;
			this.logger.error(`Failed to place order: `, e.stack, { message: e.message });
			throw new InternalServerErrorException(
				`Failed to place order`,
			);
		}
	}

	async findById(id: string): Promise<OrderRes> {
		const existing = await this.orderRepo.findOneBy({ id });

		if (!existing) {
			throw new NotFoundException(`Order with id ${id} not found`);
		}

		return toOrderRes(existing);
	}

	async updateOrderById(
		id: string, 
		patch: UpdateOrder,
		etag?: string,
		options?: { skipEtagCheck?: boolean }
	): Promise<{ order: OrderRes; newEtag: string }> {
		return this.updateOrder({ id }, patch, etag, options);
	}

	async updateOrderByOrderNumber(
		orderNumber: string,
		patch: UpdateOrder,
		etag?: string,
		options?: { skipEtagCheck?: boolean }
	): Promise<{ order: OrderRes; newEtag: string }> {
		return this.updateOrder({ orderNumber }, patch, etag, options);
	}

	private async updateOrder(
		identifier: { orderNumber: string } | { id: string },
		patch: UpdateOrder,
		etag?: string,
		options?: { skipEtagCheck?: boolean }
	): Promise<{ order: OrderRes; newEtag: string }> {
		if (!options?.skipEtagCheck && !etag) {
			throw new PreconditionFailedException("ETag header missing.");
		}

		const where = this.hasOwnId(identifier) ? { id: identifier.id } : { orderNumber: identifier.orderNumber };

		const existing: Order | null = await this.orderRepo.findOneBy(where);
		if (!existing) {
			if (this.hasOwnId(identifier)) {
				throw new NotFoundException(`Order with id ${identifier.id} not found`);
			}
			throw new NotFoundException(`Order with order number ${identifier.orderNumber} not found`);
		}

		const currEtag = makeETag(existing);
		if (etag !== currEtag) {
			throw new PreconditionFailedException("Resource has changed.");
		}

		try {
			const updated = this.orderRepo.merge(existing, patch);
			const saved = await this.orderRepo.save(updated);
			return {
				order: await toOrderRes(saved),
				newEtag: makeETag({
					createdAt: saved.createdAt,
					lastUpdatedAt: saved.lastUpdatedAt,
				}),
			};
		} catch (err: unknown) {
			if (err instanceof HttpException) throw err;

			const e = err as Error;
			this.logger.error(`Failed to update order`, e.stack, { message: e.message });
			throw new InternalServerErrorException(
				`Failed to update order`,
			);
		}

	}

	hasOwnId(obj: { id?: string } | { orderNumber?: string }): obj is { id: string } {
		return obj.hasOwnProperty("id");
	}
}
