"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { SellerListing } from "../lib/seller-schema";
import { readPersistedListings, writePersistedListings } from "../lib/seller-listing-storage";

export type ListingDetail = { slug: string; title: string; subtitle: string; description: string; image: string; sku: string; material: string; finish: string; weight: number; price: string; certification: string; inventory: string };

export function SellerListingDetail({ initial }: { initial: ListingDetail }) {
  const searchParams = useSearchParams();
  const [editing, setEditing] = useState(searchParams.get("mode") === "edit");
  const [listing, setListing] = useState(initial);
  const [saved, setSaved] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  useEffect(() => {
    const raw = localStorage.getItem(`vaidhurya-catalog-edit:${initial.slug}`);
    if (!raw) return;
    const timer = window.setTimeout(() => { try { setListing({ ...initial, ...JSON.parse(raw) }); } catch {} }, 0);
    return () => window.clearTimeout(timer);
  }, [initial]);
  function update(field: keyof ListingDetail, value: string | number) { setListing((current) => ({ ...current, [field]: value })); }
  function save(event: React.FormEvent) { event.preventDefault(); const persisted = readPersistedListings(); const record = persisted.find((item) => item.slug === initial.slug); if (record) { const price = Number(listing.price.replace(/[^\d.]/g, "")); writePersistedListings(persisted.map((item) => item.slug === initial.slug ? { ...item, listing: { ...item.listing, title: listing.title, sku: listing.sku, metal: /gold/i.test(listing.material) ? "gold" : /silver/i.test(listing.material) ? "silver" : item.listing.metal, purity: listing.material.split(" ")[0] || item.listing.purity, finish: listing.finish, grossWeightGrams: listing.weight || null, price: Number.isFinite(price) ? price : item.listing.price, description: listing.description, certification: listing.certification }, updatedAt: new Date().toISOString() } : item)); } else localStorage.setItem(`vaidhurya-catalog-edit:${initial.slug}`, JSON.stringify(listing)); setSaved("Changes saved."); setEditing(false); }
  async function autofillWithAi() {
    if (!listing.description.trim()) { setAiStatus("Add a description for AI to analyze."); return; }
    setAiBusy(true); setAiStatus("VAIDHURYA Assist is structuring the listing…");
    try {
      const response = await fetch("/api/seller/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ description: listing.description }) });
      const body = await response.json() as { error?: string; listing?: SellerListing; source?: string; notice?: string };
      if (!response.ok || !body.listing) throw new Error(body.error || "AI extraction failed");
      const result = body.listing;
      setListing((current) => ({ ...current, title: result.title || current.title, sku: result.sku || current.sku, material: [result.purity, result.metal !== "unknown" ? result.metal : ""].filter(Boolean).join(" ") || current.material, finish: result.finish || current.finish, weight: result.grossWeightGrams ?? current.weight, price: result.price === null ? current.price : new Intl.NumberFormat("en-IN", { style: "currency", currency: result.currency || "INR", maximumFractionDigits: 0 }).format(result.price), subtitle: [result.jewelryType, result.finish].filter(Boolean).join(" · ") || current.subtitle, description: result.description || current.description, certification: result.certification || current.certification, inventory: result.inventory === null ? current.inventory : `${result.inventory} in stock` }));
      const review = [...result.warnings, ...(result.missingFields.length ? [`Still needed: ${result.missingFields.join(", ")}`] : [])].join(" ");
      setAiStatus(body.notice || `${body.source === "openrouter" ? "AI" : "Local extraction"} autofilled the form.${review ? ` ${review}` : " Review the details before saving."}`);
    } catch (error) { setAiStatus(error instanceof Error ? error.message : "AI extraction failed. Your text is unchanged."); }
    finally { setAiBusy(false); }
  }

  return <section className="seller-content listing-detail-page"><div className="listing-mode-bar"><div><button className={!editing ? "active" : ""} onClick={() => setEditing(false)}>Seller view</button><button className={editing ? "active" : ""} onClick={() => setEditing(true)}>Edit mode</button></div><Link className="seller-primary" href={`/products/${initial.slug}?preview=seller`} target="_blank">Customer preview ↗</Link></div>{saved ? <p className="status-banner" role="status">{saved}</p> : null}
    {!editing ? <div className="seller-listing-overview"><div className="seller-listing-hero"><Image src={listing.image} alt={listing.title} fill sizes="(max-width: 800px) 100vw, 45vw" /></div><article className="seller-panel listing-facts"><p className="seller-kicker">{listing.sku} · Active</p><h2>{listing.title}</h2><p>{listing.subtitle}</p><dl><div><dt>Material</dt><dd>{listing.material}</dd></div><div><dt>Finish</dt><dd>{listing.finish}</dd></div><div><dt>Weight</dt><dd>{listing.weight}g</dd></div><div><dt>Browse price</dt><dd>{listing.price}</dd></div><div><dt>Inventory</dt><dd>{listing.inventory}</dd></div><div><dt>Certification</dt><dd>{listing.certification}</dd></div></dl><button className="seller-primary" onClick={() => setEditing(true)}>Edit listing</button></article></div> : <form className="seller-panel listing-edit-form" onSubmit={save}><div className="panel-heading"><div><p className="seller-kicker">Catalog editor</p><h2>Edit listing details</h2></div><span>Changes require seller review</span></div><div className="ai-edit-assist"><div><strong>✦ Autofill with AI</strong><span>Describe the piece below, then let AI structure every available detail.</span></div><button className="seller-primary" type="button" disabled={aiBusy} onClick={autofillWithAi}>{aiBusy ? "Analyzing…" : "Autofill form with AI"}</button></div>{aiStatus ? <p className="status-banner" role="status">{aiStatus}</p> : null}<div className="listing-form"><label>Title<input value={listing.title} onChange={(e) => update("title", e.target.value)} /></label><label>SKU<input value={listing.sku} onChange={(e) => update("sku", e.target.value)} /></label><label>Material<input value={listing.material} onChange={(e) => update("material", e.target.value)} /></label><label>Finish<input value={listing.finish} onChange={(e) => update("finish", e.target.value)} /></label><label>Weight (g)<input type="number" value={listing.weight} onChange={(e) => update("weight", Number(e.target.value))} /></label><label>Price<input value={listing.price} onChange={(e) => update("price", e.target.value)} /></label><label className="wide">Subtitle<input value={listing.subtitle} onChange={(e) => update("subtitle", e.target.value)} /></label><label className="wide">Description<textarea value={listing.description} onChange={(e) => update("description", e.target.value)} /></label><label className="wide">Certification<textarea value={listing.certification} onChange={(e) => update("certification", e.target.value)} /></label></div><div className="edit-form-actions"><button type="button" onClick={() => setEditing(false)}>Cancel</button><button className="seller-primary" type="submit">Save changes</button></div></form>}
  </section>;
}
