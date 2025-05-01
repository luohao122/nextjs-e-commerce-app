"use client";

import { FC, useEffect, useState } from "react";

import { Country, ShippingAddress } from "@prisma/client";
import UserShippingAddresses from "@/components/store/shared/shipping-address/shipping-addresses/shipping-addresses";
import CheckoutProductCard from "@/components/store/cards/checkout-product/checkout-product";

import PlaceOrderCard from "@/components/store/cards/place-order/place-order";
import { Country as CountryType } from "@/types/types";
import CountryNote from "@/components/store/shared/country-note/country-note";

import { updateCheckoutProductstWithLatest } from "@/queries/user.query";
import { UserShippingAddressType } from "@/types/shipping.types";
import { CartWithCartItemsType } from "@/types/cart.types";

interface Props {
  cart: CartWithCartItemsType;
  countries: Country[];
  addresses: UserShippingAddressType[];
  userCountry: CountryType;
}

const CheckoutContainer: FC<Props> = ({
  cart,
  countries,
  addresses,
  userCountry,
}) => {
  const [cartData, setCartData] = useState<CartWithCartItemsType>(cart);

  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  const activeCountry = addresses.find(
    (add) => add.countryId === selectedAddress?.countryId
  )?.country;

  const { cartItems } = cart;

  useEffect(() => {
    const hydrateCheckoutCart = async () => {
      const updatedCart = await updateCheckoutProductstWithLatest(
        cartItems,
        activeCountry
      );
      setCartData(updatedCart);
    };

    if (cartItems.length > 0) {
      hydrateCheckoutCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCountry]);

  return (
    <div className="flex">
      <div className="flex-1 my-3">
        <UserShippingAddresses
          addresses={addresses}
          countries={countries}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="my-2">
          <CountryNote
            country={activeCountry ? activeCountry.name : userCountry.name}
          />
        </div>
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cartData.cartItems.map((product) => (
              <CheckoutProductCard
                key={product.variantId}
                product={product}
                isDiscounted={cartData.coupon?.storeId === product.storeId}
              />
            ))}
          </div>
        </div>
      </div>
      <PlaceOrderCard
        cartData={cartData}
        setCartData={setCartData}
        shippingAddress={selectedAddress}
      />
    </div>
  );
};

export default CheckoutContainer;
