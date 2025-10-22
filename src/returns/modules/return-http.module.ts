import { Module } from "@nestjs/common";
import { ReturnsController } from "../controllers/returns.controller";
import { ReturnsService } from "../services/returns.service";
import { ReturnModule } from "./return.module";

@Module({
	imports: [ReturnModule],
	providers: [ReturnsService],
	controllers: [ReturnsController],
})
export class ReturnHttpModule {}
