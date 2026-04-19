import { SiteShell } from "@/components/site-shell";
import { cmsSections } from "@/lib/commerce-data";

export default function AdminCmsPage() {
  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Admin • CMS"
      pageTitle="Content blocks and premium storytelling"
      pageIntro="CMS changes are constrained to themed section types so editorial updates never break the established luxury design system."
    >
      <section className="content-shell stack-lg">
        <div className="feature-grid">
          {cmsSections.map((section) => (
            <article className="feature-card" key={section.id}>
              <p className="section-kicker">
                {section.theme} • {section.placement}
              </p>
              <h2 className="feature-card-title">{section.title}</h2>
              <p>{section.summary}</p>
              <span className="status-chip">{section.status}</span>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
