import DataTable from "@/components/ui/data-table";
import { SellerProductsPageProps } from "./page.types";
import { getAllStoreProducts } from "@/queries/product.query";

import { columns } from "@/components/dashboard/forms/product-table/product-columns/product-columns";
import { ROUTES } from "@/config/route-name";

export default async function SellerProductsPage({
  params,
}: SellerProductsPageProps) {
  const storeUrl = (await params).storeUrl;
  const products = await getAllStoreProducts(storeUrl);

  return (
    <DataTable
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Search product name..."
      newTabLink={`${ROUTES.SELLER_DASHBOARD}/stores/${storeUrl}/products/new`}
    />
  );
}
