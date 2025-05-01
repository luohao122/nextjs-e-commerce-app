import { Dispatch, SetStateAction } from "react";

import { Country } from "@prisma/client";
import { UserShippingAddressType } from "@/types/shipping.types";

export interface AddressDetailsProps {
  data?: UserShippingAddressType;
  countries: Country[];
  setShow: Dispatch<SetStateAction<boolean>>;
}
