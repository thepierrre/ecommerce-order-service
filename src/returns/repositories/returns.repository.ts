import { Injectable } from "@nestjs/common";
import { type DataSource, Repository } from "typeorm";
import { Return } from "../models/entities/return.entity";
import type { ReturnStatus } from "../models/enums/return-status.enum";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class ReturnsRepository extends Repository<Return> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super(Return, dataSource.createEntityManager());
	}

	async updateStatus(
		returnNumber: string,
		status: ReturnStatus,
	): Promise<void> {
		await this.update({ returnNumber }, { status });
	}
}
