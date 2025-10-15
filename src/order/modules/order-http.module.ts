import { Module } from '@nestjs/common';
import { OrderModule } from './order.module';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';

@Module({
  imports: [OrderModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderHttpModule {}
