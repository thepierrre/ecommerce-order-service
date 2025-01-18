import { OrderStatus } from '../../model/enum/order-status.enum';

interface AcceptedItem {
  productId: string;
  quantity: number;
}

interface RejectedItem {
  productId: string;
  quantity: string;
  reason: string;
}

export interface OrderAcceptedResponse {
  message: 'Order received and accepted.';
  status: OrderStatus.ACCEPTED;
  orderId: string;
  processingStartTime: string;
  expectedDispatchDate: Date;
}

export interface OrderScheduledResponse {
  message: 'Order received and scheduled for processing.';
  status: OrderStatus.SCHEDULED;
  orderId: string;
  expectedProcessingStartTime: string;
  expectedDispatchDate: Date;
}

export interface OrderPartiallyAcceptedResponse {
  message: 'Order partially accepted. Some items are out of stock.';
  status: OrderStatus.PARTIALLY_ACCEPTED;
  orderId: string;
  acceptedItems: AcceptedItem[];
  rejectedItems: RejectedItem[];
  expectedDispatchDate: Date;
}

export interface OrderRejectedResponse {
  message: 'Order rejected.';
  status: OrderStatus.REJECTED;
  orderId: string;
  reason: string;
}

export interface WarehouseNotReadyResponse {
  message: 'Warehouse not ready.';
  status: OrderStatus.WAREHOUSE_NOT_READY;
  orderId: string;
  reason: string;
}

export interface WarehouseServiceUnavailableResponse {
  message: 'Warehouse service unavailable.';
  status: OrderStatus.WAREHOUSE_SERVICE_UNAVAILABLE;
  orderId: string;
  reason: string;
}
