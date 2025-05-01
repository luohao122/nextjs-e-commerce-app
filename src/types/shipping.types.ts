import {
  Country,
  FreeShipping,
  FreeShippingCountry,
  Prisma,
  ShippingAddress,
  User,
} from "@prisma/client";

import { getShippingDetails } from "@/queries/product.query";

export type ProductShippingDetailsType = Prisma.PromiseReturnType<
  typeof getShippingDetails
>;

export type FreeShippingWithCountriesType = FreeShipping & {
  eligibleCountries: FreeShippingCountry[];
};

export type UserShippingAddressType = ShippingAddress & {
  country: Country;
  user: User;
};
