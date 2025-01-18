interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  stateOrProvince: string;
  zipCode: string;
  country: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  shippingMethod: string;
}
