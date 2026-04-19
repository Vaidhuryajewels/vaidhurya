import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VAIDHURYA | Premium Jewelry Commerce",
  description:
    "Premium jewelry e-commerce storefront with dynamic pricing, protected checkout price locks, shipment tracking, and bespoke quote flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
