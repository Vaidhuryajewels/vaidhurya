"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { featuredBespokeServices } from "@/lib/commerce-data";

export function BespokePageClient() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Bespoke"
      pageTitle="Inquiry-led bespoke jewelry flow"
      pageIntro="This page implements the assisted-sales side of the architecture: inquiry capture, admin quote revision, and quote-led payment."
    >
      <section className="content-shell content-grid">
        <div className="content-card stack-lg">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">Custom request intake</p>
            <h2 className="section-title font-display">Start a bespoke brief</h2>
            <p className="section-copy">
              Customers submit intent here. Operations and merchandising convert the brief
              into quote revisions and, once accepted, into the shared order system.
            </p>
          </div>

          <div className="form-grid">
            {["Occasion", "Category", "Budget range", "Reference notes"].map((label) => (
              <label className="form-stack" htmlFor={label} key={label}>
                <span className="field-label">{label}</span>
                {label === "Reference notes" ? (
                  <textarea className="luxury-input luxury-textarea" id={label} rows={5} />
                ) : (
                  <input className="luxury-input" id={label} />
                )}
              </label>
            ))}
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => setSubmitted(true)}
          >
            Submit bespoke inquiry
          </button>

          {submitted ? (
            <p className="inline-feedback">
              Inquiry captured. In the full architecture this would create a
              `CustomOrderRequest` for admin quote handling.
            </p>
          ) : null}
        </div>

        <aside className="content-card stack-lg">
          <h2 className="section-title font-display">What operations will do next</h2>
          <div className="feature-grid feature-grid-single">
            {featuredBespokeServices.map((service) => (
              <article className="feature-card" key={service}>
                <h3 className="feature-card-title">{service}</h3>
                <p>
                  Routed into quote revision, timeline planning, and payment-link generation.
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
