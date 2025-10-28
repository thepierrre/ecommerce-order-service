import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./controllers/orders.controller";
import { WarehouseOrderEventsListener } from "./listeners/warehouse-order-events.listener";
import { Order } from "./models/entities/order.entity";
import { OrdersRepository } from "./repositories/orders.repository";
import { OrdersService } from "./services/orders.service";
import { DataSource } from "typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([Order])],
	controllers: [OrdersController, WarehouseOrderEventsListener],
	providers: [
		OrdersService,
		{
			provide: "OrdersRepository",
			useFactory: (dataSource: DataSource) => new OrdersRepository(dataSource),
			inject: [DataSource],
		},
	],
	exports: ["OrdersRepository", OrdersService],
})
export class OrdersModule {}
