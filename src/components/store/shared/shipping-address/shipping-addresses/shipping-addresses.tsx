import { FC, useState } from "react";
import { Plus } from "lucide-react";

import Modal from "@/components/store/shared/modal/modal";
import AddressDetails from "@/components/store/shared/shipping-address/address-details/address-details";
import AddressList from "@/components/store/shared/shipping-address/address-list/address-list";

import { ShippingAddressesProps } from "@/components/store/shared/shipping-address/shipping-addresses/shipping-addresses.types";

const UserShippingAddresses: FC<ShippingAddressesProps> = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && (
          <AddressList
            addresses={addresses}
            countries={countries}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
        <div
          className="mt-4 ml-8 text-orange-background cursor-pointer"
          onClick={() => setShow(true)}
        >
          <Plus className="inline-block mr-1 w-3" />
          <span className="text-sm">Add new address</span>
        </div>
        {/* Modal */}
        <Modal title="Add new Address" show={show} setShow={setShow}>
          <AddressDetails countries={countries} setShow={setShow} />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
