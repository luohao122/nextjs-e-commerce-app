import Link from "next/link";
import { cookies } from "next/headers";

import UserMenu from "@/components/store/layout/header/user-menu/user-menu";
import Cart from "@/components/store/layout/header/cart/cart";
import DownloadApp from "@/components/store/layout/header/download-app/download-app";

import SearchInput from "@/components/store/layout/header/search-input/search-input";
import { Country } from "@/types/types";
import CountryLanguageCurrencySelector from "@/components/store/layout/header/country-language-currency-selector/country-language-currency-selector";

export default async function Header() {
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United States",
    code: "US",
    city: "",
    region: "",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <div className="bg-gradient-to-r from-cyan-950 to-cyan-950">
      <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">MarketHub</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
            </div>
          </div>
          <SearchInput />
        </div>
        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          <CountryLanguageCurrencySelector userCountry={userCountry} />
          <UserMenu />
          <Cart />
        </div>
      </div>
    </div>
  );
}
