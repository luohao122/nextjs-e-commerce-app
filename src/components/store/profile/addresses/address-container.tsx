"use client";

import { FC, useState } from "react";

import { AddressContainerProps } from "@/components/store/profile/addresses/address-container.types";
import UserShippingAddresses from "@/components/store/shared/shipping-address/shipping-addresses/shipping-addresses";
import { ShippingAddress } from "@prisma/client";

const AddressContainer: FC<AddressContainerProps> = ({
  addresses,
  countries,
}) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  return (
    <div className="w-full">
      <UserShippingAddresses
        addresses={addresses}
        countries={countries}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </div>
  );
};

export default AddressContainer;
