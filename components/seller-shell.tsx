"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SellerPwaRegister } from "./seller-pwa-register";
import { createClient } from "@/utils/supabase/client";
import { products } from "@/lib/commerce-data";

const links = [
  { href: "/seller", label: "Dashboard", icon: "⌂" },
  { href: "/seller/inbox", label: "Inbox", icon: "✦" },
  { href: "/seller/listings", label: "Listings", icon: "◇" },
];

const routeNavigation: Record<string, { backHref: string; backLabel: string; crumbs: Array<{ href?: string; label: string }> }> = {
  "/seller": { backHref: "/", backLabel: "Storefront", crumbs: [{ label: "Dashboard" }] },
  "/seller/inbox": { backHref: "/seller", backLabel: "Dashboard", crumbs: [{ href: "/seller", label: "Dashboard" }, { label: "Inbox" }] },
  "/seller/listings": { backHref: "/seller", backLabel: "Dashboard", crumbs: [{ href: "/seller", label: "Dashboard" }, { label: "Listings" }] },
  "/seller/listings/new": { backHref: "/seller/listings", backLabel: "Listings", crumbs: [{ href: "/seller", label: "Dashboard" }, { href: "/seller/listings", label: "Listings" }, { label: "Add listing" }] },
};

export function SellerShell({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow: string }) {
  const pathname = usePathname();
  const routeNav = routeNavigation[pathname] ?? (pathname.startsWith("/seller/listings/") ? { backHref: "/seller/listings", backLabel: "Listings", crumbs: [{ href: "/seller", label: "Dashboard" }, { href: "/seller/listings", label: "Listings" }, { label: "Listing details" }] } : routeNavigation["/seller"]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("VAIDHURYA Seller");
  const [role, setRole] = useState("Seller");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "VS";

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      setName(String(data.user.user_metadata.display_name || data.user.email?.split("@")[0] || "VAIDHURYA Seller"));
      setRole(String(data.user.user_metadata.role_label || "Seller"));
    });
  }, []);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) { setNotice("Profile saved on this device."); setProfileOpen(false); return; }
    const { error } = await supabase.auth.updateUser({ data: { display_name: name.trim(), role_label: role.trim() } });
    if (error) { setNotice(error.message); return; }
    setNotice("Profile updated.");
    setProfileOpen(false);
  }

  async function signOut() {
    await createClient()?.auth.signOut();
    window.location.assign("/seller/login");
  }
  return <div className="seller-app">
    <SellerPwaRegister />
    <aside className="seller-sidebar">
      <Link href="/seller" className="seller-brand"><Image src="/vaidhurya-logo.png" alt="VAIDHURYA" width={180} height={70} /></Link>
      <p className="seller-workspace">Seller workspace</p>
      <nav aria-label="Seller navigation">{links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}><span>{link.icon}</span>{link.label}</Link>)}</nav>
      <button className="seller-profile" onClick={() => { setNotice(""); setProfileOpen(true); }} aria-label="Edit seller profile"><span>{initials}</span><div><strong>{name}</strong><small>{role}</small></div><b>›</b></button>
    </aside>
    <main className="seller-main">
      <header className="seller-topbar"><Link className="seller-topbar-logo" href="/seller"><Image src="/vaidhurya-logo.png" alt="VAIDHURYA Seller" width={150} height={58} /></Link><div className="seller-live-count"><i /><strong>{products.length}</strong><span>Live listings</span></div><button className="seller-topbar-profile" onClick={() => setProfileOpen(true)} aria-label="Open seller profile"><span>{initials}</span><div><strong>{name}</strong><small>{role}</small></div></button></header>
      <div className="seller-page-heading"><p>{eyebrow}</p><h1>{title}</h1></div>
      <div className="seller-route-nav"><Link className="seller-back-link" href={routeNav.backHref} aria-label={`Back to ${routeNav.backLabel}`}><span>←</span>{routeNav.backLabel}</Link><nav className="seller-breadcrumbs" aria-label="Breadcrumb"><Link href="/seller">Seller</Link>{routeNav.crumbs.map((crumb, index) => <span key={`${crumb.label}-${index}`}><b>/</b>{crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <em aria-current="page">{crumb.label}</em>}</span>)}</nav></div>
      {children}
    </main>
    <nav className="seller-bottom-nav" aria-label="Mobile seller navigation">{links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}><span>{link.icon}</span><small>{link.label}</small></Link>)}</nav>
    {profileOpen ? <div className="profile-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileOpen(false); }}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><header><div><p className="seller-kicker">Seller account</p><h2 id="profile-title">Edit profile</h2></div><button onClick={() => setProfileOpen(false)} aria-label="Close profile editor">×</button></header><div className="profile-avatar">{initials}</div><form onSubmit={saveProfile}><label>Display name<input value={name} required onChange={(event) => setName(event.target.value)} /></label><label>Role title<input value={role} required onChange={(event) => setRole(event.target.value)} /></label><label>Email<input value={email} disabled placeholder="Signed-in email" /></label>{notice ? <p role="status">{notice}</p> : null}<button className="seller-primary" type="submit">Save profile</button><button className="profile-signout" type="button" onClick={signOut}>Sign out of seller app</button></form></section></div> : null}
  </div>;
}
