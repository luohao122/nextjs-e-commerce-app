import { getShippingDatesRange } from "@/lib/utils";
import OrderGroupTable from "@/components/store/order-page/order-group-table/order-group-table";
import { OrderGroupsContainerProps } from "@/components/store/order-page/order-groups-container/order-groups-container.types";

export default function OrderGroupsContainer({
  groups,
}: OrderGroupsContainerProps) {
  const deliveryDetails = groups.map((group) => {
    const { minDate, maxDate } = getShippingDatesRange(
      group.shippingDeliveryMin,
      group.shippingDeliveryMax,
      group.createdAt
    );
    return {
      shippingService: group.shippingService,
      deliveryMinDate: minDate,
      deliveryMaxDate: maxDate,
    };
  });

  return (
    <div>
      <section className="p-2 relative">
        <div className="w-full space-y-4">
          {groups.map((group, index) => {
            const deliveryInfo = deliveryDetails[index];
            return (
              <OrderGroupTable
                key={group.id}
                group={group}
                deliveryInfo={deliveryInfo}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
