import OrdersTable from "@/components/store/profile/orders/orders-table/orders-table";
import { getUserOrders } from "@/queries/profile.query";

export default async function ProfileOrdersPage() {
  const orders_data = await getUserOrders();
  const { orders, totalPages } = orders_data;
  return (
    <div>
      <OrdersTable orders={orders} totalPages={totalPages} />
    </div>
  );
}
