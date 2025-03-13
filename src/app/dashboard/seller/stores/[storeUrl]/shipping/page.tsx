import { redirect } from "next/navigation";

import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store.query";
import { SellerStoreShippingPageProps } from "./page.types";
import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details/store-default-shipping-details";

import { ROUTES } from "@/config/route-name";
import DataTable from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/forms/store-shipping-rates-table/store-shipping-rates-columns/store-shipping-rates-columns";

export default async function SellerStoreShippingPage({
  params,
}: SellerStoreShippingPageProps) {
  const storeUrl = (await params).storeUrl;
  const shippingDetails = await getStoreDefaultShippingDetails(storeUrl);
  const shippingRates = await getStoreShippingRates(storeUrl);
  if (!shippingDetails || !shippingRates) {
    redirect(`${ROUTES.SELLER_DASHBOARD}/stores/${storeUrl}`);
  }

  return (
    <div>
      <StoreDefaultShippingDetails data={shippingDetails} storeUrl={storeUrl} />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        searchPlaceholder="Search by country name..."
        columns={columns}
      />
    </div>
  );
}
