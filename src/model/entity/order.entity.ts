import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderItem } from '../interface/order-item.interface';
import { ShippingAddress } from '../interface/shipping-address.interface';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  lastUpdatedAt: Date;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
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
