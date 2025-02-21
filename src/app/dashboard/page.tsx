import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { USER_ROLES } from "@/config/constants";
import { ROUTES } from "@/config/route-name";

export default async function DashboardPage() {
  // Get the currently logged in user from clerk
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
  if (loggedUser.privateMetadata.role === USER_ROLES.ADMIN) {
    redirect(ROUTES.ADMIN_DASHBOARD);
  }

  // If the current user is a seller user,
  // redirect them back to seller dashboard
  if (loggedUser.privateMetadata.role === USER_ROLES.SELLER) {
    redirect(ROUTES.SELLER_DASHBOARD);
  }
}
