import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FilterStoreProvider } from "@/providers/filter-store-provider";
import { ThemeStoreProvider } from "@/providers/theme-store-provider";
import QueryProvider from "@/providers/query-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HotelBooking.com | Find Your Perfect Stay",
  description: "Browse and book hotels worldwide with the best prices and 24/7 support.",
  icons : {
    icon:"/icons/hotel.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        nunitoSans.variable,
        geistHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeStoreProvider>
        <FilterStoreProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster/>
          </QueryProvider>
        </FilterStoreProvider>
        </ThemeStoreProvider>
      </body>
    </html>
  );
}
