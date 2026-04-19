"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { SiteShell } from "@/components/site-shell";
import { calculateCartTotals, formatCurrency } from "@/lib/commerce-data";

export function CartPageClient() {
  const { items, hydrated, removeItem, toggleGiftWrap, updateQuantity } = useCart();
  const totals = calculateCartTotals(items);

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Guest cart"
      pageTitle="Cart and price-watch summary"
      pageIntro="Cart values stay informative while you browse. Checkout creates the protected price lock before payment begins."
    >
      <section className="content-shell content-grid">
        <div className="content-card">
          {!hydrated ? (
            <p className="empty-state">Loading your cart…</p>
          ) : totals.lines.length === 0 ? (
            <div className="empty-state-stack">
              <p className="empty-state">Your cart is empty.</p>
              <Link className="primary-button" href="/">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="stack-lg">
              {totals.lines.map((line) => (
                <article className="cart-line" key={line.variant.id}>
                  <div className="cart-line-copy">
                    <p className="product-badge">{line.product.badge}</p>
                    <h2 className="cart-line-title font-display">{line.product.title}</h2>
                    <p className="cart-line-meta">{line.variant.label}</p>
                    <p className="cart-line-note">{line.variant.leadTimeLabel}</p>
                  </div>

                  <div className="cart-line-controls">
                    <label className="form-stack" htmlFor={`qty-${line.variant.id}`}>
                      <span className="field-label">Qty</span>
                      <select
                        className="luxury-select luxury-select-compact"
                        id={`qty-${line.variant.id}`}
                        value={line.item.quantity}
                        onChange={(event) =>
                          updateQuantity(line.variant.id, Number(event.target.value))
                        }
                      >
                        {[1, 2, 3, 4].map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="toggle-row toggle-row-compact" htmlFor={`gift-${line.variant.id}`}>
                      <span>Gift wrap</span>
                      <input
                        checked={line.item.giftWrap}
                        id={`gift-${line.variant.id}`}
                        type="checkbox"
                        onChange={(event) =>
                          toggleGiftWrap(line.variant.id, event.target.checked)
                        }
                      />
                    </label>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => removeItem(line.variant.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-line-total">
                    <strong>{formatCurrency(line.lineTotal)}</strong>
                    <span>{line.breakdown.snapshotVersion}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="content-card summary-card">
          <h2 className="section-title font-display">Summary</h2>
          <div className="breakdown-panel">
            <div className="breakdown-row">
              <span>Items</span>
              <strong>{totals.totalQuantity}</strong>
            </div>
            <div className="breakdown-row">
              <span>Browse subtotal</span>
              <strong>{formatCurrency(totals.subtotal)}</strong>
            </div>
            <div className="breakdown-row">
              <span>Shipping estimate</span>
              <strong>{formatCurrency(totals.shippingEstimate)}</strong>
            </div>
            <div className="breakdown-divider" />
            <div className="breakdown-row is-total">
              <span>Estimated total</span>
              <strong>{formatCurrency(totals.grandTotal)}</strong>
            </div>
          </div>

          <div className="support-grid">
            <article className="support-card">
              <span className="field-label">Live rate snapshot</span>
              <p>{totals.metalRateLabel}</p>
              <p className="field-help">{totals.snapshotVersion}</p>
            </article>
            <article className="support-card">
              <span className="field-label">Checkout rule</span>
              <p>Price locks during checkout for 15 minutes before payment authorization.</p>
            </article>
          </div>

          <Link className="primary-button primary-button-full" href="/checkout">
            Proceed to checkout
          </Link>
        </aside>
      </section>
    </SiteShell>
  );
}
