import { cookies } from "next/headers";

import Header from "@/components/store/layout/header/header";
import { Country } from "@/types/types";
import CartContainer from "@/components/store/cart-page/cart-container";

export default async function CartPage() {
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value);
  }

  return (
    <>
      <Header />
      <CartContainer userCountry={userCountry} />
    </>
  );
}
