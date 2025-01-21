import { OrderRequest } from '../../../src/model/interface/order-request.interface';
import { Order } from '../../../src/model/entity/order.entity';
import { OrderStatus } from '../../../src/model/enum/order-status.enum';
import { OrderAcceptedResponse } from '../../../src/client/warehouse/warehouse-responses.interface';

const userId1 = 'a0c74a80-1a98-467c-8a9c-1db62b5c4b3e';
const userId2 = 'af48dc79-244e-49b5-b900-958cdf13de9b';

const orderId1 = 'c3d5b0f2-93f4-44c5-8039-9c6e932a2d19';
const orderId2 = 'bd07b3c0-ca9f-4474-88b8-86d4a8b6099d';

const productId1 = 'f4e72b13-7e54-4ea5-8ae6-5c1d362a3e9d';
const productId2 = 'bb78ad87-3ef8-45e2-b89f-4d57f29a88cd';
const productId3 = 'af109bda-18c3-46e4-b86e-77f9d65f9982';
const productId4 = '5c692b17-4542-4508-966a-e1cfc5791387';

const createdAt1 = new Date(2026, 2, 20, 8, 0);
const createdAt2 = new Date(2026, 5, 10, 0, 0);

const processingStartTime1 = new Date(2026, 2, 20, 8, 0);
const expectedDispatchDate1 = new Date(2026, 2, 20);

export const orderRequestBody1: OrderRequest = {
  userId: userId1,
  shippingAddress: {
    line1: 'Banana Peel St. 10',
    city: 'Llama Town',
    stateOrProvince: 'Bananatopia',
    zipCode: '2190100',
    country: 'Giggle Federation',
  },
  items: [
    { productId: productId1, price: 10.99, quantity: 1 },
    { productId: productId2, price: 15.5, quantity: 5 },
    { productId: productId3, price: 8.95, quantity: 10 },
  ],
  shippingMethod: 'express',
  amount: 177.99,
};

export const orderRequestBody2: OrderRequest = {
  userId: userId2,
  shippingAddress: {
    line1: 'Spaghetti Lane 225',
    city: 'Nonsense Valley',
    stateOrProvince: 'Weird Hills',
    zipCode: '5433300',
    country: 'Republic of Confusion',
  },
  items: [{ productId: productId4, price: 50.99, quantity: 1 }],
  shippingMethod: 'traditional',
  amount: 50.99,
};

export const order1: Order = {
  id: orderId1,
  createdAt: createdAt1,
  lastUpdatedAt: null,
  userId: userId1,
  status: OrderStatus.PENDING,
  amount: 177.99,
  shippingMethod: 'express',
  shippingAddress: {
    line1: 'Banana Peel St. 10',
    city: 'Llama Town',
    stateOrProvince: 'Bananatopia',
    zipCode: '2190100',
    country: 'Giggle Federation',
  },
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

export const order2: Order = {
  id: orderId2,
  createdAt: createdAt2,
  lastUpdatedAt: null,
  userId: userId2,
  status: OrderStatus.PENDING,
  amount: 50.99,
  shippingMethod: 'traditional',
  shippingAddress: {
    line1: 'Spaghetti Lane 225',
    city: 'Nonsense Valley',
    stateOrProvince: 'Weird Hills',
    zipCode: '5433300',
    country: 'Republic of Confusion',
  },
  items: [{ productId: productId4, price: 50.99, quantity: 1 }],
};

export const updatedOrder: Order = { ...order2, status: OrderStatus.SHIPPED };

export const orderAcceptedResponse: OrderAcceptedResponse = {
  message: 'Order received and accepted.',
  status: OrderStatus.ACCEPTED,
  orderId: orderId1,
  processingStartTime: processingStartTime1,
  expectedDispatchDate: expectedDispatchDate1,
};
