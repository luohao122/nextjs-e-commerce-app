import { USER_ROLES } from "@/config/constants";
import { ROUTES } from "@/config/route-name";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerDashboardPage() {
  const loggedUser = await currentUser();

  // If the current user is a normal user,
  // redirect them back to home page
  if (
    !loggedUser?.privateMetadata?.role ||
    loggedUser?.privateMetadata.role === USER_ROLES.USER
  ) {
    redirect(ROUTES.HOME);
  }

  // If the current user is an admin user,
  // redirect them back to admin dashboard
  if (loggedUser.privateMetadata.role !== USER_ROLES.SELLER) {
    redirect(ROUTES.HOME);
  }

  // Retrieve user's list of stores
  const stores = await db.store.findMany({
    where: {
      userId: loggedUser.id,
    },
  });

  // If the user has no stores, redirect them to the create store page
  if (!stores.length) {
    redirect(ROUTES.SELLER_CREATE_STORE);
  }

  // If the user has stores, redirect them to the first store in the list
  redirect(`${ROUTES.SELLER_STORES_LIST}/${stores[0].url}`);
}
