import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OrderRequest } from "../models/types/order-request.interface";
import { WarehouseClientService } from "../../clients/warehouse/warehouse-client.service";
import { Repository } from "typeorm";
import { Order } from "../models/entities/order.entity";
import { WarehouseResponse } from "../../clients/warehouse/warehouse-responses.interface";
import { OrderStatus } from "../models/enums/order-status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderReturn } from "../models/types/order-return.interface";
import { OrderUpdateRequest } from "../../clients/notification/types/order-update-request.interface";
import { CreateOrderSchema } from "../models/schemas/create-order.schema";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);

	constructor(
		private readonly warehouseClientService: WarehouseClientService,
		@InjectRepository(Order)
		private orderRepository: Repository<Order>,

		@Inject("NATS_SERVICE")
		private readonly client: ClientProxy,
	) {}

	async create(dto: CreateOrderSchema): Promise<Order> {
		try {
			const newOrder: Order = this.orderRepository.create({
				...dto,
				status: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
			});
			return await this.orderRepository.save(newOrder);
		} catch (error) {
			//TODO: Examine the difference in structure between error, error.response, error.data, error.stack etc.
			this.logger.error(`Failed to save the order: ${error.message}`);
			throw error;
		}
	}

	async createReturn(orderReturn: OrderReturn): Promise<void> {
		const orderUpdate: OrderUpdateRequest = {
			orderId: orderReturn.orderId,
			orderStatus: OrderStatus.RETURN_INITIATED,
		};
		await this.updateOrder(orderUpdate);
		await this.warehouseClientService.createReturn(orderReturn);
	}

	async findById(id: string): Promise<Order> {
		return await this.orderRepository.findOneBy({ id });
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

	async sendNewOrderToWarehouse(order: Order): Promise<WarehouseResponse> {
		let warehouseResponse: WarehouseResponse;

		// Send the new order to the warehouse.
		try {
			warehouseResponse =
				await this.warehouseClientService.sendNewOrderToWarehouse(order);
		} catch (warehouseError) {
			this.logger.error(
				`Failed to send the order to the warehouse: ${warehouseError.message}`,
			);
			// Update the status order as WAREHOUSE_SERVICE_UNAVAILABLE if the warehouse is unreachable.
			try {
				await this.updateOrder({
					orderId: order.id,
					orderStatus: OrderStatus.WAREHOUSE_SERVICE_UNAVAILABLE,
				} as OrderUpdateRequest);
			} catch (updateError) {
				this.logger.error(
					`Failed to update the status of the order as WAREHOUSE_SERVICE_UNAVAILABLE: ${updateError.message}`,
				);
			}
			throw warehouseError;
		}

		// Update the order status from the order response if the warehouse responds.
		try {
			await this.updateOrder({
				orderId: order.id,
				orderStatus: warehouseResponse.status,
			} as OrderUpdateRequest);
		} catch (updateError) {
			this.logger.error(
				`Successfuly sent the order to the warehouse, but failed to update the order in the database: ${updateError.message}`,
			);
			throw updateError;
		}

		return warehouseResponse;
	}

	async createOrderAndSendToWarehouse(
		orderRequest: OrderRequest,
	): Promise<WarehouseResponse> {
		const order = await this.create(orderRequest);
		return await this.sendNewOrderToWarehouse(order);
	}
}
