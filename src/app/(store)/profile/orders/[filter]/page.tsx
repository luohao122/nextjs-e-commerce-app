import OrdersTable from "@/components/store/profile/orders/orders-table/orders-table";
import { getUserOrders } from "@/queries/profile.query";
import { OrderTableFilter } from "@/types/order.types";

export default async function ProfileFilteredOrderPage({
  params,
}: {
  params: Promise<{ filter: string }>;
}) {
  const filter = (await params).filter
    ? ((await params).filter as OrderTableFilter)
    : "";
  const orders_data = await getUserOrders(filter);
  const { orders, totalPages } = orders_data;
  return (
    <div>
      <OrdersTable
        orders={orders}
        totalPages={totalPages}
        prev_filter={filter}
      />
    </div>
  );
}
