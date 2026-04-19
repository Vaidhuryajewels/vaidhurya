import { SiteShell } from "@/components/site-shell";
import { collections, products } from "@/lib/commerce-data";

export default function AdminCatalogPage() {
  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Admin • Catalog"
      pageTitle="Catalog, variants, and pricing inputs"
      pageIntro="A merchandiser-focused view for publishable assortment, materials, certificates, gifting, and variant readiness."
    >
      <section className="content-shell stack-lg">
        <div className="feature-grid">
          {collections.map((collection) => (
            <article className="feature-card" key={collection.slug}>
              <p className="section-kicker">{collection.theme}</p>
              <h2 className="feature-card-title">{collection.title}</h2>
              <p>{collection.description}</p>
            </article>
          ))}
        </div>

        <article className="content-card stack-lg">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">SKU readiness</p>
            <h2 className="section-title font-display">Variant inventory view</h2>
          </div>

          <div className="admin-table">
            <div className="admin-table-row admin-table-row-head">
              <strong>Product</strong>
              <strong>Variant</strong>
              <strong>Inventory</strong>
              <strong>Certification</strong>
            </div>
            {products.flatMap((product) =>
              product.variants.map((variant) => (
                <div className="admin-table-row" key={variant.id}>
                  <span>{product.title}</span>
                  <span>{variant.label}</span>
                  <span>{variant.inventoryLabel}</span>
                  <span>{product.certification}</span>
                </div>
              )),
            )}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
