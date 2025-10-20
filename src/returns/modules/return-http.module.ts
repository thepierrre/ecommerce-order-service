import { Module } from "@nestjs/common";
import { ReturnController } from "../controllers/return.controller";
import { ReturnService } from "../services/return.service";
import { ReturnModule } from "./return.module";

@Module({
	imports: [ReturnModule],
	providers: [ReturnService],
	controllers: [ReturnController],
})
export class ReturnHttpModule {}
