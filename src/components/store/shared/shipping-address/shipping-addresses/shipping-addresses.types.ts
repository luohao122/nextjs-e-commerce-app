import { Dispatch, SetStateAction } from "react";

import { Country, ShippingAddress } from "@prisma/client";
import { UserShippingAddressType } from "@/types/shipping.types";

export interface ShippingAddressesProps {
  countries: Country[];
  addresses: UserShippingAddressType[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}
