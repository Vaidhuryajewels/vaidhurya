"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

const actions = [
  { href: "/account", label: "Account", shortLabel: "Account" },
  { href: "/track", label: "Track Order", shortLabel: "Track" },
  { href: "/wishlist", label: "Wishlist", shortLabel: "Wishlist" },
  { href: "/cart", label: "Cart", shortLabel: "Cart" },
] as const;

export function HeaderActions() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <div className="header-actions">
      {actions.map((action) => {
        const isActive =
          pathname === action.href || pathname.startsWith(`${action.href}/`);
        const count =
          action.href === "/cart" && cartCount > 0 ? ` (${cartCount})` : "";

        return (
          <Link
            className={`header-action ${isActive ? "is-active" : ""}`}
            href={action.href}
            key={action.href}
          >
            <span className="header-action-label">{action.shortLabel}</span>
            <span className="header-action-meta">{`${action.label}${count}`}</span>
          </Link>
        );
      })}
    </div>
  );
}
