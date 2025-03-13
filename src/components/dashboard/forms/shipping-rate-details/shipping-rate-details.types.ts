import { CountryWithShippingRatesType } from "@/components/dashboard/forms/store-shipping-rates-table/store-shipping-rates-columns/store-shipping-rates-columns.types";

export interface ShippingRateDetailsProps {
  data?: CountryWithShippingRatesType;
  storeUrl: string;
}
