import {
  commerceFeatureCards,
  getCollectionBySlug,
  getProductsBySlugs,
} from "./commerce-data.ts";

const launchCollectionSlugs = [
  "brides-collection",
  "victorian-jewellery",
  "bracelet-collection",
] as const;

const launchProductSlugs = [
  "chandraharam-mangalasutra",
  "victorian-polki-set",
  "celestial-cuff-bracelet",
] as const;

export const launchDayHero = {
  eyebrow: "Launch day landing page",
  title: "Launch day at VAIDHURYA",
  intro:
    "A ceremonial bridal drop, a gifting-friendly silver edit, and concierge-backed checkout all go live on the same premium stage.",
  label: "April 19 house opening",
  heading: "Ceremonial signatures, silver gifting, and the first price-locked orders all begin here.",
  description:
    "This landing page is designed to feel like an opening-night invitation: high-impact visuals, immediate paths into collections, and commerce moments that keep the luxury tone intact from browse to checkout.",
  primaryCta: {
    label: "Shop the launch collection",
    href: "/collections/brides-collection",
  },
  secondaryCta: {
    label: "Book a bespoke consult",
    href: "/bespoke",
  },
} as const;

export const launchDayStats = [
  { value: "3", label: "opening collections" },
  { value: "4", label: "commerce assurances" },
  { value: "Pan-India", label: "shipping promise" },
] as const;

export const launchDayMoments = [
  {
    time: "First look",
    title: "Hero drop goes live",
    detail: "The homepage opens on bridal ceremony with direct paths into the launch collection and bespoke enquiries.",
  },
  {
    time: "Mid scroll",
    title: "Merchandising widens into gifting",
    detail: "Everyday silver edits appear before the page feels repetitive, helping launch-day traffic discover giftable pieces fast.",
  },
  {
    time: "Checkout",
    title: "Confidence replaces friction",
    detail: "Price locks, certifications, shipment tracking, and gifting support stay visible so the launch experience still converts cleanly.",
  },
] as const;

export const launchDayPromises = [
  {
    title: "Guided discovery",
    copy: "Collections and product selections are sequenced like an editorial reveal instead of a generic store grid.",
  },
  {
    title: "Operational trust",
    copy: "Commerce messaging reinforces certified pieces, protected checkout, and tracked delivery without stealing the mood.",
  },
  {
    title: "Concierge-ready exits",
    copy: "Shoppers can move from inspiration into bespoke, checkout, or tracking flows without leaving the premium narrative.",
  },
] as const;

export function getLaunchDayHomeData() {
  const collections = launchCollectionSlugs.map((slug) => {
    const collection = getCollectionBySlug(slug);

    if (!collection) {
      throw new Error(`Missing launch-day collection: ${slug}`);
    }

    return collection;
  });

  const products = getProductsBySlugs([...launchProductSlugs]);

  if (products.length !== launchProductSlugs.length) {
    throw new Error("Launch-day products are missing from commerce data.");
  }

  return {
    hero: launchDayHero,
    stats: launchDayStats,
    moments: launchDayMoments,
    promises: launchDayPromises,
    collections,
    products,
    featureCards: commerceFeatureCards,
  };
}
