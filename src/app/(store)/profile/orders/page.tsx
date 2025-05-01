import OrdersTable from "@/components/store/profile/orders/orders-table/orders-table";
import { getUserOrders } from "@/queries/profile.query";

export default async function ProfileOrdersPage() {
  const ordersData = await getUserOrders();
  const { orders, totalPages } = ordersData;

  return (
    <div>
      <OrdersTable orders={orders} totalPages={totalPages} />
    </div>
  );
}
