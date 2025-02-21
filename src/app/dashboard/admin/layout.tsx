import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard/dashboard-header/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar/dashboard-sidebar";
import { USER_ROLES } from "@/config/constants";

import { ROUTES } from "@/config/route-name";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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
  if (loggedUser.privateMetadata.role !== USER_ROLES.ADMIN) {
    redirect(ROUTES.HOME);
  }

  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <DashboardSidebar isAdmin={true} />
      <div className="ml-[300px]">
        {/* Header */}
        <DashboardHeader />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
