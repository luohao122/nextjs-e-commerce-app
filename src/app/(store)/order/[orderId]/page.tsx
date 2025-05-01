import { redirect } from "next/navigation";

import OrderInfoCard from "@/components/store/cards/order/order-info-card/order-info-card";
import OrderTotalDetailsCard from "@/components/store/cards/order/order-total-details-card/order-total-details-card";
import OrderUserDetailsCard from "@/components/store/cards/order/order-user-details-card/order-user-details-card";

import Header from "@/components/store/layout/header/header";
import OrderGroupsContainer from "@/components/store/order-page/order-groups-container/order-groups-container";
import OrderHeader from "@/components/store/order-page/order-header/order-header";

import OrderPayment from "@/components/store/order-page/order-payment/order-payment";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/queries/order.query";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const orderId = (await params).orderId;
  const order = await getOrder(orderId);
  if (!order) return redirect("/");

  // Get the total count of items across all groups
  const totalItemsCount = order?.groups.reduce(
    (total, group) => total + group._count.items,
    0
  );

  // Calculate the total number of delivered items
  const deliveredItemsCount = order?.groups.reduce((total, group) => {
    if (group.status === "Delivered") {
      return total + group.items.length;
    }
    return total;
  }, 0);

  return (
    <div>
      <Header />
      <div className="p-2">
        <OrderHeader order={order} />
        <div
          className="w-full grid"
          style={{
            gridTemplateColumns:
              order.paymentStatus === "Pending" ||
              order.paymentStatus === "Failed"
                ? "400px 3fr 1fr"
                : "1fr 4fr",
          }}
        >
          {/* Col 1 -> User, Order details */}
          <div className="h-[calc(100vh-137px)] overflow-auto flex flex-col gap-y-5 scrollbar">
            <OrderUserDetailsCard details={order.shippingAddress} />
            <OrderInfoCard
              totalItemsCount={totalItemsCount}
              deliveredItemsCount={deliveredItemsCount}
              paymentDetails={order.paymentDetails}
            />
            {order.paymentStatus !== "Pending" &&
              order.paymentStatus !== "Failed" && (
                <OrderTotalDetailsCard
                  details={{
                    subTotal: order.subTotal,
                    shippingFees: order.shippingFees,
                    total: order.total,
                  }}
                />
              )}
          </div>
          {/* Col 2 -> Order Groups */}
          <div className="h-[calc(100vh-137px)] overflow-auto scrollbar ">
            <OrderGroupsContainer groups={order.groups} />
          </div>
          {/* Col 3 -> Payment Gateways*/}
          {(order.paymentStatus === "Pending" ||
            order.paymentStatus === "Failed") && (
            <div className="h-[calc(100vh-137px)] overflow-auto scrollbar border-l px-2 py-4 space-y-5 ">
              <OrderTotalDetailsCard
                details={{
                  subTotal: order.subTotal,
                  shippingFees: order.shippingFees,
                  total: order.total,
                }}
              />
              <Separator />
              <OrderPayment orderId={order.id} amount={order.total} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
