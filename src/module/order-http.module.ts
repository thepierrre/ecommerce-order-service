import { Module } from '@nestjs/common';
import { OrderModule } from './order.module';
import { OrderController } from '../controller/order.controller';
import { OrderService } from '../service/order.service';

@Module({
  imports: [OrderModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderHttpModule {}
