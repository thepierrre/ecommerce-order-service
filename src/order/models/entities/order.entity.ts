import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItem } from "../types/order-item.interface";

@Entity()
export class Order {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	isPaid: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date;

	@Column({
		type: "enum",
		enum: OrderStatus,
		default: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
	})
	status: OrderStatus;

	@Column("decimal", { precision: 10, scale: 2 })
	amount: number;

	@Column()
	shippingMethod: string;

	@Column()
	shippingAddress: string;

	@Column("json")
	items: OrderItem[];
}
