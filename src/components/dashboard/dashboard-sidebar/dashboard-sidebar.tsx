import { currentUser } from "@clerk/nextjs/server";

import { DashboardSidebarProps } from "@/components/dashboard/dashboard-sidebar/dashboard-sidebar.types";
import Logo from "@/components/shared/logo";
import UserInfo from "@/components/dashboard/user-info/user-info";

import DashboardSidebarNav from "@/components/dashboard/dashboard-sidebar-nav/dashboard-sidebar-nav";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/config/dashboard-data";

export default async function DashboardSidebar({
  isAdmin,
}: DashboardSidebarProps) {
  const loggedUser = await currentUser();

  return (
    <aside className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {loggedUser && <UserInfo user={loggedUser} />}
      {isAdmin ? (
        <DashboardSidebarNav menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <DashboardSidebarNav menuLinks={sellerDashboardSidebarOptions} />
      )}
    </aside>
  );
}
