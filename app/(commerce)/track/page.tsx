import { Suspense } from "react";
import { SiteShell } from "@/components/site-shell";
import { TrackPageClient } from "@/components/track-page-client";

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackPageFallback />}>
      <TrackPageClient />
    </Suspense>
  );
}

function TrackPageFallback() {
  return (
    <SiteShell
      theme="everyday"
      pageEyebrow="Tracking"
      pageTitle="Track an order or shipment"
      pageIntro="Search by order number to see split-package updates, status transitions, and carrier references."
    >
      <section className="content-shell stack-lg">
        <div className="content-card empty-state-stack">
          <p className="empty-state">Loading tracking updates…</p>
        </div>
      </section>
    </SiteShell>
  );
}
