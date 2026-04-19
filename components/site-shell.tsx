import Image from "next/image";
import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";
import {
  announcementByTheme,
  navigationLinks,
  type ThemeKey,
} from "@/lib/commerce-data";
import type { ReactNode } from "react";

type SiteShellProps = {
  theme: ThemeKey;
  children: ReactNode;
  pageTitle?: string;
  pageIntro?: string;
  pageEyebrow?: string;
};

export function SiteShell({
  theme,
  children,
  pageTitle,
  pageIntro,
  pageEyebrow,
}: SiteShellProps) {
  return (
    <div className="site-shell" data-theme={theme}>
      <div className="announcement-bar">
        <div className="announcement-inner">
          {announcementByTheme[theme].map((line) => (
            <span className="announcement-chip" key={line}>
              {line}
            </span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand-lockup" href="/" aria-label="VAIDHURYA home">
            <Image
              className="brand-logo"
              src="/vaidhurya-logo.png"
              alt="VAIDHURYA logo"
              width={220}
              height={90}
              priority
            />
          </Link>

          <div className="header-search-shell">
            <span className="header-search-label">Find bridal sets, gifting edits, or atelier pieces</span>
            <span className="header-search-value">
              Dynamic rates. Certified pieces. Tracked delivery.
            </span>
          </div>

          <HeaderActions />
        </div>

        <div className="site-nav-row">
          <nav className="site-nav" aria-label="Primary">
            {navigationLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="theme-pill">
            <span className="theme-pill-label">Theme</span>
            <strong>{theme === "bridal" ? "Bridal Atelier" : "Everyday Salon"}</strong>
          </div>
        </div>

        {pageTitle ? (
          <div className="page-hero">
            {pageEyebrow ? <p className="page-hero-kicker">{pageEyebrow}</p> : null}
            <h1 className="page-hero-title font-display">{pageTitle}</h1>
            {pageIntro ? <p className="page-hero-copy">{pageIntro}</p> : null}
          </div>
        ) : null}
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <p className="site-footer-kicker">Premium Commerce</p>
            <h2 className="site-footer-title font-display">VAIDHURYA</h2>
            <p className="site-footer-copy">
              Premium jewelry storefront with dynamic pricing, price-locked checkout,
              tracked shipments, and concierge-ready bespoke flows.
            </p>
          </div>
          <div>
            <p className="site-footer-list-title">Commerce pillars</p>
            <ul className="site-footer-list">
              <li>Card-first checkout with protected price locks</li>
              <li>Split-shipment tracking for atelier and ready-stock items</li>
              <li>Certification, gifting, and premium care guidance</li>
            </ul>
          </div>
          <div>
            <p className="site-footer-list-title">Routes</p>
            <ul className="site-footer-list">
              <li>
                <Link href="/collections/brides-collection">Browse collections</Link>
              </li>
              <li>
                <Link href="/checkout">Go to checkout</Link>
              </li>
              <li>
                <Link href="/admin">Open admin overview</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
