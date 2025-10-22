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
import type { ReturnInternalRes } from "../models/schemas/return-internal-res.schema";
import type { ReturnPublicRes } from "../models/schemas/return-public-res.schema";
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
	): Promise<ReturnPublicRes> {
		const created = await this.returnsSvc.createReturn(orderId, dto);

		res.location(`/orders/${orderId}/returns/${created.id}`);
		return created;
	}

	@Get("internal/orders/:id/returns")
	async findByIdInternal(
		@Param("id") orderId: string,
	): Promise<ReturnInternalRes> {
		return await this.returnsSvc.findByIdInternal(orderId);
	}

	@Get("orders/:id/returns")
	async findByIdPublic(@Param("id") orderId: string): Promise<ReturnPublicRes> {
		return await this.returnsSvc.findByIdPublic(orderId);
	}
}
