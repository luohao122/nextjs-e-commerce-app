import { getAllStores } from "@/queries/store.query";

// Data table
import DataTable from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/forms/admin-store-details-table/admin-store-columns/store-shipping-rates-columns";

export default async function AdminStoresPage() {
  const stores = await getAllStores();

  return (
    <DataTable
      filterValue="name"
      data={stores}
      searchPlaceholder="Search store name..."
      columns={columns}
    />
  );
}
