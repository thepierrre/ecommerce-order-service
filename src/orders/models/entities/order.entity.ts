import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import type { OrderItem } from "../types/order-item.interface";
import { format } from "date-fns";

@Entity()
export class Order {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	orderNumber: string;

	@Column()
	userId: string;

	@Column()
	contactEmail: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn({ nullable: true })
	lastUpdatedAt: Date;

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

	@BeforeInsert()
	generateOrderNumber() {
		const date = format(new Date(), "yyyyMMdd-HHmmss");
		const random = Math.floor(1000 + Math.random());
		this.orderNumber = `ORD-${date}-${random}`;
	}
}
