"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import styles from "./bridal-legacy-collection.module.css";

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
  weight?: string;
};

const ANNOUNCEMENTS = [
  "Pan India Free Shipping",
  "Dynamic Metal Pricing",
  "Certification With Every Bridal Set",
];

const NAV_ITEMS: NavItem[] = [
  { href: "#brides-collection", label: "Bride's Collection" },
  { href: "#grooms-collection", label: "Groom's Collection" },
  { href: "#victorian-jewellery", label: "Victorian Jewellery" },
  { href: "#jadayu-kundan", label: "Jadayu Kundan" },
  { href: "#gift", label: "Gift" },
];

const CATEGORY_ITEMS: CategoryItem[] = [
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
    price: "18,889/-",
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
    price: "35,669/-",
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
    price: "15,639/-",
    weight: "Wt: 31gms",
  },
];

const VICTORIAN_PRODUCTS: ProductPreview[] = [
  {
    key: "victorian-polki",
    productHref: "/products/victorian-polki-set",
    variantId: "v-victorian-salon",
    name: "",
    imageSrc: "/bridal-piece-4.jpeg",
    imagePosition: "center 18%",
    imageScale: 1.06,
    price: "Price to be added",
  },
];

function PreviewCard({
  item,
  onAddToCart,
}: {
  item: ProductPreview;
  onAddToCart: (variantId: string) => void;
}) {
  return (
    <article className={styles.productCard}>
      <Link className={styles.productMedia} href={item.productHref}>
        <Image
          className={`${styles.productImage} ${styles.productPrimaryHidden}`}
          src={item.imageSrc}
          alt={item.name || "Victorian jewellery piece"}
          fill
          sizes="(max-width: 840px) 32vw, 28vw"
          style={{
            objectPosition: item.imagePosition,
            transform: item.imageScale ? `scale(${item.imageScale})` : undefined,
          }}
        />
        {item.hoverImageSrc ? (
          <Image
            className={`${styles.productImage} ${styles.productHoverVisible}`}
            src={item.hoverImageSrc}
            alt=""
            fill
            sizes="(max-width: 840px) 32vw, 28vw"
            style={{
              objectPosition: item.hoverImagePosition,
              transform: item.hoverImageScale ? `scale(${item.hoverImageScale})` : undefined,
            }}
          />
        ) : null}
      </Link>

      <div className={styles.productCopy}>
        {item.name ? <div className={styles.productName}>{item.name}</div> : null}
        <div className={styles.productPrice}>{item.price}</div>
        {item.weight ? <div className={styles.productWeight}>{item.weight}</div> : null}
        <button
          className={styles.productButton}
          type="button"
          onClick={() => onAddToCart(item.variantId)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export function BridalLegacyCollection() {
  const { addItem } = useCart();

  const handleAddToCart = (variantId: string) => {
    addItem(variantId, 1, false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRail}>
        {ANNOUNCEMENTS.map((item) => (
          <span className={styles.chip} key={item}>
            {item}
          </span>
        ))}
      </div>

      <div className={styles.shell}>
        <div className={styles.navRow}>
          <nav className={styles.topNav} aria-label="Bridal collections">
            {NAV_ITEMS.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.modeToggle} role="tablist" aria-label="Shopping mode">
            <button
              className={`${styles.modeButton} ${styles.modeButtonActive}`}
              type="button"
              role="tab"
              aria-selected="true"
            >
              Bridal
            </button>
            <button className={styles.modeButton} type="button" role="tab" aria-selected="false">
              Everyday Elegance
            </button>
          </div>
        </div>

        <section className={styles.poster} aria-label="Launch poster">
          <p className={styles.posterBrand}>VAIDHURYA</p>
          <p className={styles.posterMaterial}>GOLD-COATED 925 SILVER</p>
          <p className={styles.posterOccasion}>AKSHAYA TRITIYA</p>
          <p className={styles.posterDivider}>GRAND LAUNCH</p>
          <p className={styles.posterDate}>APRIL 19, 2026</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Curated Collections</p>
            <h1 className={styles.sectionTitle}>Shop by Category</h1>
          </div>

          <div className={styles.categoryGrid}>
            {CATEGORY_ITEMS.map((item) => (
              <a className={styles.categoryCard} href={item.href} key={item.label}>
                <div className={styles.categoryMedia}>
                  <Image
                    className={styles.categoryImage}
                    src={item.imageSrc}
                    alt={item.label}
                    fill
                    sizes="(max-width: 840px) 18vw, 16vw"
                  />
                </div>
                <span className={styles.categoryLabel}>{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.section} id="brides-collection">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Bridal Collection</p>
            <h2 className={styles.sectionTitle}>Bride&apos;s Collection</h2>
          </div>

          <div className={styles.productGrid}>
            {BRIDAL_PRODUCTS.map((item) => (
              <PreviewCard
                item={item}
                key={item.key}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        <section className={styles.section} id="victorian-jewellery">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Victorian Collection</p>
            <h2 className={styles.sectionTitle}>Victorian Jewellery</h2>
          </div>

          <div className={styles.singleCardRow}>
            {VICTORIAN_PRODUCTS.map((item) => (
              <PreviewCard item={item} key={item.key} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
