import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
	@IsString()
	userId: string;

	@IsBoolean()
	@IsOptional()
	isPaid?: boolean = false;

	@IsNumber({ maxDecimalPlaces: 2 })
	amount: number;

	@IsString()
	shippingMethod: string;

	@IsString()
	shippingAddress: string;
}
