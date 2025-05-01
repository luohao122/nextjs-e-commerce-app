import { currentUser } from "@clerk/nextjs/server";

import { DashboardSidebarProps } from "@/components/dashboard/dashboard-sidebar/dashboard-sidebar.types";
import Logo from "@/components/shared/logo/logo";
import UserInfo from "@/components/dashboard/user-info/user-info";

import AdminDashboardSidebarNav from "@/components/dashboard/admin-dashboard-sidebar-nav/admin-dashboard-sidebar-nav";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/config/dashboard-data";
import SellerDashboardSidebarNav from "@/components/dashboard/seller-dashboard-sidebar-nav/seller-dashboard-sidebar-nav";

import StoreSwitcher from "@/components/dashboard/store-switcher/store-switcher";

export default async function DashboardSidebar({
  isAdmin,
  stores,
}: DashboardSidebarProps) {
  const loggedUser = await currentUser();

  return (
    <aside className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {loggedUser && <UserInfo user={loggedUser} />}
      {!isAdmin && stores && <StoreSwitcher stores={stores} />}
      {isAdmin ? (
        <AdminDashboardSidebarNav menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SellerDashboardSidebarNav menuLinks={sellerDashboardSidebarOptions} />
      )}
    </aside>
  );
}
