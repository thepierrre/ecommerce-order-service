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
} from '@nestjs/common';
import type { Response } from 'express';

import { type CreateOrder, CreateOrderSchema } from '../models/schemas/create-order.schema';
import type { OrderInternalRes } from '../models/schemas/order-internal-res.schema';
import type { OrderPublicRes } from '../models/schemas/order-public-res.schema';
import { type UpdateOrder, UpdateOrderSchema } from '../models/schemas/update-order.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import type { OrdersService } from '../services/orders.service';

@Controller()
export class OrdersController {
	constructor(private readonly ordersSvc: OrdersService) {}

	@Post("orders")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(CreateOrderSchema))
	async create(
		@Body() dto: CreateOrder,
		@Res({ passthrough: true }) res: Response,
	): Promise<OrderPublicRes> {
		const created = await this.ordersSvc.create(dto);

		res.location(`/orders/${created.id}`);
		return created;
	}

	@Get("internal/orders/:id")
	async findByIdInternal(
		@Param("id") id: string,
	): Promise<OrderInternalRes> {
		return await this.ordersSvc.findByIdInternal(id);
	}

	@Get("orders/:id")
	async findByIdPublic(@Param("id") id: string): Promise<OrderPublicRes> {
		return await this.ordersSvc.findByIdPublic(id);
	}

	@Patch("orders/:id")
	@UsePipes(new ZodValidationPipe(UpdateOrderSchema))
	async update(
		@Param("id") id: string,
		@Body() patch: UpdateOrder,
		@Res({ passthrough: true }) res: Response,
		@Headers("if-match") etag?: string,
	): Promise<OrderPublicRes> {
		const patched = await this.ordersSvc.updateOrder(id, patch, etag);

		res.setHeader("ETag", patched.newEtag);
		res.setHeader("Location", `/orders/${id}`);

		return patched.order;
	}
}
