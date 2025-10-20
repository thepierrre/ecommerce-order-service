import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { database } from "./config/database";
import { HttpModule } from "@nestjs/axios";
import { Order } from "./orders/models/entities/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Return } from "./returns/models/entities/return.entity";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "NATS_SERVICE",
				transport: Transport.NATS,
				options: {
					servers: ["nats://localhost:4222"],
				},
			},
		]),
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
