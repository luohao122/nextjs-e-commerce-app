"use client";

import { useEffect, useState } from "react";

import { useCartStore } from "@/cart-store/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import { Country } from "@/types/types";

import { CartProductType } from "@/types/cart.types";
import { updateCartWithLatest } from "@/queries/user.query";
import CartHeader from "@/components/store/cart-page/cart-header";

import CountryNote from "@/components/store/shared/country-note/country-note";
import CartProduct from "@/components/store/cards/cart-product/cart-product";
import CartSummary from "@/components/store/cart-page/cart-summary";

import FastDelivery from "@/components/store/cards/fast-delivery/fast-delivery";
import SecurityPrivacyCard from "@/components/store/product-page/return-privacy-security-card/security-privacy-card";
import EmptyCart from "@/components/store/cart-page/empty-cart";

export default function CartContainer({
  userCountry,
}: {
  userCountry: Country;
}) {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  useEffect(() => {
    if (cartItems !== undefined) {
      setIsCartLoaded(true);
    }
  }, [cartItems]);

  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (cartItems?.length) {
        setLoading(true);
        try {
          const updatedCart = await updateCartWithLatest(cartItems);
          setCart(updatedCart);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Failed to sync cart", error);
        }
      }
    };
    loadAndSyncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartLoaded, userCountry]);

  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-[#f5f5f5] min-h-[calc(100vh-65px)]">
              <div className="max-w-[1200px] mx-auto py-6 flex">
                <div className="min-w-0 flex-1">
                  {/* Cart header */}
                  <CartHeader
                    cartItems={cartItems}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                  <div className="my-2">
                    <CountryNote country={userCountry.name} />
                  </div>
                  <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                    {/* Cart items */}
                    {cartItems.map((product) => (
                      <CartProduct
                        key={product.productId}
                        product={product}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setTotalShipping={setTotalShipping}
                        userCountry={userCountry}
                      />
                    ))}
                  </div>
                </div>
                {/* Cart side */}
                <div className="sticky top-4 ml-5 w-[380px] max-h-max">
                  {/* Cart summary */}
                  <CartSummary
                    cartItems={cartItems}
                    shippingFees={totalShipping}
                  />
                  <div className="mt-2 p-4 bg-white px-6">
                    <FastDelivery />
                  </div>
                  <div className="mt-2 p-4 bg-white px-6">
                    <SecurityPrivacyCard />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
