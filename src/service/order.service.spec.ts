import { OrderService } from './order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseClientService } from '../client/warehouse/warehouse-client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../model/entity/order.entity';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let orderService: OrderService;
  let warehouseClientService: WarehouseClientService;
  let orderRepository: Repository<Order>;

  const mockWareHouseClientService = {
    sendOrderToWarehouse: jest.fn(),
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: WarehouseClientService,
          useValue: mockWareHouseClientService,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    warehouseClientService = module.get<WarehouseClientService>(
      WarehouseClientService,
    );
    orderRepository = module.get<Repository<Order>>(
      getRepositoryToken(Order),
    ) as jest.Mocked<Repository<Order>>;
  });

  it('is defined', () => {
    expect(orderService).toBeDefined();
  });
});
