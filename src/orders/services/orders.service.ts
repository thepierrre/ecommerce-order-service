import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	PreconditionFailedException,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import {
	ORDER_ORDER_CREATED_S,
	toOrderCreatedV1,
} from "../../events/order-service/orders/order.created.v1";
import { Order } from "../models/entities/order.entity";
import { OrderStatus } from "../models/enums/order-status.enum";
import type { CreateOrder } from "../models/schemas/create-order.schema";
import {
	type OrderInternalRes,
	toOrderInternalRes,
} from "../models/schemas/order-internal-res.schema";
import {
	type OrderPublicRes,
	toOrderPublicRes,
} from "../models/schemas/order-public-res.schema";
import type { UpdateOrder } from "../models/schemas/update-order.schema";
import { makeETag } from "../utils/make-etag";

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name);

	constructor(
		@InjectRepository(Order)
		private readonly orderRepo: Repository<Order>,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
	) {}

	async create(dto: CreateOrder): Promise<OrderPublicRes> {
		try {
			const createOrder: Order = this.orderRepo.create({
				...dto,
				status: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
			});
			const saved = await this.orderRepo.save(createOrder);

			const orderCreatedEvent = toOrderCreatedV1(saved);

			this.nats.emit(ORDER_ORDER_CREATED_S, orderCreatedEvent);

			return toOrderPublicRes(saved);
		} catch (err: unknown) {
			const e = err as Error;
			this.logger.error(`Failed to place the order: ${e.message}`, e.stack);
			throw new InternalServerErrorException(
				`Failed to place the order: ${e.message}`,
			);
		}
	}

	async findByIdInternal(id: string): Promise<OrderInternalRes> {
		const order = await this.orderRepo.findOneByOrFail({ id });
		return toOrderInternalRes(order);
	}

	async findByIdPublic(id: string): Promise<OrderPublicRes> {
		const order = await this.orderRepo.findOneByOrFail({ id });
		return toOrderPublicRes(order);
	}

	async updateOrder(
		id: string,
		patch: UpdateOrder,
		etag?: string,
	): Promise<{ order: OrderPublicRes; newEtag: string }> {
		if (!etag) {
			throw new PreconditionFailedException("ETag header missing.");
		}

		const existing: Order = await this.orderRepo.findOneByOrFail({
			id: id,
		});
		// if (!existing) {
		// 	this.logger.error(`Order with the id ${id} not found.`);
		// 	throw new NotFoundException(`Order with the id ${id} not found.`);
		// }

		const currEtag = makeETag(existing);
		if (etag !== currEtag) {
			throw new PreconditionFailedException("Resource has changed.");
		}

		const updated = this.orderRepo.merge(existing, patch);
		const saved = await this.orderRepo.save(updated);
		return {
			order: toOrderPublicRes(saved),
			newEtag: makeETag({
				createdAt: saved.createdAt,
				lastUpdatedAt: saved.lastUpdatedAt,
			}),
		};
	}
}
