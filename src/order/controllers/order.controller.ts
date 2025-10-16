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
} from "@nestjs/common";
import type { Response } from "express";
import { OrderUpdateRequest } from "../../clients/notification/types/order-update-request.interface";
import { WarehouseResponse } from "../../clients/warehouse/warehouse-responses.interface";
import type { CreateOrderDto } from "../models/dtos/create-order.dto";
import { OrderResponseDto } from "../models/dtos/order-response.dto";
import { OrderRequest } from "../models/types/order-request.interface";
import { OrderReturn } from "../models/types/order-return.interface";
import type { OrderService } from "../services/order.service";

@Controller()
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	// Incoming from the User Service.
	@Post("orders")
	@HttpCode(201)
	async create(
		@Body() dto: CreateOrderDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<OrderResponseDto> {
		const order = await this.orderService.create(dto);

		res.location(`/orders/${order.id}`);
		return new OrderResponseDto(order);
	}

	@Get("orders/:id")
	async findById(@Param("id") id: string): Promise<OrderResponseDto> {
		return await this.orderService.findById(id);
	}

	// Incoming from the Warehouse Service.
	// @Patch('orders/:id')
	// async updateOrder(
	//   @Param('id') id: string,
	//   @Body() orderUpdateRequest: OrderUpdateRequest,
	// ): Promise<void> {
	//   const orderUpdate = { ...orderUpdateRequest, id };
	//   await this.orderService.updateOrder(orderUpdate);
	// }

	// Incoming from the User Service.
	// @Patch('orders/:id/return')
	// async createReturn(
	//   @Param('id') id: string,
	//   @Body() orderReturn: OrderReturn,
	// ): Promise<void> {
	//   await this.orderService.createReturn(orderReturn);
	// }
}
