import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
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
import type { OrderInternalResponse } from "../models/schemas/order-internal-response.schema";
import type { OrderPublic } from "../models/schemas/order-public-response.schema";
import {
	type UpdateOrder,
	UpdateOrderSchema,
} from "../models/schemas/update-order.schema";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import type { OrderService } from "../services/order.service";

@Controller()
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post("orders")
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(CreateOrderSchema))
	async create(
		@Body() dto: CreateOrder,
		@Res({ passthrough: true }) res: Response,
	): Promise<OrderPublic> {
		const order = await this.orderService.create(dto);

		res.location(`/orders/${order.id}`);
		return order;
	}

	@Get("internal/orders/:id")
	async findByIdInternal(
		@Param("id") id: string,
	): Promise<OrderInternalResponse> {
		return await this.orderService.findByIdInternal(id);
	}

	@Get("orders/:id")
	async findByIdPublic(@Param("id") id: string): Promise<OrderPublic> {
		return await this.orderService.findByIdPublic(id);
	}

	@Patch("orders/:id")
	@UsePipes(new ZodValidationPipe(UpdateOrderSchema))
	async update(
		@Param("id") id: string,
		@Body() patch: UpdateOrder,
		@Res({ passthrough: true }) res: Response,
		@Headers("if-match") etag?: string,
	): Promise<OrderPublic> {
		const patched = await this.orderService.updateOrder(id, patch, etag);

		res.setHeader("ETag", patched.newEtag);
		res.setHeader("Location", `/orders/${id}`);

		return patched.order;
	}
}
