import { Dispatch, SetStateAction } from "react";

import { Country, ShippingAddress } from "@prisma/client";
import { UserShippingAddressType } from "@/types/shipping.types";

export interface AddressListProps {
  addresses: UserShippingAddressType[];
  countries: Country[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}
