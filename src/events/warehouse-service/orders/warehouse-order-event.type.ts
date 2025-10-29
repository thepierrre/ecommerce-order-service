import { Warehouse_OrderAccepted } from "./order.accepted.v1";
import { Warehouse_OrderDelivered } from "./order.delivered.v1";
import { Warehouse_OrderPacked } from "./order.packed.v1";
import { Warehouse_OrderProcessingStarted } from "./order.processing-started.v1";
import { Warehouse_OrderShipped } from "./order.shipped.v1";

export type WarehouseEvent = Warehouse_OrderAccepted | Warehouse_OrderProcessingStarted | Warehouse_OrderPacked | Warehouse_OrderShipped | Warehouse_OrderDelivered;