import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";

import { Return } from "../models/entities/return.entity";
import { Order } from "../../orders/models/entities/order.entity";

@Injectable()
export class ReturnService {
	private readonly logger = new Logger(ReturnService.name);

	constructor(
		@InjectRepository(Return) private returnRepository: Repository<Return>,
		@InjectRepository(Order) private orderRepository: Repository<Order>,
		@Inject("NATS_SERVICE") private readonly nats: ClientProxy,
	) {}

	async createReturn() {}
}
