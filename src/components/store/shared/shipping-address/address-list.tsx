import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Country, ShippingAddress } from "@prisma/client";

import { UserShippingAddressType } from "@/types/shipping.types";
import ShippingAddressCard from "@/components/store/cards/address-card/address-card";

interface Props {
  addresses: UserShippingAddressType[];
  countries: Country[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const AddressList: FC<Props> = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}) => {
  useEffect(() => {
    // Find the default address if it exists and set it as selected
    const defaultAddress = addresses.find((address) => address.default);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, setSelectedAddress]);

  const haneldeAddressSelect = (address: ShippingAddress) => {
    setSelectedAddress(address);
  };

  return (
    <div className="space-y-5 max-h-80 overflow-y-auto">
      {addresses.map((address) => (
        <ShippingAddressCard
          key={address.id}
          address={address}
          countries={countries}
          isSelected={selectedAddress?.id === address.id}
          onSelect={() => haneldeAddressSelect(address)}
        />
      ))}
    </div>
  );
};

export default AddressList;
