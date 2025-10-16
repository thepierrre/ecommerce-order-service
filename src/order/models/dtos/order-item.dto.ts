import { IsInt, IsNumber, IsString, Min } from "class-validator";

export class OrderItemDto {
	@IsString()
	productId: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	price: number;

	@IsInt()
	@Min(1)
	quantity: number;
}
