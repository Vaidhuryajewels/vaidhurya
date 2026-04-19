"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import {
  computePriceForVariant,
  formatCurrency,
  type Product,
} from "@/lib/commerce-data";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, isWishlisted, toggleWishlist } = useCart();
  const primaryVariant = product.variants[0];
  const price = computePriceForVariant(primaryVariant);

  return (
    <article className="product-card">
      <Link className="product-card-media" href={`/products/${product.slug}`}>
        <Image
          className="product-card-image"
          src={product.imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 900px) 92vw, 30vw"
        />
      </Link>

      <div className="product-card-copy">
        <div className="product-card-heading">
          <span className="product-badge">{product.badge}</span>
          <h3 className="product-card-title font-display">{product.title}</h3>
          <p className="product-card-subtitle">{product.subtitle}</p>
        </div>

        <div className="product-card-meta">
          <span>{primaryVariant.material}</span>
          <span>{primaryVariant.label}</span>
        </div>

        <div className="product-card-footer">
          <div>
            <p className="product-card-price">{formatCurrency(price.subtotal)}</p>
            <p className="product-card-note">{primaryVariant.leadTimeLabel}</p>
          </div>

          <div className="product-card-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => toggleWishlist(product.slug)}
            >
              {isWishlisted(product.slug) ? "Saved" : "Wishlist"}
            </button>
            <Link className="secondary-button" href={`/products/${product.slug}`}>
              View detail
            </Link>
            <button
              className="primary-button"
              type="button"
              onClick={() => addItem(primaryVariant.id, 1, false)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
