import { OrderGroupWithItemsType } from "@/types/order.types";

export interface OrderGroupTableProps {
  group: OrderGroupWithItemsType;
  deliveryInfo: {
    shippingService: string;
    deliveryMinDate: string;
    deliveryMaxDate: string;
  };
}
