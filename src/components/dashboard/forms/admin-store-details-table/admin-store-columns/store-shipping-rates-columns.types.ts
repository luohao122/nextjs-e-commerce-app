import { ShippingRate } from "@prisma/client";

export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};

export interface CellActionsProps {
  rowData: CountryWithShippingRatesType;
}
