import { SellerShell } from "@/components/seller-shell";
import { products } from "@/lib/commerce-data";
import { SellerDashboardClient } from "@/components/seller-dashboard-client";

export default function SellerDashboard() {
  return <SellerShell eyebrow="Seller workspace" title="Dashboard">
    <SellerDashboardClient productCount={products.length} />
  </SellerShell>;
}
