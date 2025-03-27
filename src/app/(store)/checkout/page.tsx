import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getUserCart, getUserShippingAddresses } from "@/queries/user.query";
import { getCountryList } from "@/queries/country.query";
import { cookies } from "next/headers";
import { Country } from "@/types/types";
import Header from "@/components/store/layout/header/header";

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/cart");
  }

  const cart = await getUserCart(user.id);
  if (!cart) {
    redirect("/cart");
  }

  const addresses = await getUserShippingAddresses();
  const countries = await getCountryList();

  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  // Set default country if cookie is missing
  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  // If cookie exists, update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <>
      <Header />
      <div className="bg-[#f4f4f4] min-h-[calc(100vh-65px)]">
        <div className="max-w-container mx-auto py-5 px-2">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
            userCountry={userCountry}
          />
        </div>
      </div>
    </>
  );
}
