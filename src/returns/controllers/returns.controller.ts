import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Res,
	UsePipes,
} from "@nestjs/common";
import type { Response } from "express";
import { ZodValidationPipe } from "../../orders/pipes/zod-validation.pipe";
import {
	type CreateReturn,
	CreateReturnSchema,
} from "../models/schemas/create-return.schema";
import type { ReturnRes } from "../models/schemas/return-res.schema";
import type { ReturnsService } from "../services/returns.service";

@Controller()
export class ReturnsController {
	constructor(private readonly returnsSvc: ReturnsService) {}

	@Post("orders/:id/returns")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(CreateReturnSchema))
	async create(
		@Param("id") orderId: string,
		@Body() dto: CreateReturn,
		@Res({ passthrough: true }) res: Response,
	): Promise<ReturnRes> {
		const created = await this.returnsSvc.createReturn(orderId, dto);

		res.location(`/orders/${orderId}/returns/${created.id}`);
		return created;
	}

	@Get("internal/orders/:id/returns")
	async findById(@Param("id") orderId: string): Promise<ReturnRes> {
		return await this.returnsSvc.findById(orderId);
	}
}
