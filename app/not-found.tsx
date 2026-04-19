import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Not found"
      pageTitle="This jewelry route doesn't exist yet"
      pageIntro="The architecture is in place, but this specific page or product could not be resolved."
    >
      <section className="content-shell">
        <div className="content-card empty-state-stack">
          <p className="empty-state">
            Return to the storefront or jump into a collection that is already wired up.
          </p>
          <Link className="primary-button" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
