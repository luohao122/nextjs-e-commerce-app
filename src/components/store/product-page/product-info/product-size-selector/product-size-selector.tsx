"use client";

import { FC, useEffect } from "react";
import { Size } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CartProductType } from "@/types/cart.types";

interface ProductSizeSelectorProps {
  sizes: Size[];
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: unknown) => void;
}

const ProductSizeSelector: FC<ProductSizeSelectorProps> = ({
  sizeId,
  sizes,
  handleChange,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleCartProductToBeAddedChange = (size: Size) => {
    handleChange("sizeId", size.id);
    handleChange("size", size.size);
  };

  useEffect(() => {
    if (sizeId) {
      const searchSize = sizes.find((s) => s.id === sizeId);
      if (searchSize) {
        handleCartProductToBeAddedChange(searchSize);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSize = (size: Size) => {
    params.set("size", size.id);
    handleCartProductToBeAddedChange(size);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.size}
          className="border rounded-full px-5 py-1 cursor-pointer hover:border-black"
          style={{ borderColor: size.id === sizeId ? "#000" : "" }}
          onClick={() => handleSelectSize(size)}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default ProductSizeSelector;
