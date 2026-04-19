"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  computePriceForVariant,
  formatCurrency,
  getProductBySlug,
} from "@/lib/commerce-data";

export function ProductPurchasePanel({ productSlug }: { productSlug: string }) {
  const product = getProductBySlug(productSlug);
  const { addItem, isWishlisted, toggleWishlist } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants[0]?.id ?? "");
  const [giftWrap, setGiftWrap] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");

  if (!product) {
    return null;
  }

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const breakdown = computePriceForVariant(selectedVariant, { giftWrap });

  return (
    <aside className="purchase-panel">
      <div className="purchase-panel-head">
        <span className="product-badge">{product.badge}</span>
        <h2 className="purchase-panel-title font-display">Price lock and payment</h2>
        <p className="purchase-panel-copy">
          Browse-time totals stay dynamic. The payable amount is locked only when the
          checkout session is created.
        </p>
      </div>

      <label className="form-stack" htmlFor="variant">
        <span className="field-label">Variant</span>
        <select
          className="luxury-select"
          id="variant"
          value={selectedVariant.id}
          onChange={(event) => setSelectedVariantId(event.target.value)}
        >
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>

      <label className="toggle-row" htmlFor="gift-wrap">
        <div>
          <span className="field-label">Premium gifting</span>
          <p className="field-help">Gift wrap, keepsake insert, and card-note support.</p>
        </div>
        <input
          checked={giftWrap}
          id="gift-wrap"
          type="checkbox"
          onChange={(event) => setGiftWrap(event.target.checked)}
        />
      </label>

      <div className="breakdown-panel">
        <div className="breakdown-row">
          <span>Metal cost</span>
          <strong>{formatCurrency(breakdown.metalCost)}</strong>
        </div>
        <div className="breakdown-row">
          <span>Making charge</span>
          <strong>{formatCurrency(breakdown.makingCharge)}</strong>
        </div>
        <div className="breakdown-row">
          <span>Stone and finish</span>
          <strong>{formatCurrency(breakdown.stoneCharge)}</strong>
        </div>
        <div className="breakdown-row">
          <span>Packaging</span>
          <strong>{formatCurrency(breakdown.packagingCharge)}</strong>
        </div>
        {giftWrap ? (
          <div className="breakdown-row">
            <span>Gift service</span>
            <strong>{formatCurrency(breakdown.giftWrapCharge)}</strong>
          </div>
        ) : null}
        <div className="breakdown-divider" />
        <div className="breakdown-row is-total">
          <span>Current browse total</span>
          <strong>{formatCurrency(breakdown.subtotal)}</strong>
        </div>
      </div>

      <div className="support-grid">
        <article className="support-card">
          <span className="field-label">Live rate snapshot</span>
          <p>{breakdown.metalRateLabel}</p>
          <p className="field-help">Snapshot {breakdown.snapshotVersion}</p>
        </article>
        <article className="support-card">
          <span className="field-label">Fulfillment note</span>
          <p>{selectedVariant.leadTimeLabel}</p>
          <p className="field-help">{selectedVariant.inventoryLabel}</p>
        </article>
      </div>

      <button
        className="primary-button primary-button-full"
        type="button"
        onClick={() => {
          addItem(selectedVariant.id, 1, giftWrap);
          setAddedMessage("Added to cart. Price will lock at checkout.");
        }}
      >
        Add to cart
      </button>

      <button
        className="secondary-button primary-button-full"
        type="button"
        onClick={() => toggleWishlist(product.slug)}
      >
        {isWishlisted(product.slug) ? "Saved in wishlist" : "Save to wishlist"}
      </button>

      {addedMessage ? <p className="inline-feedback">{addedMessage}</p> : null}
    </aside>
  );
}
