import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
	imports: [
		ClientsModule.register([
			{
				name: "NATS_SERVICE",
				transport: Transport.NATS,
				options: { servers: ["nats://localhost:4222"] },
			},
		]),
	],
	exports: [ClientsModule],
})
export class NatsModule {}
