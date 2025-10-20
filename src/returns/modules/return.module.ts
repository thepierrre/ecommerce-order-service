import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Return } from "../models/entities/return.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Return])],
	exports: [TypeOrmModule],
})
export class ReturnModule {}
