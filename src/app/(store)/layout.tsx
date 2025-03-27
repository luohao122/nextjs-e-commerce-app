import type { Metadata } from "next"; // Importing type for defining page metadata

import Header from "@/components/store/layout/header/header";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";

/**
 * Metadata for the application (used in <head>).
 */
export const metadata: Metadata = {
  title: "MarketHub",
  description:
    "Welcome to MarketHub, your ultimate destination for seamless online shopping!",
};

/**
 * Store layout component for the application.
 * It wraps all pages and handles authentication, theming, toasts, and global font styles.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered inside the layout
 */
export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <CategoriesHeader />
      {children}
      <div className="h-96"></div>
      <Footer />
    </div>
  );
}
