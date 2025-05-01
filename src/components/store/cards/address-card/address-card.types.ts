import { Country } from "@prisma/client";
import { UserShippingAddressType } from "@/types/shipping.types";

export interface AddressCardProps {
  address: UserShippingAddressType;
  isSelected: boolean;
  onSelect: () => void;
  countries: Country[];
}
