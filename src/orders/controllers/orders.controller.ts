import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UsePipes,
} from "@nestjs/common";
import type { Response } from "express";

import {
	type CreateOrder,
	CreateOrderSchema,
} from "../models/schemas/create-order.schema";
import type { OrderRes } from "../models/schemas/order-res.schema";
import {
	type UpdateOrder,
	UpdateOrderSchema,
} from "../models/schemas/update-order.schema";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import type { OrdersService } from "../services/orders.service";

@Controller()
export class OrdersController {
	constructor(private readonly ordersSvc: OrdersService) {}

	@Post("orders")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(CreateOrderSchema))
	async create(
		@Body() dto: CreateOrder,
		@Res({ passthrough: true }) res: Response,
	): Promise<OrderRes> {
		const created = await this.ordersSvc.create(dto);

		res.location(`/orders/${created.id}`);
		return created;
	}

	@Get("internal/orders/:id")
	async findByIdInternal(@Param("id") id: string): Promise<OrderRes> {
		return await this.ordersSvc.findById(id);
	}

	@Patch("orders/:id")
	@UsePipes(new ZodValidationPipe(UpdateOrderSchema))
	async update(
		@Param("id") id: string,
		@Body() patch: UpdateOrder,
		@Res({ passthrough: true }) res: Response,
		@Headers("if-match") etag?: string,
	): Promise<OrderRes> {
		const patched = await this.ordersSvc.updateOrder(id, patch, etag);

		res.setHeader("ETag", patched.newEtag);
		res.setHeader("Location", `/orders/${id}`);

		return patched.order;
	}
}
