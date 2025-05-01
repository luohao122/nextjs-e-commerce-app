import { OrderStatus } from "@/types/order.types";

export interface OrderStatusSelectProps {
  storeId: string;
  groupId: string;
  status: OrderStatus;
}
