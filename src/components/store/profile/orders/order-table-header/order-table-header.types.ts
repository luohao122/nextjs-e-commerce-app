import { Dispatch, SetStateAction } from "react";

import { OrderTableDateFilter, OrderTableFilter } from "@/types/order.types";

export interface OrderTableHeaderProps {
  filter: OrderTableFilter;
  setFilter: Dispatch<SetStateAction<OrderTableFilter>>;
  period: OrderTableDateFilter;
  setPeriod: Dispatch<SetStateAction<OrderTableDateFilter>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}
