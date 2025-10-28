import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.NATS,
		options: {
			servers: ["nats://localhost:4222"],
		},
	});

	const config = new DocumentBuilder()
		.setTitle("Order Service API")
		.setDescription(
			"Backend microservice responsible for order lifecycle management",
		)
		.setVersion("1.0")
		.addTag("orders")
		.addTag("returns")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	app.use(
		"docs",
		apiReference({
			content: document,
		}),
	);

	await app.startAllMicroservices();
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
