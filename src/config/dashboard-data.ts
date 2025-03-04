import { DashboardSidebarMenuInterface } from "@/types/dashboard-data.types";
import { ROUTES } from "@/config/route-name";

export const adminDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    link: ROUTES.ADMIN_DASHBOARD,
  },
  {
    label: "Stores",
    icon: "store",
    link: ROUTES.ADMIN_STORES_LIST,
  },
  {
    label: "Orders",
    icon: "box-list",
    link: ROUTES.ADMIN_ORDERS_LIST,
  },
  {
    label: "Categories",
    icon: "categories",
    link: ROUTES.ADMIN_CATEGORIES_LIST,
  },
  {
    label: "Sub-Categories",
    icon: "categories",
    link: ROUTES.ADMIN_SUB_CATEGORIES_LIST,
  },
  {
    label: "Offer Tags",
    icon: "offer",
    link: ROUTES.ADMIN_OFFER_TAGS_LIST,
  },
  {
    label: "Coupons",
    icon: "coupon",
    link: ROUTES.ADMIN_COUPONS_LIST,
  },
];

export const sellerDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    link: ROUTES.SELLER_HOME,
  },
  {
    label: "Products",
    icon: "products",
    link: ROUTES.SELLER_PRODUCTS_LIST,
  },
  {
    label: "Orders",
    icon: "box-list",
    link: ROUTES.SELLER_ORDERS_LIST,
  },
  {
    label: "Inventory",
    icon: "inventory",
    link: ROUTES.SELLER_INVENTORY_LIST,
  },
  {
    label: "Coupons",
    icon: "coupon",
    link: ROUTES.SELLER_COUPONS_LIST,
  },
  {
    label: "Shipping",
    icon: "shipping",
    link: ROUTES.SELLER_SHIPPING_LIST,
  },
  {
    label: "Settings",
    icon: "settings",
    link: ROUTES.SELLER_SETTINGS_LIST,
  },
];
