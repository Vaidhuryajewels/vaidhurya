import Image from "next/image";
import { notFound } from "next/navigation";
import { BridalLegacyCollection } from "@/components/bridal-legacy-collection";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import {
  getCollectionBySlug,
  getProductsForCollection,
} from "@/lib/commerce-data";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  if (collection.slug === "brides-collection") {
    return <BridalLegacyCollection />;
  }

  const products = getProductsForCollection(collection.slug);

  return (
    <SiteShell
      theme={collection.theme}
      pageEyebrow={collection.kicker}
      pageTitle={collection.heroTitle}
      pageIntro={collection.heroCopy}
    >
      <section className="content-shell stack-lg">
        <article className="collection-hero-card">
          <div className="collection-hero-copy">
            <p className="section-kicker">Collection focus</p>
            <h2 className="section-title font-display">{collection.title}</h2>
            <p className="section-copy">{collection.description}</p>
          </div>
          <div className="collection-hero-media">
            <Image
              className="collection-hero-image"
              src={collection.imageSrc}
              alt={collection.title}
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
          </div>
        </article>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
