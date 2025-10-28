import { Injectable } from "@nestjs/common";
import { type DataSource, Repository } from "typeorm";
import { Order } from "../models/entities/order.entity";
import type { OrderStatus } from "../models/enums/order-status.enum";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class OrdersRepository extends Repository<Order> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super(Order, dataSource.createEntityManager());
	}

	async updateStatus(orderNumber: string, status: OrderStatus): Promise<void> {
		await this.update({ orderNumber }, { status });
	}
}
