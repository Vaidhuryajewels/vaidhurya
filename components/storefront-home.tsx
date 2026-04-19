import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import { getLaunchDayHomeData } from "@/lib/launch-day-home";

export function StorefrontHome() {
  const launchDay = getLaunchDayHomeData();

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow={launchDay.hero.eyebrow}
      pageTitle={launchDay.hero.title}
      pageIntro={launchDay.hero.intro}
    >
      <section className="home-section">
        <div className="launch-hero">
          <div className="launch-hero-copy">
            <span className="launch-hero-label">{launchDay.hero.label}</span>
            <h2 className="launch-hero-title font-display">{launchDay.hero.heading}</h2>
            <p className="launch-hero-description">{launchDay.hero.description}</p>

            <div className="button-row">
              <Link className="primary-button" href={launchDay.hero.primaryCta.href}>
                {launchDay.hero.primaryCta.label}
              </Link>
              <Link className="secondary-button" href={launchDay.hero.secondaryCta.href}>
                {launchDay.hero.secondaryCta.label}
              </Link>
            </div>

            <div className="launch-stat-grid">
              {launchDay.stats.map((stat) => (
                <article className="launch-stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="launch-hero-visual">
            <div className="launch-image-stage">
              <Image
                className="launch-stage-image"
                src="/bridal-chandraharam-mangalasutra.png"
                alt="Launch day bridal hero necklace"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>

            <Link className="launch-floating-card launch-floating-card-top" href="/collections/brides-collection">
              <span>Ceremonial drop</span>
              <strong>Bride&apos;s Collection</strong>
              <p>Temple silhouettes, certification, and concierge-backed checkout.</p>
            </Link>

            <Link className="launch-floating-card launch-floating-card-bottom" href="/collections/bracelet-collection">
              <span>Gifting edit</span>
              <strong>Everyday signatures</strong>
              <p>Fast-dispatch silver pieces ready for launch-day gifting.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Opening chapters</p>
          <h2 className="section-title font-display">Collections built for the first impression</h2>
          <p className="section-copy">
            The landing page leads with bridal drama, then opens into gifting and everyday
            discovery so launch-day traffic can browse across the full house.
          </p>
        </div>

        <div className="launch-story-grid">
          {launchDay.collections.map((collection) => (
            <Link className="launch-story-card" href={`/collections/${collection.slug}`} key={collection.slug}>
              <div className="launch-story-media">
                <Image
                  className="launch-story-image"
                  src={collection.imageSrc}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </div>
              <div className="launch-story-copy">
                <span className="section-kicker">{collection.kicker}</span>
                <strong className="launch-story-title font-display">{collection.title}</strong>
                <p>{collection.description}</p>
                <span className="launch-story-link">Enter collection</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Now live</p>
          <h2 className="section-title font-display">The first signatures to go live</h2>
          <p className="section-copy">
            Launch-day merchandising keeps one anchor bridal hero, one occasion-ready set,
            and one gifting-friendly silver staple above the fold.
          </p>
        </div>

        <div className="product-grid">
          {launchDay.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Confidence at launch</p>
          <h2 className="section-title font-display">Luxury cues backed by real commerce behavior</h2>
        </div>

        <div className="feature-grid">
          {launchDay.featureCards.map((card) => (
            <article className="feature-card" key={card.title}>
              <h3 className="feature-card-title">{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section launch-bottom-grid">
        <article className="timeline-card launch-moment-card">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">Launch flow</p>
            <h2 className="section-title font-display">How the day unfolds</h2>
          </div>

          <div className="launch-moment-list">
            {launchDay.moments.map((moment) => (
              <div className="launch-moment-row" key={moment.title}>
                <span className="launch-moment-time">{moment.time}</span>
                <div>
                  <strong>{moment.title}</strong>
                  <p>{moment.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="content-card launch-host-card">
          <div className="section-heading section-heading-left">
            <p className="section-kicker">Concierge notes</p>
            <h2 className="section-title font-display">The page should feel hosted, not crowded</h2>
          </div>

          <p className="section-copy">
            Every launch-day block works like an invitation: clear next steps, rich imagery,
            and the reassurance that bespoke, gifting, and checkout are already ready to carry
            the attention the page earns.
          </p>

          <div className="launch-host-list">
            {launchDay.promises.map((promise) => (
              <div className="launch-host-item" key={promise.title}>
                <strong>{promise.title}</strong>
                <p>{promise.copy}</p>
              </div>
            ))}
          </div>

          <div className="button-row">
            <Link className="secondary-button" href="/track">
              Track live orders
            </Link>
            <Link className="primary-button" href="/checkout">
              Open checkout flow
            </Link>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
