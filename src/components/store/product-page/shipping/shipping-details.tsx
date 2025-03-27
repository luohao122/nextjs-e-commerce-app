import { FC, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Truck } from "lucide-react";

import { getShippingDatesRange } from "@/lib/utils";
import ProductShippingFee from "@/components/store/product-page/shipping/shipping-fee";

interface ShippingDetailsProps {
  shippingDetails: {
    shippingFeeMethod: string;
    shippingService: string;
    shippingFee: number;
    extraShippingFee: number;
    deliveryTimeMin: number;
    deliveryTimeMax: number;
    returnPolicy: string;
    countryCode: string;
    countryName: string;
    city: string;
    isFreeShipping: boolean;
  };
  quantity: number;
  weight: number;
}

const ShippingDetails: FC<ShippingDetailsProps> = ({
  shippingDetails,
  quantity,
  weight,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const {
    countryName,
    deliveryTimeMax,
    deliveryTimeMin,
    shippingFee,
    extraShippingFee,
    shippingFeeMethod,
    shippingService,
  } = shippingDetails;
  const [shippingTotal, setShippingTotal] = useState<number>(0);
  const { minDate, maxDate } = getShippingDatesRange(
    deliveryTimeMin,
    deliveryTimeMax
  );

  useEffect(() => {
    switch (shippingFeeMethod) {
      case "ITEM":
        const qty = quantity - 1;
        setShippingTotal(shippingFee + qty * extraShippingFee);
        break;
      case "WEIGHT":
        setShippingTotal(shippingFee * quantity);
        break;
      case "FIXED":
        setShippingTotal(shippingFee);
        break;
      default:
        break;
    }
  }, [shippingFeeMethod, quantity, shippingFee, extraShippingFee, countryName]);

  return (
    <div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <Truck className="w-4" />
            {shippingDetails.isFreeShipping ? (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Free Shipping to <span>{countryName}</span>
                </span>
              </span>
            ) : (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Shipping to&nbsp;<span>{countryName}</span>
                </span>
                <span>&nbsp;for ${shippingTotal}</span>
              </span>
            )}
          </div>
          <ChevronRight className="w-3" />
        </div>
        <span className="flex items-center text-sm ml-5">
          Service:&nbsp;<strong className="text-sm">{shippingService}</strong>
        </span>
        <span className="flex items-center text-sm ml-5">
          Delivery:&nbsp;
          <strong className="text-sm">
            {minDate.slice(4)} - {maxDate.slice(4)}
          </strong>
        </span>
        {!shippingDetails.isFreeShipping && toggle && (
          <ProductShippingFee
            fee={shippingFee}
            extraFee={extraShippingFee}
            method={shippingFeeMethod}
            quantity={quantity}
            weight={weight}
          />
        )}
        <div
          className="max-w-[calc(100%-2rem)] ml-4 flex items-center bg-gray-100 hover:bg-gray-200 h-5 cursor-pointer"
          onClick={() => setToggle((prev) => !prev)}
        >
          <div className="w-full flex items-center justify-between gap-x-1 px-2">
            <span className="text-xs">
              {toggle ? "Hide" : "Shipping Fee Breakdown"}
            </span>
            {toggle ? (
              <ChevronUp className="w-4" />
            ) : (
              <ChevronDown className="w-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
