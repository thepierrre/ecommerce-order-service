import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UsePipes,
	Headers,
} from "@nestjs/common";
import type { Response } from "express";
import { OrderUpdateRequest } from "../../clients/notification/types/order-update-request.interface";
import { WarehouseResponse } from "../../clients/warehouse/warehouse-responses.interface";
import {
	CreateOrder,
	CreateOrderSchema,
} from "../models/schemas/create-order.schema";

import type { OrderService } from "../services/order.service";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { OrderInternalResponse } from "../models/schemas/order-internal-response.schema";
import {
	OrderPublicResponse,
	toOrderPublicResponse,
} from "../models/schemas/order-public-response.schema";
import {
	UpdateOrder,
	UpdateOrderSchema,
} from "../models/schemas/update-order.schema";

@Controller()
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	// Incoming from the User Service.
	@Post("orders")
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(CreateOrderSchema))
	async create(
		@Body() dto: CreateOrder,
		@Res({ passthrough: true }) res: Response,
	): Promise<OrderPublicResponse> {
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
	async findByIdPublic(@Param("id") id: string): Promise<OrderPublicResponse> {
		return await this.orderService.findByIdPublic(id);
	}

	@Patch("orders/:id")
	@UsePipes(new ZodValidationPipe(UpdateOrderSchema))
	async update(
		@Param("id") id: string,
		@Body() patch: UpdateOrder,
		@Res({ passthrough: true }) res: Response,
		@Headers("if-match") etag?: string,
	): Promise<OrderPublicResponse> {
		const patched = await this.orderService.updateOrder(id, patch, etag);

		res.setHeader("ETag", patched.newEtag);
		res.setHeader("Location", `/orders/${id}`);

		return patched.order;
	}
}
