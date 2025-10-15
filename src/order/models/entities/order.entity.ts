import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from '../types/order-item.interface';
import { ShippingAddress } from '../types/shipping-address.interface';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_WAREHOUSE_RESPONSE,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  shippingMethod: string;

  @Column()
  shippingAddress: ShippingAddress;

  @Column('json')
  items: OrderItem[];
}
