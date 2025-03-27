import { Country } from "@prisma/client";

import { UserShippingAddressType } from "@/types/shipping.types";

export interface AddressContainerProps {
  addresses: UserShippingAddressType[];
  countries: Country[];
}
