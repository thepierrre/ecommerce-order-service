import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.NATS,
		options: {
			servers: ["nats://localhost:4222"],
		},
	});

	await app.startAllMicroservices();
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
