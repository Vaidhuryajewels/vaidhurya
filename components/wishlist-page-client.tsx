"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import { getProductsBySlugs } from "@/lib/commerce-data";

export function WishlistPageClient() {
  const { wishlist } = useCart();
  const products = getProductsBySlugs(wishlist);

  return (
    <SiteShell
      theme="everyday"
      pageEyebrow="Wishlist"
      pageTitle="Saved products and gifting shortlist"
      pageIntro="Wishlist supports account-style curation even while the storefront keeps guest-first shopping and checkout."
    >
      <section className="content-shell stack-lg">
        {products.length === 0 ? (
          <div className="content-card empty-state-stack">
            <p className="empty-state">No products are saved yet.</p>
            <Link className="primary-button" href="/">
              Explore the storefront
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
