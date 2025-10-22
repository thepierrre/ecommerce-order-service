import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ReturnReason } from "../enums/return-reason.enum";
import { ReturnStatus } from "../enums/return-status.enum";
import type { ReturnItem } from "../schemas/return-item.schema";

@Entity()
export class Return {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	orderId: string;

	@Column({ unique: true })
	returnNumber: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn({ nullable: true })
	lastUpdatedAt: Date;

	@Column()
	closedAt: Date;

	@Column({
		type: "enum",
		enum: ReturnStatus,
		default: ReturnStatus.OPEN,
	})
	status: ReturnStatus;

	@Column({
		type: "enum",
		enum: ReturnReason,
	})
	reason: ReturnReason;

	@Column("json")
	items: ReturnItem[];
}
