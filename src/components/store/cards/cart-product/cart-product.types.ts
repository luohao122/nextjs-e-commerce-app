import { Dispatch, SetStateAction } from "react";

import { CartProductType } from "@/types/cart.types";
import { Country } from "@/types/types";

export interface CartProductProps {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
  setTotalShipping: Dispatch<SetStateAction<number>>;
  userCountry: Country;
}
