export type ThemeKey = "bridal" | "everyday";

export type Collection = {
  slug: string;
  title: string;
  theme: ThemeKey;
  imageSrc: string;
  kicker: string;
  description: string;
  heroTitle: string;
  heroCopy: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  label: string;
  material: "Gold-Coated 925 Silver" | "925 Sterling Silver";
  finish: string;
  weightGrams: number;
  makingCharge: number;
  stoneCharge: number;
  packagingCharge: number;
  leadTimeLabel: string;
  inventoryLabel: string;
};

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  theme: ThemeKey;
  collectionSlug: string;
  description: string;
  imageSrc: string;
  hoverImageSrc?: string;
  heroImageSrc?: string;
  badge: string;
  craftsmanship: string;
  shippingNote: string;
  certification: string;
  careNotes: string[];
  giftable: boolean;
  customizable: boolean;
  variants: ProductVariant[];
};

export type CartItem = {
  variantId: string;
  quantity: number;
  giftWrap: boolean;
};

export type PriceBreakdown = {
  metalRateLabel: string;
  snapshotVersion: string;
  metalCost: number;
  makingCharge: number;
  stoneCharge: number;
  packagingCharge: number;
  giftWrapCharge: number;
  subtotal: number;
};

export type CalculatedCartLine = {
  item: CartItem;
  product: Product;
  variant: ProductVariant;
  breakdown: PriceBreakdown;
  lineTotal: number;
};

export type CartTotals = {
  lines: CalculatedCartLine[];
  subtotal: number;
  shippingEstimate: number;
  grandTotal: number;
  snapshotVersion: string;
  metalRateLabel: string;
  totalQuantity: number;
};

export type TrackingEvent = {
  label: string;
  detail: string;
  at: string;
  location: string;
};

export type Shipment = {
  id: string;
  label: string;
  carrier: string;
  trackingNumber: string;
  etaLabel: string;
  status: string;
  events: TrackingEvent[];
};

export type OrderLine = {
  productSlug: string;
  variantId: string;
  title: string;
  variantLabel: string;
  quantity: number;
  lineTotal: number;
  giftWrap: boolean;
};

export type StoredOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  snapshotVersion: string;
  priceLockedAt: string;
  priceLockExpiresAt: string;
  paymentStatus: string;
  orderStatus: string;
  total: number;
  lines: OrderLine[];
  shipments: Shipment[];
  addressSummary: string;
  cardLast4: string;
};

export type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  cardholderName: string;
  cardNumber: string;
};

export type AdminModule = {
  title: string;
  owner: string;
  summary: string;
  status: string;
};

export type IntegrationHealth = {
  title: string;
  summary: string;
  status: string;
};

export type CmsSection = {
  id: string;
  placement: string;
  theme: ThemeKey | "global";
  title: string;
  summary: string;
  status: "Draft" | "Preview Ready" | "Published";
};

export type AdminMetric = {
  label: string;
  value: string;
  context: string;
};

export const announcementByTheme: Record<ThemeKey, string[]> = {
  bridal: [
    "Pan India Free Shipping",
    "Dynamic Metal Pricing",
    "Certification With Every Bridal Set",
  ],
  everyday: [
    "Pan India Free Shipping",
    "925 Sterling Silver",
    "Gift-Ready Everyday Pieces",
  ],
};

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/collections/brides-collection", label: "Collections" },
  { href: "/bespoke", label: "Bespoke" },
  { href: "/track", label: "Track Order" },
  { href: "/admin", label: "Admin" },
] as const;

export const collections: Collection[] = [
  {
    slug: "brides-collection",
    title: "Bride's Collection",
    theme: "bridal",
    imageSrc: "/category-brides-collection.png",
    kicker: "Temple Heirlooms",
    description:
      "High-drama bridal layers, ceremonial silhouettes, and heirloom-level detailing crafted for milestone dressing.",
    heroTitle: "Bridal Atelier",
    heroCopy:
      "Gold-coated silver statements with ceremonial scale, gifting support, and tracked multi-package fulfillment.",
  },
  {
    slug: "victorian-jewellery",
    title: "Victorian Jewellery",
    theme: "bridal",
    imageSrc: "/category-victorian-jewellery.png",
    kicker: "Antique Romance",
    description:
      "Polki-inspired silhouettes and warm antique finishes designed for receptions, gifting, and couture styling.",
    heroTitle: "Victorian Salon",
    heroCopy:
      "Built for layered bridal events, certification-first presentation, and concierge-led customization.",
  },
  {
    slug: "bracelet-collection",
    title: "Bracelet Collection",
    theme: "everyday",
    imageSrc: "/category-bracelet-collection.png",
    kicker: "Everyday Signature",
    description:
      "Refined silver bracelets and cuffs that bring the same premium finish to everyday styling and gifting.",
    heroTitle: "Everyday Signatures",
    heroCopy:
      "Lightweight staples with card checkout, gift wrap, and fast shipment tracking.",
  },
  {
    slug: "anklet-collection",
    title: "Anklet Collection",
    theme: "everyday",
    imageSrc: "/category-anklet-collection.png",
    kicker: "Soft Occasion",
    description:
      "Graceful anklets and festive accents designed for intimate gifting moments and repeat wear.",
    heroTitle: "Anklet Salon",
    heroCopy:
      "Ready-stock essentials paired with optional gifting and guest checkout.",
  },
  {
    slug: "chains-and-pendants",
    title: "Chains and Pendants",
    theme: "everyday",
    imageSrc: "/category-chains-and-pendants.png",
    kicker: "Daily Layers",
    description:
      "Polished pendant-led pieces that balance premium finishes with wearable comfort and flexible checkout flows.",
    heroTitle: "Pendant Hall",
    heroCopy:
      "Daily-luxury pieces with live pricing awareness and protected price locks at checkout.",
  },
];

export const products: Product[] = [
  {
    slug: "chandraharam-mangalasutra",
    title: "Chandraharam Mangalasutra",
    subtitle: "Temple-layered ceremonial necklace with bridal weight and finish",
    theme: "bridal",
    collectionSlug: "brides-collection",
    description:
      "A sweeping bridal necklace with sculpted temple motifs, ceremonial depth, and premium finish tuned for wedding main looks.",
    imageSrc: "/bridal-chandraharam-mangalasutra.png",
    hoverImageSrc: "/bridal-chandraharam-mangalasutra-hover.png",
    heroImageSrc: "/bridal-chandraharam-mangalasutra-hover.png",
    badge: "Bridal Signature",
    craftsmanship: "Hand-finished temple detailing with heirloom-inspired layering.",
    shippingNote: "Split shipment supported when gifting accessories are packed separately.",
    certification: "Includes VAIDHURYA authenticity certificate and care card.",
    careNotes: [
      "Store in the lined keepsake box after each wear.",
      "Avoid perfume and moisture exposure on coated surfaces.",
      "Schedule a polish review after peak wedding-season usage.",
    ],
    giftable: true,
    customizable: true,
    variants: [
      {
        id: "v-chandra-heirloom",
        sku: "VDY-CHM-001",
        label: "Heirloom Polish / 42 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Temple gold wash",
        weightGrams: 42,
        makingCharge: 8880,
        stoneCharge: 4680,
        packagingCharge: 589,
        leadTimeLabel: "Ships in 5-7 days",
        inventoryLabel: "Limited bridal stock",
      },
      {
        id: "v-chandra-grand",
        sku: "VDY-CHM-002",
        label: "Grand Bridal Finish / 46 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Deep ceremonial gold wash",
        weightGrams: 46,
        makingCharge: 9720,
        stoneCharge: 5180,
        packagingCharge: 589,
        leadTimeLabel: "Ships in 7-10 days",
        inventoryLabel: "Made in atelier batches",
      },
    ],
  },
  {
    slug: "lakshmi-gutta-set",
    title: "Lakshmi Gutta Pusa Set",
    subtitle: "Statement necklace and earrings composed for festive bridal styling",
    theme: "bridal",
    collectionSlug: "brides-collection",
    description:
      "Lakshmi-inspired pusa layering with matching earrings, designed for sangeet-to-muhurtham transitions and premium gift presentation.",
    imageSrc: "/bridal-piece-2.png",
    hoverImageSrc: "/bridal-piece-2-hover.png",
    heroImageSrc: "/bridal-piece-2-hover.png",
    badge: "Reception Favourite",
    craftsmanship: "Structured volume with sculpted motifs and balanced ceremonial weight.",
    shippingNote: "Two-package shipment available for coordinated gifting dispatch.",
    certification: "Includes material verification and finish-care guidance.",
    careNotes: [
      "Lay flat before storage to maintain shape.",
      "Wipe gently with a dry microfiber cloth after use.",
      "Use the travel pouch for destination weddings.",
    ],
    giftable: true,
    customizable: true,
    variants: [
      {
        id: "v-lakshmi-classic",
        sku: "VDY-LGP-001",
        label: "Classic Bridal / 78 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Muted antique gold",
        weightGrams: 78,
        makingCharge: 14250,
        stoneCharge: 8650,
        packagingCharge: 649,
        leadTimeLabel: "Ships in 8-10 days",
        inventoryLabel: "Atelier allocation required",
      },
      {
        id: "v-lakshmi-royal",
        sku: "VDY-LGP-002",
        label: "Royal Layer / 84 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Ceremonial mirror gold",
        weightGrams: 84,
        makingCharge: 15890,
        stoneCharge: 9280,
        packagingCharge: 649,
        leadTimeLabel: "Ships in 10-12 days",
        inventoryLabel: "Made to order",
      },
    ],
  },
  {
    slug: "floral-crystal-necklace",
    title: "Floral Crystal Necklace",
    subtitle: "Luminous bridal floral set with lighter ceremonial feel",
    theme: "bridal",
    collectionSlug: "victorian-jewellery",
    description:
      "A white floral crystal story crafted for softer bridal edits, receptions, and heirloom-inspired gifting moments.",
    imageSrc: "/bridal-piece-3.png",
    hoverImageSrc: "/bridal-piece-3-hover.png",
    heroImageSrc: "/bridal-piece-3-hover.png",
    badge: "Soft Bridal Glow",
    craftsmanship: "Crystal-led detailing with a lighter silhouette for event versatility.",
    shippingNote: "Fast-track dispatch available for ready-stock variants.",
    certification: "Includes authenticity slip and polishing instructions.",
    careNotes: [
      "Keep separated from abrasive surfaces.",
      "Use a soft pouch when traveling.",
      "Remove before applying setting sprays or perfumes.",
    ],
    giftable: true,
    customizable: false,
    variants: [
      {
        id: "v-floral-daylight",
        sku: "VDY-FCN-001",
        label: "Daylight Finish / 31 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Rose antique wash",
        weightGrams: 31,
        makingCharge: 5960,
        stoneCharge: 5140,
        packagingCharge: 489,
        leadTimeLabel: "Ships in 4-6 days",
        inventoryLabel: "Ready stock",
      },
      {
        id: "v-floral-evening",
        sku: "VDY-FCN-002",
        label: "Evening Finish / 34 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Champagne gold wash",
        weightGrams: 34,
        makingCharge: 6550,
        stoneCharge: 5720,
        packagingCharge: 489,
        leadTimeLabel: "Ships in 6-8 days",
        inventoryLabel: "Ready stock",
      },
    ],
  },
  {
    slug: "victorian-polki-set",
    title: "Victorian Polki Set",
    subtitle: "Antique-leaning statement suite for reception and couture gifting",
    theme: "bridal",
    collectionSlug: "victorian-jewellery",
    description:
      "An ornate Victorian-inspired set with high-contrast sparkle and a premium event-ready silhouette for couture styling.",
    imageSrc: "/bridal-piece-4.jpeg",
    heroImageSrc: "/bridal-piece-4.jpeg",
    badge: "Salon Edition",
    craftsmanship: "Layered polki-inspired proportions tuned for high-occasion styling.",
    shippingNote: "Dispatch begins after final boutique quality pass.",
    certification: "Includes stone and finish authenticity details.",
    careNotes: [
      "Keep away from humidity-heavy storage.",
      "Use the rigid bridal tray provided in the order.",
      "Book a concierge polish inspection for repeat event wear.",
    ],
    giftable: true,
    customizable: true,
    variants: [
      {
        id: "v-victorian-salon",
        sku: "VDY-VPS-001",
        label: "Salon Set / 52 gm",
        material: "Gold-Coated 925 Silver",
        finish: "Antique bridal gold",
        weightGrams: 52,
        makingCharge: 12490,
        stoneCharge: 6840,
        packagingCharge: 589,
        leadTimeLabel: "Ships in 7-9 days",
        inventoryLabel: "Boutique capsule",
      },
    ],
  },
  {
    slug: "celestial-cuff-bracelet",
    title: "Celestial Cuff Bracelet",
    subtitle: "Polished cuff for everyday luxury gifting and occasion layering",
    theme: "everyday",
    collectionSlug: "bracelet-collection",
    description:
      "A polished cuff with subtle carved detailing, built for everyday premium wear, gifting, and faster fulfillment cycles.",
    imageSrc: "/category-bracelet-collection.png",
    heroImageSrc: "/category-bracelet-collection.png",
    badge: "Everyday Bestseller",
    craftsmanship: "Slim sculptural profile with lightweight premium finish.",
    shippingNote: "Ships fast with gift-note support and tracked delivery.",
    certification: "Includes sterling silver authenticity card.",
    careNotes: [
      "Store in the anti-tarnish sleeve provided.",
      "Avoid stacking with sharp-edged cuffs.",
      "Use a silver-safe polishing cloth for monthly care.",
    ],
    giftable: true,
    customizable: false,
    variants: [
      {
        id: "v-cuff-petite",
        sku: "VDY-CCB-001",
        label: "Petite Fit / 19 gm",
        material: "925 Sterling Silver",
        finish: "High polish silver",
        weightGrams: 19,
        makingCharge: 2190,
        stoneCharge: 640,
        packagingCharge: 329,
        leadTimeLabel: "Ships in 2-3 days",
        inventoryLabel: "Ready stock",
      },
      {
        id: "v-cuff-standard",
        sku: "VDY-CCB-002",
        label: "Standard Fit / 22 gm",
        material: "925 Sterling Silver",
        finish: "Soft mirror silver",
        weightGrams: 22,
        makingCharge: 2380,
        stoneCharge: 640,
        packagingCharge: 329,
        leadTimeLabel: "Ships in 2-3 days",
        inventoryLabel: "Ready stock",
      },
    ],
  },
  {
    slug: "moonlit-anklet-pair",
    title: "Moonlit Anklet Pair",
    subtitle: "Festive anklets with everyday lightness and gifting-ready presentation",
    theme: "everyday",
    collectionSlug: "anklet-collection",
    description:
      "A festive anklet pair with delicate movement and premium finish, ideal for intimate celebrations and quick gifting.",
    imageSrc: "/category-anklet-collection.png",
    heroImageSrc: "/category-anklet-collection.png",
    badge: "Gift Edit",
    craftsmanship: "Balanced movement and secure clasping for everyday comfort.",
    shippingNote: "Single-package dispatch with insured delivery tracking.",
    certification: "Includes pair authentication and care note.",
    careNotes: [
      "Store flat to avoid chain tangling.",
      "Dry completely after use.",
      "Keep clasping points free from residue.",
    ],
    giftable: true,
    customizable: false,
    variants: [
      {
        id: "v-anklet-twin",
        sku: "VDY-MAP-001",
        label: "Twin Chain Pair / 16 gm",
        material: "925 Sterling Silver",
        finish: "Lustre silver",
        weightGrams: 16,
        makingCharge: 1860,
        stoneCharge: 280,
        packagingCharge: 309,
        leadTimeLabel: "Ships in 2-4 days",
        inventoryLabel: "Ready stock",
      },
    ],
  },
  {
    slug: "dual-tone-pendant-chain",
    title: "Dual-Tone Pendant Chain",
    subtitle: "Layering pendant with elevated everyday finish and flexible gifting",
    theme: "everyday",
    collectionSlug: "chains-and-pendants",
    description:
      "An easy layering chain with dual-tone presence for everyday polish, premium gifting, and fast guest checkout.",
    imageSrc: "/category-chains-and-pendants.png",
    heroImageSrc: "/category-chains-and-pendants.png",
    badge: "Daily Layer",
    craftsmanship: "Easy-wear chain architecture with pendant-led shine.",
    shippingNote: "Gift boxing and note insertion supported at checkout.",
    certification: "Includes authenticity certificate and storage guidance.",
    careNotes: [
      "Fasten before storing.",
      "Keep away from harsh cleansers.",
      "Use a lint-free cloth to restore shine.",
    ],
    giftable: true,
    customizable: true,
    variants: [
      {
        id: "v-pendant-classic",
        sku: "VDY-DPC-001",
        label: "Classic Layer / 14 gm",
        material: "925 Sterling Silver",
        finish: "Dual-tone polish",
        weightGrams: 14,
        makingCharge: 1790,
        stoneCharge: 420,
        packagingCharge: 329,
        leadTimeLabel: "Ships in 2-4 days",
        inventoryLabel: "Ready stock",
      },
      {
        id: "v-pendant-extended",
        sku: "VDY-DPC-002",
        label: "Extended Chain / 18 gm",
        material: "925 Sterling Silver",
        finish: "Dual-tone polish",
        weightGrams: 18,
        makingCharge: 1980,
        stoneCharge: 420,
        packagingCharge: 329,
        leadTimeLabel: "Ships in 3-5 days",
        inventoryLabel: "Ready stock",
      },
    ],
  },
];

export const metalRates = {
  version: "APR-18-2026-11:30",
  silverRatePerGram: 118,
  goldCoatingRatePerGram: 86,
};

export const commerceFeatureCards = [
  {
    title: "Card Payments With Price Lock",
    description:
      "Browse with live metal rates, then lock the payable amount at checkout before payment authorization begins.",
  },
  {
    title: "Multi-Package Shipment Tracking",
    description:
      "Orders can split across ready-stock, gifting, and atelier-made items while the customer sees one unified timeline.",
  },
  {
    title: "Certificates And Premium Gifting",
    description:
      "Each eligible piece carries authenticity context, care details, gift wrapping, and gift-note support.",
  },
  {
    title: "Bespoke Inquiry To Quote",
    description:
      "Customers can request custom work, receive admin-managed revisions, and pay through a quote-driven flow.",
  },
] as const;

export const adminModules: AdminModule[] = [
  {
    title: "Catalog And Pricing",
    owner: "Merchandiser",
    summary:
      "Manage publishable assortment, metal-rate-aware pricing rules, certificates, and gift eligibility.",
    status: "Ready for implementation",
  },
  {
    title: "Orders And Fulfillment",
    owner: "Operations Manager",
    summary:
      "Review payment outcomes, split shipments, monitor carrier updates, and handle returns or refunds.",
    status: "Needs workflow screens",
  },
  {
    title: "Bespoke And CRM",
    owner: "Support Agent",
    summary:
      "Triage custom inquiries, attach support notes, and convert approved quotes into production orders.",
    status: "Needs quote tooling",
  },
  {
    title: "CMS And Analytics",
    owner: "Super Admin",
    summary:
      "Publish hero content, gifting copy, and content blocks without breaking the current luxury design system.",
    status: "Schema and preview pending",
  },
];

export const integrationHealth: IntegrationHealth[] = [
  {
    title: "PricingRateProvider",
    summary: "Snapshot-driven silver and coating rates powering browse pricing and checkout locks.",
    status: "Snapshot mode active",
  },
  {
    title: "PaymentGateway",
    summary: "Card-first checkout seam with payment intent, reconciliation, and refund responsibilities.",
    status: "Provider-agnostic stub",
  },
  {
    title: "ShippingGateway",
    summary: "Supports shipment creation, cancellation, tracking normalization, and split-package timelines.",
    status: "Tracking simulator active",
  },
  {
    title: "NotificationGateway",
    summary: "Premium brand messaging for confirmation, shipping, delays, refunds, and bespoke quote events.",
    status: "Template-backed mock",
  },
];

export const featuredBespokeServices = [
  "Temple bridal redesigns",
  "Pendant and chain personalization",
  "Event-matched gifting capsules",
  "Quote-managed bridal set expansions",
] as const;

export const cmsSections: CmsSection[] = [
  {
    id: "cms-home-hero",
    placement: "Homepage hero",
    theme: "bridal",
    title: "Akshaya Tritiya Launch Story",
    summary: "Controls hero copy, launch messaging, and CTA rhythm on the bridal storefront.",
    status: "Published",
  },
  {
    id: "cms-gifting-copy",
    placement: "Gifting blocks",
    theme: "global",
    title: "Premium gifting narrative",
    summary: "Used across PDP, cart, checkout, and post-purchase communication fragments.",
    status: "Preview Ready",
  },
  {
    id: "cms-everyday-editorial",
    placement: "Collection editorial",
    theme: "everyday",
    title: "Everyday salon collection intro",
    summary: "Adds merchandising copy without changing layout or theme primitives.",
    status: "Draft",
  },
];

export const adminMetrics: AdminMetric[] = [
  {
    label: "Live price snapshot",
    value: metalRates.version,
    context: "Current browse and checkout lock basis",
  },
  {
    label: "Open orders",
    value: "12",
    context: "Includes ready-stock and atelier-bound orders",
  },
  {
    label: "Split shipments",
    value: "4",
    context: "Orders with more than one active package timeline",
  },
  {
    label: "Bespoke requests",
    value: "7",
    context: "Awaiting triage, quote revision, or acceptance",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariantById(variantId: string) {
  for (const product of products) {
    const variant = product.variants.find((candidate) => candidate.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }

  return undefined;
}

export function getProductsForTheme(theme: ThemeKey) {
  return products.filter((product) => product.theme === theme);
}

export function getProductsForCollection(collectionSlug: string) {
  return products.filter((product) => product.collectionSlug === collectionSlug);
}

export function getOrderByNumber(orderNumber: string) {
  return sampleOrders.find((order) => order.orderNumber === orderNumber);
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => product !== undefined);
}

export function computePriceForVariant(
  variant: ProductVariant,
  options?: { giftWrap?: boolean },
): PriceBreakdown {
  const baseRate =
    variant.material === "Gold-Coated 925 Silver"
      ? metalRates.silverRatePerGram + metalRates.goldCoatingRatePerGram
      : metalRates.silverRatePerGram;
  const metalCost = Math.round(variant.weightGrams * baseRate);
  const giftWrapCharge = options?.giftWrap ? 249 : 0;
  const subtotal =
    metalCost +
    variant.makingCharge +
    variant.stoneCharge +
    variant.packagingCharge +
    giftWrapCharge;

  return {
    metalRateLabel:
      variant.material === "Gold-Coated 925 Silver"
        ? `Silver ${formatCurrency(metalRates.silverRatePerGram)}/gm + coating ${formatCurrency(metalRates.goldCoatingRatePerGram)}/gm`
        : `Sterling silver ${formatCurrency(metalRates.silverRatePerGram)}/gm`,
    snapshotVersion: metalRates.version,
    metalCost,
    makingCharge: variant.makingCharge,
    stoneCharge: variant.stoneCharge,
    packagingCharge: variant.packagingCharge,
    giftWrapCharge,
    subtotal,
  };
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const lines = items
    .map((item) => {
      const resolved = getVariantById(item.variantId);
      if (!resolved) {
        return null;
      }

      const breakdown = computePriceForVariant(resolved.variant, {
        giftWrap: item.giftWrap,
      });

      return {
        item,
        product: resolved.product,
        variant: resolved.variant,
        breakdown,
        lineTotal: breakdown.subtotal * item.quantity,
      } satisfies CalculatedCartLine;
    })
    .filter((line): line is CalculatedCartLine => line !== null);

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shippingEstimate = lines.length === 0 ? 0 : subtotal > 25000 ? 0 : 390;
  const totalQuantity = lines.reduce((sum, line) => sum + line.item.quantity, 0);

  return {
    lines,
    subtotal,
    shippingEstimate,
    grandTotal: subtotal + shippingEstimate,
    snapshotVersion: metalRates.version,
    metalRateLabel: lines[0]?.breakdown.metalRateLabel ?? "Silver rates unavailable",
    totalQuantity,
  };
}

function buildShipmentDetails(
  totals: CartTotals,
  placedAt: string,
  customerName: string,
): Shipment[] {
  const readyLines = totals.lines.filter((line) =>
    line.variant.inventoryLabel.toLowerCase().includes("ready"),
  );
  const atelierLines = totals.lines.filter((line) => !readyLines.includes(line));

  const baseEvents: TrackingEvent[] = [
    {
      label: "Order confirmed",
      detail: `Order verified for ${customerName} and released into operations.`,
      at: placedAt,
      location: "VAIDHURYA HQ",
    },
  ];

  const shipments: Shipment[] = [];

  if (readyLines.length > 0) {
    shipments.push({
      id: "ship-ready",
      label: "Ready-stock parcel",
      carrier: "BlueDart Priority",
      trackingNumber: `BD${Date.now().toString().slice(-8)}`,
      etaLabel: "Delivers in 2-4 business days",
      status: "Packed",
      events: [
        ...baseEvents,
        {
          label: "Packed for dispatch",
          detail: `${readyLines.length} ready-stock line item(s) prepared for insured dispatch.`,
          at: placedAt,
          location: "Chennai fulfilment desk",
        },
      ],
    });
  }

  if (atelierLines.length > 0) {
    shipments.push({
      id: "ship-atelier",
      label: "Atelier completion parcel",
      carrier: "Delhivery Secure",
      trackingNumber: `DL${(Date.now() + 7).toString().slice(-8)}`,
      etaLabel: "Dispatch after atelier quality pass",
      status: "Pending atelier release",
      events: [
        ...baseEvents,
        {
          label: "Atelier queue created",
          detail: `${atelierLines.length} line item(s) routed for atelier finishing and quality review.`,
          at: placedAt,
          location: "VAIDHURYA atelier",
        },
      ],
    });
  }

  if (shipments.length === 0) {
    shipments.push({
      id: "ship-default",
      label: "Primary parcel",
      carrier: "BlueDart Priority",
      trackingNumber: `BD${Date.now().toString().slice(-8)}`,
      etaLabel: "Delivers in 3-5 business days",
      status: "Packed",
      events: [
        ...baseEvents,
        {
          label: "Packed for dispatch",
          detail: "Primary shipment packed and queued for pickup.",
          at: placedAt,
          location: "VAIDHURYA HQ",
        },
      ],
    });
  }

  return shipments;
}

export function createOrderFromCart(
  items: CartItem[],
  input: CheckoutInput,
): StoredOrder | null {
  const totals = calculateCartTotals(items);

  if (totals.lines.length === 0) {
    return null;
  }

  const placedAt = new Date().toISOString();
  const orderNumber = `VDY${Date.now().toString().slice(-8)}`;
  const cardDigits = input.cardNumber.replace(/\D/g, "").slice(-4) || "0000";

  return {
    orderNumber,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    placedAt,
    snapshotVersion: totals.snapshotVersion,
    priceLockedAt: placedAt,
    priceLockExpiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
    paymentStatus: "Authorized",
    orderStatus: "Confirmed",
    total: totals.grandTotal,
    lines: totals.lines.map((line) => ({
      productSlug: line.product.slug,
      variantId: line.variant.id,
      title: line.product.title,
      variantLabel: line.variant.label,
      quantity: line.item.quantity,
      lineTotal: line.lineTotal,
      giftWrap: line.item.giftWrap,
    })),
    shipments: buildShipmentDetails(totals, placedAt, input.customerName),
    addressSummary: `${input.addressLine}, ${input.city}, ${input.state} ${input.postalCode}`,
    cardLast4: cardDigits,
  };
}

const sampleOrder = createOrderFromCart(
  [
    { variantId: "v-chandra-heirloom", quantity: 1, giftWrap: true },
    { variantId: "v-cuff-petite", quantity: 1, giftWrap: false },
  ],
  {
    customerName: "Ananya Rao",
    customerEmail: "ananya@example.com",
    addressLine: "14 Palace View",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500081",
    cardholderName: "Ananya Rao",
    cardNumber: "4111111111114242",
  },
);

export const sampleOrders: StoredOrder[] = sampleOrder
  ? [
      {
        ...sampleOrder,
        orderNumber: "VDY24041801",
        placedAt: "2026-04-18T10:30:00.000Z",
        priceLockedAt: "2026-04-18T10:26:00.000Z",
        priceLockExpiresAt: "2026-04-18T10:41:00.000Z",
        orderStatus: "Partially Fulfilled",
        shipments: [
          {
            id: "ship-ready",
            label: "Ready-stock parcel",
            carrier: "BlueDart Priority",
            trackingNumber: "BD94828114",
            etaLabel: "Out for delivery today",
            status: "Out for delivery",
            events: [
              {
                label: "Order confirmed",
                detail: "Payment authorized and order released to fulfilment.",
                at: "2026-04-18T10:30:00.000Z",
                location: "VAIDHURYA HQ",
              },
              {
                label: "Packed for dispatch",
                detail: "Ready-stock gifting piece packed with premium insert.",
                at: "2026-04-18T13:10:00.000Z",
                location: "Chennai fulfilment desk",
              },
              {
                label: "Out for delivery",
                detail: "Courier partner is attempting delivery today.",
                at: "2026-04-20T05:15:00.000Z",
                location: "Hyderabad",
              },
            ],
          },
          {
            id: "ship-atelier",
            label: "Atelier completion parcel",
            carrier: "Delhivery Secure",
            trackingNumber: "DL56028144",
            etaLabel: "Dispatch in 4-5 days",
            status: "Atelier finishing",
            events: [
              {
                label: "Atelier queue created",
                detail: "Bridal signature piece routed for final quality finishing.",
                at: "2026-04-18T11:45:00.000Z",
                location: "VAIDHURYA atelier",
              },
            ],
          },
        ],
      },
    ]
  : [];
