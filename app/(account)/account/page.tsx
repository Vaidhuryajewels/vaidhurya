import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function AccountLandingPage() {
  return (
    <SiteShell
      theme="everyday"
      pageEyebrow="Account"
      pageTitle="Customer account and post-purchase hub"
      pageIntro="Guest checkout remains first-class, while this area centralizes order history, tracking, and premium service follow-up."
    >
      <section className="content-shell content-grid">
        <article className="content-card stack-md">
          <p className="section-kicker">What lives here</p>
          <h2 className="section-title font-display">Order, tracking, and return visibility</h2>
          <ul className="luxury-list">
            <li>guest orders can be attached after purchase</li>
            <li>shipment timelines are grouped by package, not flattened</li>
            <li>returns and refunds remain visible alongside order history</li>
          </ul>
        </article>

        <article className="content-card stack-md">
          <p className="section-kicker">Next step</p>
          <h2 className="section-title font-display">Open your orders</h2>
          <p className="section-copy">
            The order list merges seeded sample orders with any orders created through the
            checkout flow in this browser session.
          </p>
          <div className="button-row">
            <Link className="primary-button" href="/account/orders">
              View orders
            </Link>
            <Link className="secondary-button" href="/wishlist">
              Open wishlist
            </Link>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
