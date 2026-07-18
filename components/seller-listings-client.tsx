"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readPersistedListings } from "@/lib/seller-listing-storage";

export type CatalogListingCard = { slug: string; title: string; sku: string; detail: string; price: string; inventory: string; image: string; status: "Active" | "Draft" | "Sold out" };

export function SellerListingsClient({ listings }: { listings: CatalogListingCard[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Drafts" | "Sold out">("All");
  const [saved, setSaved] = useState<CatalogListingCard[]>([]);
  useEffect(() => { const load = () => setSaved(readPersistedListings().map((item) => ({ slug: item.slug, title: item.listing.title, sku: item.listing.sku || "Seller listing", detail: [item.listing.purity, item.listing.metal, item.listing.grossWeightGrams ? `${item.listing.grossWeightGrams}g` : ""].filter(Boolean).join(" · "), price: item.listing.price === null ? "Price pending" : new Intl.NumberFormat("en-IN", { style: "currency", currency: item.listing.currency, maximumFractionDigits: 0 }).format(item.listing.price), inventory: item.listing.inventory === null ? "Inventory pending" : `${item.listing.inventory} in stock`, image: item.media.find((media) => media.type.startsWith("image/"))?.dataUrl || "/vaidhurya-logo.png", status: item.status }))); const timer = window.setTimeout(load, 0); window.addEventListener("vaidhurya-listings-changed", load); return () => { window.clearTimeout(timer); window.removeEventListener("vaidhurya-listings-changed", load); }; }, []);
  const allListings = useMemo(() => [...saved, ...listings.filter((catalog) => !saved.some((item) => item.slug === catalog.slug))], [listings, saved]);
  const counts = useMemo(() => ({ All: allListings.length, Active: allListings.filter((item) => item.status === "Active").length, Drafts: allListings.filter((item) => item.status === "Draft").length, "Sold out": allListings.filter((item) => item.status === "Sold out").length }), [allListings]);
  const visible = useMemo(() => allListings.filter((item) => {
    const matchesFilter = filter === "All" || (filter === "Drafts" ? item.status === "Draft" : item.status === filter);
    const needle = query.trim().toLowerCase();
    return matchesFilter && (!needle || `${item.title} ${item.sku}`.toLowerCase().includes(needle));
  }), [allListings, filter, query]);

  return <><div className="listing-toolbar"><div className="seller-search">⌕ <input aria-label="Search listings" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or SKU" /></div><Link className="seller-primary" href="/seller/listings/new">＋ Add listing</Link></div>
    <div className="filter-chips" aria-label="Listing filters">{(["All", "Active", "Drafts", "Sold out"] as const).map((option) => <button aria-pressed={filter === option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)} key={option}>{option} <b>{counts[option]}</b></button>)}</div>
    {visible.length ? <div className="listing-grid">{visible.map((listing) => <article className="listing-card" key={listing.slug}><div className="listing-image"><Image src={listing.image} alt={listing.title} fill sizes="(max-width: 700px) 100vw, 260px" /><span className={listing.status.toLowerCase().replace(" ", "-")}>{listing.status}</span></div><div className="listing-card-body"><small>{listing.sku}</small><h2>{listing.title}</h2><p>{listing.detail}</p><div><strong>{listing.price}</strong><span>{listing.inventory}</span></div><div className="listing-actions"><Link href={`/seller/listings/${listing.slug}`}>Seller view</Link><Link href={`/seller/listings/${listing.slug}?mode=edit`}>Edit</Link><Link href={`/products/${listing.slug}?preview=seller`} target="_blank">Customer preview ↗</Link></div></div></article>)}</div> : <div className="empty-listings"><span>◇</span><h2>No listings found</h2><p>Try another search or status filter.</p><button onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters</button></div>}
  </>;
}
