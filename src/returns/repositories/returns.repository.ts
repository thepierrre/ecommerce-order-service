import { Injectable } from "@nestjs/common";
import { type DataSource, Repository } from "typeorm";
import { Return } from "../models/entities/return.entity";
import type { ReturnStatus } from "../models/enums/return-status.enum";

@Injectable()
export class ReturnsRepository extends Repository<Return> {
	constructor(dataSource: DataSource) {
		super(Return, dataSource.createEntityManager());
	}

	async updateStatus(
		returnNumber: string,
		status: ReturnStatus,
	): Promise<void> {
		await this.update({ returnNumber }, { status });
	}
}
