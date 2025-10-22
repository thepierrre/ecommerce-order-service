import { Module } from "@nestjs/common";
import { OrdersController } from "../controllers/orders.controller";
import { OrdersService } from "../services/orders.service";
import { OrderModule } from "./order.module";

@Module({
	imports: [OrderModule],
	providers: [OrdersService],
	controllers: [OrdersController],
})
export class OrderHttpModule {}
