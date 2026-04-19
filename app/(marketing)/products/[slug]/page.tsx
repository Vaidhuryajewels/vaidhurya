import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { SiteShell } from "@/components/site-shell";
import {
  computePriceForVariant,
  formatCurrency,
  getProductBySlug,
} from "@/lib/commerce-data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const featuredVariant = product.variants[0];
  const featuredPrice = computePriceForVariant(featuredVariant);

  return (
    <SiteShell
      theme={product.theme}
      pageEyebrow={product.badge}
      pageTitle={product.title}
      pageIntro={product.subtitle}
    >
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
                <p>{formatCurrency(featuredPrice.subtotal)}</p>
                <p className="field-help">{featuredVariant.label}</p>
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
