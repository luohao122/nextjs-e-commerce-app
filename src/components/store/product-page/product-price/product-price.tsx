"use client";

import { FC, useEffect } from "react";

import { cn } from "@/lib/utils";
import { CartProductType } from "@/types/cart.types";

interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface ProductPriceProps {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
  handleChange: (property: keyof CartProductType, value: unknown) => void;
}

const ProductPrice: FC<ProductPriceProps> = ({
  sizeId,
  sizes,
  isCard,
  handleChange,
}) => {
  if (!sizes || !sizes.length) {
    return;
  }

  if (!sizeId) {
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - size.discount / 100)
    );

    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    const priceDisplay =
      minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - ${maxPrice}`;
    let discount = 0;
    if (minPrice === maxPrice) {
      const checkDiscount = sizes.find((s) => s.discount > 0);

      if (checkDiscount) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        discount = checkDiscount.discount;
      }
    }

    return (
      <div>
        <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-orange-background text-xs leading-4 mt-1">
            <span>Note : Select a size to see the exact price</span>
          </div>
        )}
        {!sizeId && !isCard && (
          <p className="mt-2 text-xs">{totalQuantity} pieces</p>
        )}
      </div>
    );
  }

  const selectedSize = sizes.find((size) => size.id === sizeId);
  if (!selectedSize) {
    return <></>;
  }

  const discountedPrice =
    selectedSize.price * (1 - selectedSize.discount / 100);

  // Update product to be added to cart with price and stock quantity
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    handleChange("price", discountedPrice);
    handleChange("stock", selectedSize.quantity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeId]);

  return (
    <div>
      <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
        <span className="inline-block text-4xl">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 mr-2 line-through">
          ${selectedSize.price.toFixed(2)}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-orange-secondary text-xl leading-6">
          {selectedSize.discount}% off
        </span>
      )}
      <p className="mt-2 text-xs">
        {selectedSize.quantity > 0 ? (
          `${selectedSize.quantity} items`
        ) : (
          <span className="text-red-500">Out of stock</span>
        )}
      </p>
    </div>
  );
};

export default ProductPrice;
