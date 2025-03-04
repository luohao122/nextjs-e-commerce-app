import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { USER_ROLES } from "@/config/constants";
import { ROUTES } from "@/config/route-name";

export default async function SellerDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
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

  return <div>{children}</div>;
}
