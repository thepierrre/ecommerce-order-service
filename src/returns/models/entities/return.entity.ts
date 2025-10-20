import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import type { OrderItem } from "../../../orders/models/types/order-item.interface";
import { OrderStatus } from "../../../orders/models/enums/order-status.enum";
import { ReturnStatus } from "../enums/return-status.enum";
import { ReturnReason } from "../enums/return-reason.enum";

@Entity()
export class Return {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	order: string;

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
	items: OrderItem[];
}
