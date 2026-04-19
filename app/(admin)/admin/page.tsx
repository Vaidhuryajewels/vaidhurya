import { SiteShell } from "@/components/site-shell";
import { adminModules, integrationHealth } from "@/lib/commerce-data";

export default function AdminOverviewPage() {
  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Admin"
      pageTitle="Role-based operations and CMS surface"
      pageIntro="This admin view turns the architecture into a visible operating model for catalog, fulfillment, bespoke, and content teams."
    >
      <section className="content-shell stack-lg">
        <div className="feature-grid">
          {adminModules.map((module) => (
            <article className="feature-card" key={module.title}>
              <p className="section-kicker">{module.owner}</p>
              <h2 className="feature-card-title">{module.title}</h2>
              <p>{module.summary}</p>
              <span className="status-chip">{module.status}</span>
            </article>
          ))}
        </div>

        <article className="content-card stack-lg">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">Provider seams</p>
            <h2 className="section-title font-display">Integration health</h2>
          </div>

          <div className="feature-grid">
            {integrationHealth.map((integration) => (
              <article className="feature-card" key={integration.title}>
                <h3 className="feature-card-title">{integration.title}</h3>
                <p>{integration.summary}</p>
                <span className="status-chip">{integration.status}</span>
              </article>
            ))}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
