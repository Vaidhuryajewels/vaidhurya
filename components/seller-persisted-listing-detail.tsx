"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readPersistedListings } from "@/lib/seller-listing-storage";
import { SellerListingDetail, type ListingDetail } from "./seller-listing-detail";

export function SellerPersistedListingDetail({ slug }: { slug: string }) {
  const [detail, setDetail] = useState<ListingDetail | null>();
  useEffect(() => { const timer = window.setTimeout(() => { const saved = readPersistedListings().find((item) => item.slug === slug); if (!saved) { setDetail(null); return; } const listing = saved.listing; setDetail({ slug, title: listing.title, subtitle: [listing.jewelryType, listing.finish].filter(Boolean).join(" · "), description: listing.description, image: saved.media.find((item) => item.type.startsWith("image/"))?.dataUrl || "/vaidhurya-logo.png", sku: listing.sku || "Seller listing", material: [listing.purity, listing.metal].filter(Boolean).join(" "), finish: listing.finish || "Not specified", weight: listing.grossWeightGrams || 0, price: listing.price === null ? "Price pending" : new Intl.NumberFormat("en-IN", { style: "currency", currency: listing.currency, maximumFractionDigits: 0 }).format(listing.price), certification: listing.certification || "Not specified", inventory: listing.inventory === null ? "Inventory pending" : `${listing.inventory} in stock` }); }, 0); return () => window.clearTimeout(timer); }, [slug]);
  if (detail === undefined) return <section className="seller-content">Loading saved listing…</section>;
  if (detail === null) return <section className="seller-content empty-listings"><h2>Listing not found</h2><p>This listing is not saved on this device.</p><Link className="seller-primary" href="/seller/listings">Back to listings</Link></section>;
  return <SellerListingDetail initial={detail} />;
}
