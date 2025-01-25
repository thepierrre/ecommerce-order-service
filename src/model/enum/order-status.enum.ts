export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_WAREHOUSE_RESPONSE = 'PENDING_WAREHOUSE_RESPONSE',
  ACCEPTED = 'ACCEPTED',
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED',
  SCHEDULED = 'SCHEDULED',
  REJECTED = 'REJECTED',
  WAREHOUSE_NOT_READY = 'WAREHOUSE_NOT_READY',
  WAREHOUSE_SERVICE_UNAVAILABLE = 'WAREHOUSE_SERVICE_UNAVAILABLE',
  PROCESSING = 'PROCESSING',
  READY_FOR_SHIPMENT = 'READY_FOR_SHIPMENT',
  SHIPPED = 'SHIPPED',
  IN_DELIVERY = 'IN_DELIVERY',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURN_INITIATED = 'RETURN_INITIATED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
}
