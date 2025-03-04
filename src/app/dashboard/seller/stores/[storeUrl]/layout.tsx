import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header/dashboard-header";
import { USER_ROLES } from "@/config/constants";

import { ROUTES } from "@/config/route-name";
import { db } from "@/lib/db";

export default async function SellerStoreDashboardLayout({
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

  // Retrieve user's list of stores
  const stores = await db.store.findMany({
    where: {
      userId: loggedUser.id
    }
  })

  return (
    <div className="w-full h-full flex">
      <DashboardSidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <DashboardHeader />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
