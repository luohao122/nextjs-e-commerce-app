import { getCountryList } from "@/queries/country.query";
import { getUserShippingAddresses } from "@/queries/user.query";
import AddressContainer from "@/components/store/profile/addresses/address-container";

export default async function AddressesPage() {
  const addresses = await getUserShippingAddresses();
  const countries = await getCountryList();

  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  )
}