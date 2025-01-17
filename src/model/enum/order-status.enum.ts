export enum OrderStatus {
  PENDING = 'pending',
  ON_HOLD = 'on_hold',
  PROCESSING = 'processing',
  READY_FOR_SHIPMENT = 'ready_for_shipment',
  SHIPPED = 'shipped',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  RETURN_INITIATED = 'return_initiated',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}
