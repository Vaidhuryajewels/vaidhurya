import { SellerShell } from "@/components/seller-shell";
import { SellerListingsClient } from "@/components/seller-listings-client";
import { computePriceForVariant, formatCurrency, getBrowsePriceOverride, products } from "@/lib/commerce-data";

export default function ListingsPage() {
  const listings = products.map((product) => {
    const variant = product.variants[0];
    return { slug: product.slug, title: product.title, sku: variant.sku, detail: `${variant.material} · ${variant.weightGrams}g`, price: formatCurrency(getBrowsePriceOverride(product.slug) ?? computePriceForVariant(variant).subtotal), inventory: variant.inventoryLabel, image: product.imageSrc, status: "Active" as const };
  });
  return <SellerShell eyebrow="Catalog" title="Listings">
    <section className="seller-content"><SellerListingsClient listings={listings} /></section>
  </SellerShell>;
}
