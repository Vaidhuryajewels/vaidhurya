"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { SiteShell } from "@/components/site-shell";
import { calculateCartTotals, formatCurrency } from "@/lib/commerce-data";

type LockResponse = {
  lock: {
    snapshotVersion: string;
    createdAt: string;
    expiresAt: string;
    grandTotal: number;
    lineCount: number;
  };
};

type OrderResponse = {
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    placedAt: string;
    snapshotVersion: string;
    priceLockedAt: string;
    priceLockExpiresAt: string;
    paymentStatus: string;
    orderStatus: string;
    total: number;
    lines: Array<{
      productSlug: string;
      variantId: string;
      title: string;
      variantLabel: string;
      quantity: number;
      lineTotal: number;
      giftWrap: boolean;
    }>;
    shipments: Array<{
      id: string;
      label: string;
      carrier: string;
      trackingNumber: string;
      etaLabel: string;
      status: string;
      events: Array<{
        label: string;
        detail: string;
        at: string;
        location: string;
      }>;
    }>;
    addressSummary: string;
    cardLast4: string;
  };
};

export function CheckoutPageClient() {
  const router = useRouter();
  const { clearCart, items, recordPlacedOrder } = useCart();
  const totals = calculateCartTotals(items);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    cardholderName: "",
    cardNumber: "",
  });
  const [error, setError] = useState("");
  const [lock, setLock] = useState<LockResponse["lock"] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createPriceLock() {
    const response = await fetch("/api/checkout/lock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error("Unable to create a checkout price lock.");
    }

    const body = (await response.json()) as LockResponse;
    setLock(body.lock);

    return body.lock;
  }

  if (totals.lines.length === 0) {
    return (
      <SiteShell
        theme="bridal"
        pageEyebrow="Checkout"
        pageTitle="Checkout is ready when your cart is"
        pageIntro="Add a piece to the cart first, then return here to create a price lock and simulate the secure card flow."
      >
        <section className="content-shell">
          <div className="content-card empty-state-stack">
            <p className="empty-state">No items are currently queued for checkout.</p>
            <Link className="primary-button" href="/">
              Return to storefront
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Checkout"
      pageTitle="Secure card payment and price lock"
      pageIntro="This flow simulates the provider-ready payment seam: checkout locks the current metal snapshot before payment authorization and order creation."
    >
      <section className="content-shell content-grid">
        <div className="content-card stack-lg">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">Guest checkout</p>
            <h2 className="section-title font-display">Delivery and payment details</h2>
          </div>

          <div className="form-grid">
            {[
              ["customerName", "Customer name"],
              ["customerEmail", "Email"],
              ["addressLine", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
              ["cardholderName", "Cardholder name"],
              ["cardNumber", "Card number"],
            ].map(([key, label]) => (
              <label className="form-stack" htmlFor={key} key={key}>
                <span className="field-label">{label}</span>
                <input
                  className="luxury-input"
                  id={key}
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="support-grid">
            <article className="support-card">
              <span className="field-label">Price lock window</span>
              <p>15 minutes once the checkout session is created.</p>
            </article>
            <article className="support-card">
              <span className="field-label">Payment seam</span>
              <p>Card-first, provider-agnostic, and reconciliation-ready.</p>
            </article>
          </div>

          <div className="button-row">
            <button
              className="secondary-button"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                try {
                  setError("");
                  await createPriceLock();
                } catch (lockError) {
                  setError(
                    lockError instanceof Error
                      ? lockError.message
                      : "Unable to create a checkout price lock.",
                  );
                }
              }}
            >
              {lock ? "Refresh price lock" : "Lock today&apos;s price"}
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                if (
                  !form.customerName ||
                  !form.customerEmail ||
                  !form.addressLine ||
                  !form.cardholderName ||
                  !form.cardNumber
                ) {
                  setError("Complete the delivery and card fields before confirming payment.");
                  return;
                }

                setIsSubmitting(true);
                setError("");

                try {
                  const activeLock = lock ?? await createPriceLock();
                  const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      items,
                      checkoutInput: form,
                      lock: activeLock,
                    }),
                  });

                  if (!response.ok) {
                    const body = (await response.json()) as { error?: string };
                    throw new Error(body.error ?? "We couldn't create the order.");
                  }

                  const body = (await response.json()) as OrderResponse;
                  recordPlacedOrder(body.order);
                  clearCart();
                  setForm((current) => ({ ...current, cardNumber: "" }));
                  router.push(`/checkout/confirmation/${body.order.orderNumber}`);
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "We couldn't create the order from the current cart.",
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? "Processing secure checkout…" : "Confirm payment and create order"}
            </button>
          </div>

          {lock ? (
            <p className="inline-feedback">
              Price lock created using snapshot {lock.snapshotVersion}. Payment now uses
              the locked amount unless the session expires at{" "}
              {new Date(lock.expiresAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </p>
          ) : null}
          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <aside className="content-card summary-card">
          <h2 className="section-title font-display">Locked order summary</h2>
          <div className="stack-md">
            {totals.lines.map((line) => (
              <div className="summary-line" key={line.variant.id}>
                <div>
                  <strong>{line.product.title}</strong>
                  <p>{line.variant.label}</p>
                </div>
                <strong>{formatCurrency(line.lineTotal)}</strong>
              </div>
            ))}
          </div>

          <div className="breakdown-panel">
            <div className="breakdown-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(totals.subtotal)}</strong>
            </div>
            <div className="breakdown-row">
              <span>Shipping</span>
              <strong>{formatCurrency(totals.shippingEstimate)}</strong>
            </div>
            <div className="breakdown-divider" />
            <div className="breakdown-row is-total">
              <span>Payable now</span>
              <strong>{formatCurrency(totals.grandTotal)}</strong>
            </div>
          </div>

          <article className="support-card">
            <span className="field-label">Snapshot reference</span>
            <p>{totals.snapshotVersion}</p>
            <p className="field-help">{totals.metalRateLabel}</p>
          </article>
        </aside>
      </section>
    </SiteShell>
  );
}
