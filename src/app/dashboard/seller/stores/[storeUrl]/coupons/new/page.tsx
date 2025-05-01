import CouponDetails from "@/components/dashboard/forms/coupon-details/coupon-details";

export default async function SellerNewCouponPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const storeUrl = (await params).storeUrl;

  return (
    <div className="w-full">
      <CouponDetails storeUrl={storeUrl} />
    </div>
  );
}
