"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  collections,
  computePriceForVariant,
  formatCurrency,
  getProductsForTheme,
  type Product,
  type ThemeKey,
} from "@/lib/commerce-data";
import styles from "./original-poc-static.module.css";

type NavItem = {
  href: string;
  label: string;
};

type CategoryItem = {
  href: string;
  label: string;
  imageSrc: string;
};

type ProductPreview = {
  key: string;
  productHref: string;
  variantId: string;
  name: string;
  imageSrc: string;
  hoverImageSrc?: string;
  imagePosition?: string;
  imageScale?: number;
  hoverImagePosition?: string;
  hoverImageScale?: number;
  price: string;
  priceMeta?: string;
  imagePriceTag?: string;
  mediaBadge?: string;
  hideInlinePrice?: boolean;
  weight?: string;
};

type ThemeContent = {
  launchStrip: string[];
  searchText: string;
  navItems: NavItem[];
  categories: CategoryItem[];
  sectionKicker: string;
  sectionTitle: string;
  secondarySection?: {
    id: string;
    kicker: string;
    title: string;
    products: ProductPreview[];
  };
  poster: {
    material: string;
    occasion?: string;
    campaign?: string;
    divider: string;
    date?: string;
  };
  products: ProductPreview[];
};

type HeaderAction = {
  label: "ACCOUNT" | "WISHLIST" | "CART";
  href: string;
};

const WHATSAPP_NUMBER = "917026651789";

function SearchGlyph() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20 20" />
    </svg>
  );
}

function WhatsappGlyph() {
  return (
    <svg className={styles.whatsappIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.56a8.02 8.02 0 0 1-11.86 7.05L4 20l1.47-4.02A8 8 0 1 1 20 11.56Z" />
      <path d="M9.32 7.9c.2-.44.42-.45.63-.46h.42c.14 0 .36.03.56.47.19.44.66 1.53.72 1.65.06.13.1.29.02.46-.08.17-.13.28-.25.42-.12.14-.25.31-.36.42-.12.13-.25.27-.1.52.14.25.65 1.08 1.4 1.75.96.86 1.77 1.14 2.02 1.27.25.13.4.11.54-.07.15-.18.63-.73.8-.98.17-.25.34-.21.57-.12.24.08 1.49.7 1.75.82.25.13.42.19.48.29.06.11.06.63-.15 1.22-.21.59-1.22 1.16-1.69 1.23-.46.07-1.04.11-1.68-.1-.39-.13-.9-.3-1.55-.58-2.71-1.18-4.47-4.09-4.61-4.28-.14-.19-1.1-1.47-1.1-2.81 0-1.34.7-2 1-2.27Z" />
    </svg>
  );
}

const BRIDAL_NAV_ITEMS: NavItem[] = [
  { href: "#brides-collection", label: "Bride's Collection" },
  { href: "#grooms-collection", label: "Groom's Collection" },
  { href: "#victorian-jewellery", label: "Victorian Jewellery" },
  { href: "#jadayu-kundan", label: "Jadayu Kundan" },
  { href: "#gift", label: "Gift" },
];

const BRIDAL_CATEGORY_ITEMS: CategoryItem[] = [
  {
    href: "#brides-collection",
    label: "Bride's Collection",
    imageSrc: "/category-brides-collection.png",
  },
  {
    href: "#grooms-collection",
    label: "Groom's Collection",
    imageSrc: "/category-grooms-collection.png",
  },
  {
    href: "#victorian-jewellery",
    label: "Victorian Jewellery",
    imageSrc: "/category-victorian-jewellery.png",
  },
  {
    href: "#jadayu-kundan",
    label: "Jadayu Kundan",
    imageSrc: "/category-jadayu-kundan.png",
  },
  {
    href: "#gift",
    label: "Gift",
    imageSrc: "/category-gift.png",
  },
];

const BRIDAL_PRODUCTS: ProductPreview[] = [
  {
    key: "chandraharam",
    productHref: "/products/chandraharam-mangalasutra",
    variantId: "v-chandra-heirloom",
    name: "Chandraharam Mangalasutra",
    imageSrc: "/bridal-chandraharam-mangalasutra.png",
    hoverImageSrc: "/bridal-chandraharam-mangalasutra-hover.png",
    imagePosition: "center 60%",
    imageScale: 1.14,
    hoverImagePosition: "center 58%",
    hoverImageScale: 1.12,
    price: "23,793/-",
    imagePriceTag: "23,793/-",
    hideInlinePrice: true,
    weight: "Wt: 42gm",
  },
  {
    key: "lakshmi-gutta",
    productHref: "/products/lakshmi-gutta-set",
    variantId: "v-lakshmi-classic",
    name: "Lakshmi gutha pusa neclace + Ear rings",
    imageSrc: "/bridal-piece-2.png",
    hoverImageSrc: "/bridal-piece-2-hover.png",
    imagePosition: "center 24%",
    imageScale: 1.06,
    hoverImagePosition: "center 22%",
    hoverImageScale: 1.04,
    price: "42,895/-",
    imagePriceTag: "42,895/-",
    hideInlinePrice: true,
    weight: "Wt: 78gm",
  },
  {
    key: "floral-crystal",
    productHref: "/products/floral-crystal-necklace",
    variantId: "v-floral-daylight",
    name: "white flowral crystal neclace + ear rings",
    imageSrc: "/bridal-piece-3.png",
    hoverImageSrc: "/bridal-piece-3-hover.png",
    imagePosition: "center 20%",
    imageScale: 1.04,
    hoverImagePosition: "center 18%",
    hoverImageScale: 1.04,
    price: "17,069/-",
    imagePriceTag: "17,069/-",
    hideInlinePrice: true,
    weight: "Wt: 31gms",
  },
];

const VICTORIAN_PRODUCTS: ProductPreview[] = [
  {
    key: "victorian-polki",
    productHref: "/products/victorian-polki-set",
    variantId: "v-victorian-salon",
    name: "Lakshmi Victorian Maangtika",
    imageSrc: "/bridal-piece-4.jpeg",
    hoverImageSrc: "/victorian-polki-secondary.png",
    imagePosition: "center 18%",
    imageScale: 1.06,
    hoverImagePosition: "center top",
    hoverImageScale: 1.34,
    price: "9,900/-",
    priceMeta: "inc GST",
    imagePriceTag: "9,900/-",
    hideInlinePrice: true,
    weight: "Wt: 18gms",
  },
];

const HEADER_ACTIONS: HeaderAction[] = [
  { label: "ACCOUNT", href: "/account" },
  { label: "WISHLIST", href: "/wishlist" },
  { label: "CART", href: "/cart" },
];

function ActionGlyph({ label }: { label: HeaderAction["label"] }) {
  if (label === "ACCOUNT") {
    return (
      <svg
        className={styles.actionGlyphIcon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        data-poc-action-icon={label.toLowerCase()}
      >
        <circle cx="12" cy="8.25" r="3.25" />
        <path d="M5.75 18.25C7.1 15.78 9.17 14.5 12 14.5s4.9 1.28 6.25 3.75" />
      </svg>
    );
  }

  if (label === "WISHLIST") {
    return (
      <svg
        className={styles.actionGlyphIcon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        data-poc-action-icon={label.toLowerCase()}
      >
        <path d="M12 18.75 5.8 12.72a3.83 3.83 0 0 1 0-5.44 3.91 3.91 0 0 1 5.5 0L12 7.98l.7-.7a3.91 3.91 0 0 1 5.5 0 3.83 3.83 0 0 1 0 5.44Z" />
      </svg>
    );
  }

  return (
    <svg
      className={styles.actionGlyphIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-poc-action-icon={label.toLowerCase()}
    >
      <path d="M8.25 8.5V7.75a3.75 3.75 0 1 1 7.5 0v.75" />
      <path d="M6.25 8.5h11.5l-.82 9.25a1.5 1.5 0 0 1-1.49 1.37H8.56a1.5 1.5 0 0 1-1.49-1.37Z" />
      <path d="M10 12.25h.01M14 12.25h.01" />
    </svg>
  );
}

function UtilityTools({ searchText }: { searchText: string }) {
  return (
    <div className={styles.headerTools}>
      <div className={styles.toolCard}>
        <span className={styles.toolIcon} aria-hidden="true" />
        <div className={styles.toolCopy}>
          <span className={styles.toolTitle}>Where to Deliver?</span>
          <span className={styles.toolBody}>Select Delivery Location</span>
        </div>
        <span className={styles.toolChevron} aria-hidden="true">
          ▾
        </span>
      </div>

      <div className={styles.searchCard}>
        <span className={styles.searchText}>{searchText}</span>
        <SearchGlyph />
      </div>
    </div>
  );
}

function UtilityActions() {
  return (
    <div className={styles.actionGrid}>
      {HEADER_ACTIONS.map((action) => (
        <Link className={styles.actionItem} href={action.href} key={action.label}>
          <span className={styles.actionGlyph} aria-hidden="true">
            <ActionGlyph label={action.label} />
          </span>
          <span className={styles.actionLabel}>{action.label}</span>
        </Link>
      ))}
    </div>
  );
}

function buildPreviewFromProduct(product: Product): ProductPreview {
  const variant = product.variants[0];
  const priceOverrides: Partial<Record<Product["slug"], string>> = {
    "celestial-cuff-bracelet": "₹2,299",
    "moonlit-anklet-pair": "₹3,000",
    "dual-tone-pendant-chain": "₹2,500",
  };
  const price = priceOverrides[product.slug] ?? formatCurrency(computePriceForVariant(variant).subtotal);
  const mediaBadge = product.slug === "moonlit-anklet-pair" || product.slug === "dual-tone-pendant-chain"
    ? "Sold Out"
    : undefined;

  return {
    key: product.slug,
    productHref: `/products/${product.slug}`,
    variantId: variant.id,
    name: product.title,
    imageSrc: product.imageSrc,
    hoverImageSrc: product.hoverImageSrc,
    price,
    mediaBadge,
    weight: `Wt: ${variant.weightGrams}gm`,
  };
}

function buildEverydayNavItems(): NavItem[] {
  return collections
    .filter((collection) => collection.theme === "everyday")
    .map((collection) => ({
      href: `/collections/${collection.slug}`,
      label: collection.title,
    }));
}

function buildEverydayCategories(): CategoryItem[] {
  return [
    ...collections
    .filter((collection) => collection.theme === "everyday")
    .map((collection) => ({
      href: `/collections/${collection.slug}`,
      label: collection.title,
      imageSrc: collection.imageSrc,
    })),
    {
      href: "#for-him",
      label: "For Him",
      imageSrc: "/category-for-him.png",
    },
    {
      href: "#for-her",
      label: "For Her",
      imageSrc: "/category-for-her.png",
    },
  ];
}

function buildEverydayProducts(): ProductPreview[] {
  return [
    {
      key: "poc-nose-pin",
      productHref: "#nose-pin",
      variantId: "v-poc-nose-pin",
      name: "Nose Pin",
      imageSrc: "/everyday-nose-pin.png",
      price: "₹321",
    },
    ...getProductsForTheme("everyday").map(buildPreviewFromProduct),
  ];
}

const THEME_CONTENT: Record<ThemeKey, ThemeContent> = {
  bridal: {
    launchStrip: [
      "Pan India Free Shipping",
      "Akshaya Tritiya Launch",
      "Gold-Coated 925 Silver",
    ],
    searchText: 'Search "Bridal Sets"',
    navItems: BRIDAL_NAV_ITEMS,
    categories: BRIDAL_CATEGORY_ITEMS,
    sectionKicker: "Bridal Collection",
    sectionTitle: "Bride's Collection",
    poster: {
      material: "GOLD-COATED 925 SILVER",
      occasion: "AKSHAYA TRITIYA",
      divider: "GRAND LAUNCH",
      date: "APRIL 19, 2026",
    },
    products: BRIDAL_PRODUCTS,
    secondarySection: {
      id: "victorian-jewellery",
      kicker: "Victorian Collection",
      title: "Victorian Jewellery",
      products: VICTORIAN_PRODUCTS,
    },
  },
  everyday: {
    launchStrip: [
      "Pan India Free Shipping",
      "Everyday Elegance",
      "925 Sterling Silver",
    ],
    searchText: 'Search "Silver Bracelets"',
    navItems: buildEverydayNavItems(),
    categories: buildEverydayCategories(),
    sectionKicker: "Everyday Collection",
    sectionTitle: "Everyday Elegance",
    poster: {
      material: "925 STERLING SILVER",
      campaign: "AKSHAYA TRITIYA",
      divider: "GRAND LAUNCH",
    },
    products: buildEverydayProducts(),
  },
};

function PreviewCard({
  item,
}: {
  item: ProductPreview;
}) {
  const productAnchor = `product-${item.key}`;
  const primaryImageScale = item.imageScale ?? 1;
  const hoverImageSrc = item.hoverImageSrc ?? item.imageSrc;
  const hoverImagePosition = item.hoverImagePosition ?? item.imagePosition;
  const hoverImageScale = item.hoverImageScale ?? (item.hoverImageSrc ? item.imageScale : primaryImageScale * 1.2);
  const hoverImageStyle = {
    objectPosition: hoverImagePosition,
    "--product-base-scale": String(primaryImageScale),
    "--product-hover-scale": String(hoverImageScale ?? primaryImageScale),
  } as CSSProperties;
  const productPageLink = `/poc#${productAnchor}`;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello VAIDHURYA, I'm interested in ${item.name}.
Value: ${item.price}
Page link: ${productPageLink}`,
  )}`;

  return (
    <article className={styles.productCard} id={productAnchor}>
      <Link className={styles.productMedia} href={item.productHref}>
        <Image
          className={`${styles.productImage} ${styles.productPrimaryHidden}`}
          src={item.imageSrc}
          alt={item.name || "VAIDHURYA jewellery piece"}
          fill
          sizes="(max-width: 840px) 32vw, 28vw"
          style={{
            objectPosition: item.imagePosition,
            transform: item.imageScale ? `scale(${item.imageScale})` : undefined,
          }}
        />
        <Image
          className={`${styles.productImage} ${styles.productHoverVisible}`}
          src={hoverImageSrc}
          alt=""
          fill
          sizes="(max-width: 840px) 32vw, 28vw"
          style={hoverImageStyle}
        />
        {item.imagePriceTag ? <span className={styles.productImageTag}>{item.imagePriceTag}</span> : null}
        {item.mediaBadge ? <span className={styles.productMediaBadge}>{item.mediaBadge}</span> : null}
      </Link>

      <div className={styles.productCopy}>
        {item.name ? <div className={styles.productName}>{item.name}</div> : null}
        {!item.hideInlinePrice ? (
          <div className={styles.productPriceRow}>
            <div className={styles.productPrice}>{item.price}</div>
            {item.priceMeta ? <span className={styles.productPriceMeta}>{item.priceMeta}</span> : null}
          </div>
        ) : null}
        {item.weight ? <div className={styles.productWeight}>{item.weight}</div> : null}
        <a
          className={styles.productWhatsappButton}
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsappGlyph />
          <span>Order now</span>
        </a>
      </div>
    </article>
  );
}

export function OriginalPocStatic() {
  const [theme, setTheme] = useState<ThemeKey>("bridal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoryCarouselRef = useRef<HTMLDivElement | null>(null);
  const [categoryScrollState, setCategoryScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });
  const content = THEME_CONTENT[theme];

  useEffect(() => {
    const node = categoryCarouselRef.current;

    if (!node) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);

      setCategoryScrollState({
        canScrollLeft: node.scrollLeft > 8,
        canScrollRight: maxScrollLeft > 8 && node.scrollLeft < maxScrollLeft - 8,
      });
    };

    node.scrollLeft = 0;
    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [theme]);

  const scrollCategoryCarousel = (direction: "left" | "right") => {
    const node = categoryCarouselRef.current;

    if (!node) {
      return;
    }

    const firstCard = node.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(node).columnGap || window.getComputedStyle(node).gap || "0") || 0;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
    const distance = Math.max((cardWidth + gap) * 2, node.clientWidth * 0.82);

    node.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.page} data-poc-theme={theme} data-theme={theme}>
      <div className={styles.launchStrip}>
        {content.launchStrip.map((item, index) => (
          <span key={item}>
            {index > 0 ? <span className={styles.launchDot}>• </span> : null}
            {item}
          </span>
        ))}
      </div>

      <header className={styles.headerShell}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <Link className={styles.logoWrap} href="/poc" aria-label="VAIDHURYA poc">
              <Image
                className={styles.logoImage}
                src="/vaidhurya-logo.png"
                alt="VAIDHURYA logo"
                fill
                sizes="220px"
                priority
              />
            </Link>

            <div className={styles.desktopUtilityTools}>
              <UtilityTools searchText={content.searchText} />
            </div>

            <div className={styles.headerTopActions}>
              <button
                aria-controls="poc-mobile-menu"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className={styles.menuButton}
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <span className={styles.menuButtonBars} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.menuButtonLabel}>Menu</span>
              </button>

              <div className={styles.desktopActionGrid}>
                <UtilityActions />
              </div>
            </div>
          </div>

          <div
            className={`${styles.mobileMenuPanel} ${mobileMenuOpen ? styles.mobileMenuPanelOpen : ""}`}
            data-poc-mobile-menu={mobileMenuOpen ? "open" : "closed"}
            id="poc-mobile-menu"
          >
            <UtilityTools searchText={content.searchText} />
            <UtilityActions />
          </div>

          <div className={styles.headerDivider} />

          <div className={styles.navRow}>
            <nav className={styles.topNav} aria-label="Original POC collections">
              {content.navItems.map((item) => (
                <a href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={styles.modeToggle} role="tablist" aria-label="Shopping mode">
              <button
                className={`${styles.modeButton} ${theme === "bridal" ? styles.modeButtonActive : ""}`}
                type="button"
                role="tab"
                aria-selected={theme === "bridal"}
                onClick={() => setTheme("bridal")}
              >
                Bridal
              </button>
              <button
                className={`${styles.modeButton} ${theme === "everyday" ? styles.modeButtonActive : ""}`}
                type="button"
                role="tab"
                aria-selected={theme === "everyday"}
                onClick={() => setTheme("everyday")}
              >
                Everyday Elegance
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.shell}>
        <section className={styles.poster} aria-label="Launch poster">
          <p className={styles.posterBrand}>VAIDHURYA</p>
          <p className={styles.posterMaterial}>{content.poster.material}</p>
          {content.poster.occasion ? <p className={styles.posterOccasion}>{content.poster.occasion}</p> : null}
          {content.poster.campaign ? <p className={styles.posterCampaign}>{content.poster.campaign}</p> : null}
          <p className={styles.posterDivider}>{content.poster.divider}</p>
          {content.poster.date ? <p className={styles.posterDate}>{content.poster.date}</p> : null}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Curated Collections</p>
            <h1 className={styles.sectionTitle}>Shop by Category</h1>
          </div>

          <div className={styles.categoryScrollerShell}>
            <div className={styles.categoryGrid} data-poc-category-carousel="true" ref={categoryCarouselRef}>
              {content.categories.map((item) => (
                <a className={styles.categoryCard} href={item.href} key={item.label}>
                  <div className={styles.categoryMedia}>
                    <Image
                      className={styles.categoryImage}
                      src={item.imageSrc}
                      alt={item.label}
                      fill
                      sizes="(max-width: 840px) 45vw, 16vw"
                    />
                  </div>
                  <span className={styles.categoryLabel}>{item.label}</span>
                </a>
              ))}
            </div>

            <button
              aria-label="Scroll categories left"
              className={`${styles.categoryScrollButton} ${styles.categoryScrollButtonLeft} ${categoryScrollState.canScrollLeft ? "" : styles.categoryScrollButtonHidden}`}
              type="button"
              onClick={() => scrollCategoryCarousel("left")}
            >
              <span className={styles.categoryScrollArrow} aria-hidden="true">
                ←
              </span>
            </button>

            <button
              aria-label="Scroll categories right"
              className={`${styles.categoryScrollButton} ${styles.categoryScrollButtonRight} ${categoryScrollState.canScrollRight ? "" : styles.categoryScrollButtonHidden}`}
              type="button"
              onClick={() => scrollCategoryCarousel("right")}
            >
              <span className={styles.categoryScrollArrow} aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </section>

        <section className={styles.section} id={theme === "bridal" ? "brides-collection" : "bracelet-collection"}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>{content.sectionKicker}</p>
            <h2 className={styles.sectionTitle}>{content.sectionTitle}</h2>
          </div>

          <div className={styles.productGrid}>
            {content.products.map((item) => (
              <PreviewCard item={item} key={item.key} />
            ))}
          </div>
        </section>

        {content.secondarySection ? (
          <section className={styles.section} id={content.secondarySection.id}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>{content.secondarySection.kicker}</p>
              <h2 className={styles.sectionTitle}>{content.secondarySection.title}</h2>
            </div>

            <div className={styles.singleCardRow}>
              {content.secondarySection.products.map((item) => (
                <PreviewCard item={item} key={item.key} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
