import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReturnsController } from "./controllers/returns.controller";
import { WarehouseReturnEventsListener } from "./listeners/warehouse-return-events.listener";
import { Return } from "./models/entities/return.entity";
import { ReturnsService } from "./services/returns.service";
import { ReturnsRepository } from "./repositories/returns.repository";
import { OrdersModule } from "../orders/orders.module";
import { DataSource } from "typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([Return]), OrdersModule],
	controllers: [ReturnsController, WarehouseReturnEventsListener],
	providers: [
			ReturnsService,
			{
				provide: "ReturnsRepository",
				useFactory: (dataSource: DataSource) => new ReturnsRepository(dataSource),
				inject: [DataSource],
			},
		],
})
export class ReturnsModule {}
