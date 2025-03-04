import { Store } from "@prisma/client";

export interface DashboardSidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}
