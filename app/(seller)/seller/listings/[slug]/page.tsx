import { Suspense } from "react";
import { SellerListingDetail } from "@/components/seller-listing-detail";
import { SellerPersistedListingDetail } from "@/components/seller-persisted-listing-detail";
import { SellerShell } from "@/components/seller-shell";
import { computePriceForVariant, formatCurrency, getBrowsePriceOverride, getProductBySlug } from "@/lib/commerce-data";

export default async function SellerListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = getProductBySlug(slug);
  if (!product) return <SellerShell eyebrow="Catalog · Saved listing" title="Seller listing"><Suspense fallback={<section className="seller-content">Loading saved listing…</section>}><SellerPersistedListingDetail slug={slug} /></Suspense></SellerShell>;
  const variant = product.variants[0];
  const initial = { slug, title: product.title, subtitle: product.subtitle, description: product.description, image: product.heroImageSrc ?? product.imageSrc, sku: variant.sku, material: variant.material, finish: variant.finish, weight: variant.weightGrams, price: formatCurrency(getBrowsePriceOverride(slug) ?? computePriceForVariant(variant).subtotal), certification: product.certification, inventory: variant.inventoryLabel };
  return <SellerShell eyebrow="Catalog · Listing" title={product.title}><Suspense fallback={<section className="seller-content">Loading listing…</section>}><SellerListingDetail initial={initial} /></Suspense></SellerShell>;
}
