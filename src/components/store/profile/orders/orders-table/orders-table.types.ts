import { OrderTableFilter, UserOrderType } from "@/types/order.types";

export interface OrdersTableProps {
  orders: UserOrderType[];
  totalPages: number;
  prev_filter?: OrderTableFilter;
}
