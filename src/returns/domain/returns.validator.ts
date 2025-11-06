import { OrdersRepository } from "src/orders/repositories/orders.repository";
import { ReturnsRepository } from "../repositories/returns.repository";
import { NotFoundException } from "@nestjs/common";

export const ensureOrderAndReturnExistOrThrow = async (
	ordersRepo: OrdersRepository,
	returnsRepo: ReturnsRepository,
	orderNumber: string,
	returnNumber: string,
) => {
	const existingOrder = await ordersRepo.findOneByOrderNumber(orderNumber);
	if (!existingOrder) {
		throw new NotFoundException(
			`Order with the number ${orderNumber} not found.`,
		);
	}

	const existingReturn = await returnsRepo.findOneByReturnNumber(returnNumber);
	if (!existingReturn) {
		throw new NotFoundException(
			`Return with the number ${returnNumber} not found.`,
		);
	}
};
