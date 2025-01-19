import { OrderService } from './order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseClientService } from '../client/warehouse/warehouse-client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../model/entity/order.entity';
import { Repository } from 'typeorm';
import { OrderRequest } from '../model/interface/order-request.interface';
import { OrderAcceptedResponse } from '../client/warehouse/warehouse-responses.interface';
import { OrderStatus } from '../model/enum/order-status.enum';
import { OrderItem } from '../model/interface/order-item.interface';

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

  //TODO: this tests too much right now - should only test saving to db
  it('saveOrder: returns a newly created order', async () => {
    const userId = 'a0c74a80-1a98-467c-8a9c-1db62b5c4b3e';
    const orderId = 'c3d5b0f2-93f4-44c5-8039-9c6e932a2d19';
    const productId1 = 'f4e72b13-7e54-4ea5-8ae6-5c1d362a3e9d';
    const productId2 = 'bb78ad87-3ef8-45e2-b89f-4d57f29a88cd';
    const productId3 = 'af109bda-18c3-46e4-b86e-77f9d65f9982';
    const transactionId = '7f5b2e85-b9f4-4c93-a2c9-b1e7461cf4ea';
    const createdAt = new Date(2026, 2, 20, 8, 0);
    const processingStartTime = new Date(2026, 2, 20, 8, 0);
    const expectedDispatchDate = new Date(2026, 2, 20);

    const orderItems: OrderItem[] = [
      { productId: productId1, price: 10.99, quantity: 1 },
      { productId: productId2, price: 15.5, quantity: 5 },
      { productId: productId3, price: 8.95, quantity: 10 },
    ];

    const requestData: OrderRequest = {
      userId: userId,
      shippingAddress: {
        line1: 'Test Street 10',
        city: 'Munich',
        stateOrProvince: 'Bavaria',
        zipCode: '2190100',
        country: 'Germany',
      },
      items: orderItems,
      shippingMethod: 'express',
    };

    const savedOrder: Order = {
      id: orderId,
      createdAt,
      lastUpdatedAt: null,
      userId,
      status: OrderStatus.PENDING,
      amount: 177.99,
      transactionId,
      items: [
        {
          productId: productId1,
          price: 10.99,
          quantity: 1,
        },
        {
          productId: productId2,
          price: 15.5,
          quantity: 5,
        },
        {
          productId: productId3,
          price: 8.95,
          quantity: 10,
        },
      ],
    };

    const orderResponse = {
      amount: 177.99,
      createdAt: new Date('2026-03-20T07:00:00.000Z'),
      id: 'c3d5b0f2-93f4-44c5-8039-9c6e932a2d19',
      items: [
        {
          productId: productId1,
          price: 10.99,
          quantity: 1,
        },
        {
          productId: productId2,
          price: 15.5,
          quantity: 5,
        },
        {
          productId: productId3,
          price: 8.95,
          quantity: 10,
        },
      ],
      lastUpdatedAt: null,
      status: 'PENDING',
      transactionId: '7f5b2e85-b9f4-4c93-a2c9-b1e7461cf4ea',
      userId: 'a0c74a80-1a98-467c-8a9c-1db62b5c4b3e',
    };

    jest.spyOn(orderRepository, 'save').mockResolvedValue(savedOrder);

    const warehouseResponseData: OrderAcceptedResponse = {
      message: 'Order received and accepted.',
      status: OrderStatus.ACCEPTED,
      orderId,
      processingStartTime,
      expectedDispatchDate,
    };

    jest
      .spyOn(warehouseClientService, 'sendOrderToWarehouse')
      .mockResolvedValue(warehouseResponseData);

    const response = await orderService.saveOrder(requestData);
    expect(response).toEqual(orderResponse);
  });

  it('saveOrder: returns a database error', () => {});

  it('updateOrder: updates the order successfully', async () => {});

  it('updateOrder: returns a not-found error if the order does not exist', async () => {});

  it('sendOrderToWarehouse: returns an order accepted response', () => {});

  it('sendOrderToWarehouse: returns an error when the warehouse is unreachable', () => {});
});
