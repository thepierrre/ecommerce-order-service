import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { database } from "./config/database";
import { Order } from "./orders/models/entities/order.entity";
import { Return } from "./returns/models/entities/return.entity";
import { OrdersModule } from "./orders/orders.module";
import { ReturnsModule } from "./returns/returns.module";
import { NatsModule } from "./shared/nats.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "mysql",
			host: database.host,
			port: database.port,
			username: database.username,
			password: database.password,
			database: database.database,
			entities: [Order, Return],
			synchronize: true,
		}),
		HttpModule,
		OrdersModule,
		ReturnsModule,
		NatsModule,
	],
})
export class AppModule {}
