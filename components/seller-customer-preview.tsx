"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readPersistedListings, type PersistedSellerListing } from "@/lib/seller-listing-storage";

export function SellerCustomerPreview({ slug }: { slug: string }) {
  const [record, setRecord] = useState<PersistedSellerListing | null>();
  useEffect(() => { const timer = window.setTimeout(() => setRecord(readPersistedListings().find((item) => item.slug === slug) || null), 0); return () => window.clearTimeout(timer); }, [slug]);
  if (record === undefined) return <main className="content-shell">Loading customer preview…</main>;
  if (!record) return <main className="content-shell"><h1>Preview unavailable</h1><p>This seller listing is not stored on this device.</p></main>;
  const { listing } = record; const image = record.media.find((item) => item.type.startsWith("image/"))?.dataUrl;
  return <main><div className="customer-preview-banner"><strong>Seller preview</strong><span>Device-saved preview. Publish sync is pending.</span><Link href={`/seller/listings/${slug}`}>Return to seller listing</Link></div><section className="content-shell product-detail-grid"><article className="content-card"><div className="product-detail-media">{image ? <img className="product-detail-image" src={image} alt={listing.title} /> : <div className="preview-media-empty">No product image</div>}</div></article><article className="content-card stack-md"><p className="field-label">{listing.jewelryType}</p><h1 className="section-title font-display">{listing.title}</h1><p>{listing.description}</p><div className="support-grid"><article className="support-card"><span className="field-label">Price</span><p>{listing.price === null ? "Price pending" : new Intl.NumberFormat("en-IN", { style: "currency", currency: listing.currency, maximumFractionDigits: 0 }).format(listing.price)}</p></article><article className="support-card"><span className="field-label">Material</span><p>{listing.purity} {listing.metal}</p></article><article className="support-card"><span className="field-label">Certification</span><p>{listing.certification || "Not specified"}</p></article></div></article></section></main>;
}
