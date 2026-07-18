import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { SiteShell } from "@/components/site-shell";
import { SellerCustomerPreview } from "@/components/seller-customer-preview";
import {
  computePriceForVariant,
  formatCurrency,
  getBrowsePriceOverride,
  getProductBySlug,
  getVariantDisplayLabel,
} from "@/lib/commerce-data";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const product = getProductBySlug(slug);

  if (!product) {
    if (preview === "seller") return <SiteShell theme="bridal" pageEyebrow="Seller preview" pageTitle="Unpublished listing" pageIntro="Review the customer-facing presentation before server sync."><SellerCustomerPreview slug={slug} /></SiteShell>;
    notFound();
  }

  const featuredVariant = product.variants[0];
  const featuredPrice = computePriceForVariant(featuredVariant);
  const featuredBrowseTotal = getBrowsePriceOverride(product.slug) ?? featuredPrice.subtotal;

  return (
    <SiteShell
      theme={product.theme}
      pageEyebrow={product.badge}
      pageTitle={product.title}
      pageIntro={product.subtitle}
    >
      {preview === "seller" ? <div className="customer-preview-banner"><strong>Seller preview</strong><span>This is how the published listing appears to customers.</span><a href={`/seller/listings/${product.slug}`}>Return to seller listing</a></div> : null}
      <section className="content-shell product-detail-grid">
        <article className="content-card">
          <div className="product-detail-media">
            <Image
              className="product-detail-image"
              src={product.heroImageSrc ?? product.imageSrc}
              alt={product.title}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
        </article>

        <div className="stack-lg">
          <article className="content-card stack-md">
            <h2 className="section-title font-display">Craftsmanship</h2>
            <p>{product.description}</p>
            <p>{product.craftsmanship}</p>

            <div className="support-grid">
              <article className="support-card">
                <span className="field-label">Featured browse total</span>
                <p>{formatCurrency(featuredBrowseTotal)}</p>
                <p className="field-help">{getVariantDisplayLabel(product, featuredVariant)}</p>
              </article>
              <article className="support-card">
                <span className="field-label">Certification</span>
                <p>{product.certification}</p>
              </article>
              <article className="support-card">
                <span className="field-label">Fulfillment</span>
                <p>{product.shippingNote}</p>
              </article>
            </div>
          </article>

          <article className="content-card stack-md">
            <h2 className="section-title font-display">Care and gifting</h2>
            <ul className="luxury-list">
              {product.careNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <div className="order-chip-row">
              <span className="status-chip">
                {product.giftable ? "Gift wrap available" : "No gifting add-on"}
              </span>
              <span className="status-chip">
                {product.customizable ? "Bespoke-friendly" : "Ready-stock detail"}
              </span>
            </div>
          </article>
        </div>

        <ProductPurchasePanel productSlug={product.slug} />
      </section>
    </SiteShell>
  );
}
