"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getListingReadiness, listingSchema, type SellerListing } from "@/lib/seller-schema";
import { readPersistedListings, slugifyListing, writePersistedListings } from "@/lib/seller-listing-storage";
import { createClient } from "@/utils/supabase/client";

const blank = listingSchema.parse({});
const draftKey = "vaidhurya-seller-listing-draft";

export function AddListingFlow() {
  const [description, setDescription] = useState("");
  const [listing, setListing] = useState<SellerListing>(blank);
  const [media, setMedia] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [phase, setPhase] = useState<"capture" | "review">("capture");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const readiness = useMemo(() => getListingReadiness(listing, media.length), [listing, media.length]);
  const completionItems = useMemo(() => [
    { label: "At least one photo or video", complete: media.length > 0 },
    { label: "Listing title", complete: Boolean(listing.title.trim()) },
    { label: "Jewelry type", complete: Boolean(listing.jewelryType.trim()) },
    { label: "Metal and purity", complete: listing.metal !== "unknown" && Boolean(listing.purity.trim()) },
    { label: "Price", complete: listing.price !== null },
    { label: "Inventory", complete: listing.inventory !== null },
  ], [listing, media.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      try { const draft = JSON.parse(raw); setDescription(draft.description || ""); setListing(listingSchema.parse(draft.listing || {})); setStatus("Draft restored from this device."); } catch { /* Ignore invalid old drafts. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!description && listing === blank) return;
    const timer = window.setTimeout(() => localStorage.setItem(draftKey, JSON.stringify({ description, listing, savedAt: Date.now() })), 300);
    return () => window.clearTimeout(timer);
  }, [description, listing]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    setMedia((current) => [...current, ...Array.from(files).slice(0, 8 - current.length).map((file) => ({ name: file.name, type: file.type, url: URL.createObjectURL(file) }))]);
  }
  async function analyze() {
    if (!description.trim()) { setStatus("Describe the piece before analyzing it."); return; }
    setBusy(true); setStatus("VAIDHURYA Assist is reading your description…");
    try {
      const response = await fetch("/api/seller/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ description }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Analysis failed");
      setListing(listingSchema.parse(body.listing)); setPhase("review");
      setStatus(body.notice || `Structured with ${body.source === "openrouter" ? "OpenRouter AI" : "on-device rules"}. Please verify every field.`);
    } catch { setStatus("Analysis needs a connection. Your draft is saved and you can fill the fields manually."); setPhase("review"); }
    finally { setBusy(false); }
  }
  function update<K extends keyof SellerListing>(key: K, value: SellerListing[K]) { setListing((current) => ({ ...current, [key]: value })); }
  async function saveDraft() {
    setBusy(true); setStatus("Saving draft…");
    try {
      const savedMedia = await Promise.all(media.map(async (item) => ({ name: item.name, type: item.type, dataUrl: await fetch(item.url).then((response) => response.blob()).then((blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); })) })));
      const draftListing = { ...listing, title: listing.title.trim() || "Untitled draft" };
      const slug = slugifyListing(draftListing.title, draftListing.sku || "draft"); const now = new Date().toISOString();
      writePersistedListings([{ slug, listing: draftListing, media: savedMedia, status: "Draft", createdAt: now, updatedAt: now }, ...readPersistedListings().filter((item) => item.slug !== slug)]);
      localStorage.setItem(draftKey, JSON.stringify({ description, listing: draftListing, savedAt: Date.now() }));
      setStatus("Draft saved. You can safely return later from Listings → Drafts.");
    } catch { setStatus("Draft could not be saved. Keep this page open and try again."); }
    finally { setBusy(false); }
  }
  async function publish() {
    setBusy(true); setStatus("Saving listing…");
    try {
      const savedMedia = await Promise.all(media.map(async (item) => ({ name: item.name, type: item.type, dataUrl: await fetch(item.url).then((response) => response.blob()).then((blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); })) })));
      const slug = slugifyListing(listing.title, listing.sku); const now = new Date().toISOString();
      writePersistedListings([{ slug, listing, media: savedMedia, status: "Active", createdAt: now, updatedAt: now }, ...readPersistedListings().filter((item) => item.slug !== slug)]);
      const supabase = createClient(); const user = (await supabase?.auth.getUser())?.data.user;
      if (supabase && user) {
        await supabase.from("seller_profiles").upsert({ id: user.id, display_name: String(user.user_metadata.display_name || user.email || "Seller"), role: "seller" });
        const { error } = await supabase.from("seller_listings").insert({ seller_id: user.id, status: "active", title: listing.title, structured_data: { ...listing, slug, media: savedMedia } });
        setStatus(error ? "Saved on this device. Server sync is waiting for the Supabase seller migration." : "Saved on this device and synced to the seller database.");
      } else setStatus("Saved on this device for offline use.");
      localStorage.removeItem(draftKey); setPublishedSlug(slug);
    } catch (error) { setStatus(error instanceof Error ? `Could not save: ${error.message}` : "Could not save this listing."); }
    finally { setBusy(false); }
  }

  return <div className="listing-flow">
    <ol className="flow-progress" aria-label="Listing creation progress"><li className={phase === "capture" ? "current" : "done"}><span>1</span><div><strong>Capture</strong><small>Media & description</small></div></li><li className={phase === "review" ? "current" : publishedSlug ? "done" : ""}><span>2</span><div><strong>Verify</strong><small>Complete the details</small></div></li><li className={publishedSlug ? "done current" : ""}><span>3</span><div><strong>Publish</strong><small>Ready for customers</small></div></li></ol>
    {publishedSlug ? <section className="publish-success"><span>✓</span><p className="seller-kicker">Listing saved</p><h2>{listing.title} is ready for review.</h2><p role="status">{status}</p><div className="publish-links"><Link className="seller-primary" href={`/seller/listings/${publishedSlug}`}>View saved listing</Link><Link href="/seller/listings">View all listings</Link></div></section> : null}
    {!publishedSlug && phase === "capture" ? <div className="flow-columns"><section className="seller-panel flow-panel"><p className="seller-kicker">Step 1 · Media</p><h2>Show every exquisite detail</h2><p>Capture the front, back, clasp, hallmark, certificate, and a short movement video.</p><label className="media-capture"><span>⌁</span><strong>Capture photos or video</strong><small>Use camera or choose up to 8 files</small><input aria-label="Capture listing media" type="file" accept="image/*,video/*" capture="environment" multiple onChange={(event) => addFiles(event.target.files)} /></label><div className="media-preview">{media.map((item, index) => <div key={`${item.name}-${index}`}>{item.type.startsWith("image/") ? <Image src={item.url} alt="Listing preview" fill unoptimized /> : <video src={item.url} aria-label="Video preview" />}<button aria-label={`Remove ${item.name}`} onClick={() => setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</div><small className="privacy-note">Media is saved with the listing on this device; server sync activates after the seller database migration.</small></section>
      <section className="seller-panel flow-panel assist-panel"><div className="assist-title"><span>✦</span><div><p className="seller-kicker">VAIDHURYA Assist</p><h2>Describe it naturally</h2></div></div><p>Include what you know. The assistant will structure facts and ask for anything missing.</p><textarea aria-label="Listing description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Example: Bridal necklace in BIS hallmarked 925 silver, antique gold finish, 82 grams, priced at ₹23,793…" /><div className="prompt-tips"><span>Try including</span><button type="button" onClick={() => setDescription((text) => `${text} metal and purity`)}>Metal & purity</button><button type="button" onClick={() => setDescription((text) => `${text} weight in grams`)}>Weight</button><button type="button" onClick={() => setDescription((text) => `${text} price in INR`)}>Price</button></div><div className="capture-actions"><button className="seller-primary analyze-button" disabled={busy} onClick={analyze}>{busy ? "Analyzing…" : "Structure listing with AI ✦"}</button><button className="draft-button" type="button" disabled={busy} onClick={saveDraft}>Save draft</button></div></section></div> : null}
    {!publishedSlug && phase === "review" ? <section className="seller-panel review-panel"><div className="panel-heading"><div><p className="seller-kicker">Step 2 · Seller verification</p><h2>Review extracted details</h2></div><span className="confidence">{Math.round(listing.confidence * 100)}% confidence</span></div><p className="status-banner" role="status">{status}</p><section className="completeness-loop" aria-label="Listing completeness"><div><strong>{completionItems.filter((item) => item.complete).length} of {completionItems.length} checks complete</strong><span>{readiness.ready ? "Ready to publish" : "Complete the remaining checks"}</span></div><ul>{completionItems.map((item) => <li className={item.complete ? "complete" : "missing"} key={item.label}>{item.complete ? "✓" : "○"} {item.label}</li>)}</ul></section>{listing.warnings.map((warning) => <p className="warning-banner" key={warning}>! {warning}</p>)}<div className="listing-form">
      <label>Listing title<input value={listing.title} onChange={(e) => update("title", e.target.value)} /></label><label>Jewelry type<input value={listing.jewelryType} onChange={(e) => update("jewelryType", e.target.value)} /></label><label>Metal<select value={listing.metal} onChange={(e) => update("metal", e.target.value as SellerListing["metal"])}><option value="unknown">Select metal</option><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option><option value="mixed">Mixed</option></select></label><label>Purity<input value={listing.purity} onChange={(e) => update("purity", e.target.value)} placeholder="925, 18K, 22K" /></label><label>Certification<input value={listing.certification} onChange={(e) => update("certification", e.target.value)} /></label><label>Weight (grams)<input type="number" value={listing.grossWeightGrams ?? ""} onChange={(e) => update("grossWeightGrams", e.target.value ? Number(e.target.value) : null)} /></label><label>Price (₹)<input type="number" value={listing.price ?? ""} onChange={(e) => update("price", e.target.value ? Number(e.target.value) : null)} /></label><label>Inventory<input type="number" value={listing.inventory ?? ""} onChange={(e) => update("inventory", e.target.value ? Number(e.target.value) : null)} /></label><label className="wide">Customer-ready description<textarea value={listing.description} onChange={(e) => update("description", e.target.value)} /></label></div><div className="review-actions"><button onClick={() => setPhase("capture")}>← Back to capture</button><div><span>{readiness.ready ? "All required details complete" : `Still needed: ${readiness.missing.join(", ")}${media.length ? "" : ", at least one photo"}`}</span><button className="seller-primary" disabled={!readiness.ready || busy} onClick={publish}>{busy ? "Saving…" : "Approve & publish"}</button></div></div></section> : null}
    {!publishedSlug && status && phase === "capture" ? <p className="status-banner" role="status">{status}</p> : null}
  </div>;
}
