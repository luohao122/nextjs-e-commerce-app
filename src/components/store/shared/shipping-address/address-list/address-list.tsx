import { FC, useEffect } from "react";

import { ShippingAddress } from "@prisma/client";
import ShippingAddressCard from "@/components/store/cards/address-card/address-card";
import { AddressListProps } from "@/components/store/shared/shipping-address/address-list/address-list.types";

const AddressList: FC<AddressListProps> = ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const handleAddressSelect = (address: ShippingAddress) => {
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
          onSelect={() => handleAddressSelect(address)}
        />
      ))}
    </div>
  );
};

export default AddressList;
