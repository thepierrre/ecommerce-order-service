import { OrderService } from './order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseClientService } from '../client/warehouse/warehouse-client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../model/entity/order.entity';
import { Repository } from 'typeorm';
import { OrderRequest } from '../model/interface/order-request.interface';
import { OrderStatus } from '../model/enum/order-status.enum';
import {
  order1,
  order2,
  orderAcceptedResponse,
  orderRequestBody1,
  updatedOrder,
} from '../../test/util/service/order-service.mocks';
import { Logger, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let warehouseClientService: WarehouseClientService;
  let orderRepository: Repository<Order>;

  const mockWareHouseClientService = {
    sendNewOrderToWarehouse: jest.fn(),
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

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('is defined', () => {
    expect(orderService).toBeDefined();
  });

  it('createOrder: returns a newly created order', async () => {
    jest.spyOn(orderRepository, 'create').mockImplementation(
      (orderRequest: OrderRequest) =>
        ({
          ...orderRequest,
          id: order1.id,
          createdAt: order1.createdAt,
          lastUpdatedAt: null,
          status: OrderStatus.PENDING,
        }) as Order,
    );

    jest
      .spyOn(orderRepository, 'save')
      .mockImplementation(async (order: Order) => {
        return order;
      });

    const response = await orderService.createOrder(orderRequestBody1);

    expect(orderRepository.create).toHaveBeenCalledWith({
      ...orderRequestBody1,
      status: OrderStatus.PENDING,
    });

    expect(orderRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: order1.id,
        createdAt: order1.createdAt,
      }),
    );

    expect(response).toEqual(order1);
  });

  it('createOrder: returns a database error', async () => {
    jest.spyOn(orderRepository, 'create').mockImplementation(() => {
      throw new Error('Cannot connect to the database.');
    });

    await expect(orderService.createOrder(orderRequestBody1)).rejects.toThrow(
      'Cannot connect to the database.',
    );
    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'Failed to save the order: Cannot connect to the database.',
    );
  });

  it('updateOrder: updates the order successfully', async () => {
    jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(order2);
    jest.spyOn(orderRepository, 'merge').mockReturnValue(updatedOrder);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(updatedOrder);

    await orderService.updateOrder(order2.id, OrderStatus.SHIPPED);

    expect(orderRepository.findOneBy).toHaveBeenCalledWith({ id: order2.id });
    expect(orderRepository.merge).toHaveBeenCalledWith(order2, {
      status: OrderStatus.SHIPPED,
    });
    expect(orderRepository.save).toHaveBeenCalledWith(updatedOrder);
  });

  it('updateOrder: returns a not-found error if the order does not exist', async () => {
    jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(null);

    expect(orderRepository.findOneBy).toHaveBeenCalledWith({ id: order2.id });
    await expect(
      orderService.updateOrder(order2.id, OrderStatus.ACCEPTED),
    ).rejects.toThrow(
      new NotFoundException(`Order with the id ${order2.id} not found.`),
    );
    expect(Logger.prototype.error).toHaveBeenCalledWith(
      `Order with the id ${order2.id} not found.`,
    );
  });

  it('sendNewOrderToWarehouse: returns an order accepted response', async () => {
    jest
      .spyOn(warehouseClientService, 'sendNewOrderToWarehouse')
      .mockResolvedValue(orderAcceptedResponse);

    jest.spyOn(orderService, 'updateOrder').mockResolvedValue();

    const response = await orderService.sendNewOrderToWarehouse(order1);

    expect(warehouseClientService.sendNewOrderToWarehouse).toHaveBeenCalledWith(
      order1,
    );
    expect(response).toEqual(orderAcceptedResponse);
  });

  it('sendNewOrderToWarehouse: returns an error when the warehouse is unreachable', async () => {
    jest
      .spyOn(warehouseClientService, 'sendNewOrderToWarehouse')
      .mockRejectedValue(
        new Error(
          'ServiceUnavailableException: Unable to reach the warehouse service.',
        ),
      );

    await expect(orderService.sendNewOrderToWarehouse(order1)).rejects.toThrow(
      'ServiceUnavailableException: Unable to reach the warehouse service.',
    );

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'Failed to send the order to the warehouse: ServiceUnavailableException: ' +
        'Unable to reach the warehouse service.',
    );
  });
});
