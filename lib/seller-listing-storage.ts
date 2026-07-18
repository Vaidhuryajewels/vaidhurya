import type { SellerListing } from "./seller-schema";

export const sellerListingsStorageKey = "vaidhurya-seller-published-listings";
export type PersistedSellerListing = { slug: string; listing: SellerListing; media: Array<{ name: string; type: string; dataUrl: string }>; status: "Active" | "Draft"; createdAt: string; updatedAt: string };

export function slugifyListing(title: string, sku: string) {
  const base = `${title}-${sku}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return base || `listing-${Date.now()}`;
}
export function readPersistedListings(): PersistedSellerListing[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(sellerListingsStorageKey) || "[]") as PersistedSellerListing[]; } catch { return []; }
}
export function writePersistedListings(listings: PersistedSellerListing[]) {
  localStorage.setItem(sellerListingsStorageKey, JSON.stringify(listings));
  window.dispatchEvent(new Event("vaidhurya-listings-changed"));
}
