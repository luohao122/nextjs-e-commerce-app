import { redirect } from "next/navigation";

import StoreDetails from "@/components/dashboard/forms/store-details/store-details";
import { CLOUDINARY_PRESET } from "@/config/constants";
import { ROUTES } from "@/config/route-name";

import { getStoreByUrl } from "@/queries/store.query";
import { SellerStoreSettingsPageProps } from "./page.types";

export default async function SellerStoreSettingsPage({
  params,
}: SellerStoreSettingsPageProps) {
  const storeUrl = (await params).storeUrl;
  const store = await getStoreByUrl(storeUrl);
  if (!store) {
    redirect(ROUTES.SELLER_STORES_LIST);
  }

  return (
    <div>
      <StoreDetails data={store} cloudinaryKey={CLOUDINARY_PRESET} />
    </div>
  );
}
