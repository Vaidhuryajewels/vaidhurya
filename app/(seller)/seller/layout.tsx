import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "VAIDHURYA Seller",
  description: "Seller inbox and AI-assisted jewelry listings",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "VAIDHURYA" },
};
export const viewport: Viewport = { themeColor: "#351027", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function SellerLayout({ children }: { children: React.ReactNode }) { return children; }
