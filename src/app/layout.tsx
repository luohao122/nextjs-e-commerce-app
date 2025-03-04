import type { Metadata } from "next"; // Importing type for defining page metadata
import { Geist, Geist_Mono, Barlow } from "next/font/google"; // Importing Google Fonts with Next.js
import { ThemeProvider } from "next-themes"; // Theme provider for dark/light mode support

import { ClerkProvider } from "@clerk/nextjs"; // Clerk authentication provider for handling user sessions
import { Toaster } from "@/components/ui/toaster"; // Setup toast provider
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Setup toast provider

import ModalProvider from "@/contexts/modal-provider";
import { ROUTES } from "@/config/route-name";
import "./globals.css"; // Global styles for the application

// Define and configure fonts with CSS variables for use in the application
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "700"], // Specifying font weights to be loaded
});

/**
 * Metadata for the application (used in <head>).
 */
export const metadata: Metadata = {
  title: "MarketHub",
  description:
    "Welcome to MarketHub, your ultimate destination for seamless online shopping!",
};

/**
 * Root layout component for the application.
 * It wraps all pages and handles authentication, theming, toasts, and global font styles.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered inside the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={ROUTES.HOME}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster />
            <SonnerToaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
