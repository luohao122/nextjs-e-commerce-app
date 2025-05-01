import { columns } from "@/components/dashboard/forms/order-table/order-columns";
import DataTable from "@/components/ui/data-table";
import { getStoreOrders } from "@/queries/store.query";

export default async function SellerOrdersPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const storeUrl = (await params).storeUrl
  // Get all store coupons
  const orders = await getStoreOrders(storeUrl);

  return (
    <div>
      <DataTable
        filterValue="id"
        data={orders}
        columns={columns}
        searchPlaceholder="Search order by id ..."
      />
    </div>
  );
}
