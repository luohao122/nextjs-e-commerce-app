import { Plus } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import { getStoreCoupons } from "@/queries/coupon.query";
import CouponDetails from "@/components/dashboard/forms/coupon-details/coupon-details";

import { columns } from "@/components/dashboard/forms/coupon-table/coupon-columns";

export default async function SellerCouponsPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const storeUrl = (await params).storeUrl;
  // Get all store coupons
  const coupons = await getStoreCoupons(storeUrl);

  return (
    <div>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create coupon
          </>
        }
        modalChildren={<CouponDetails storeUrl={storeUrl} />}
        newTabLink={`/dashboard/seller/stores/${storeUrl}/coupons/new`}
        filterValue="code"
        data={coupons}
        columns={columns}
        searchPlaceholder="Search coupon ..."
      />
    </div>
  );
}
