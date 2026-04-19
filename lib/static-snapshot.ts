export const GO_LIVE_STATIC_SNAPSHOT = {
  href: "/poc",
  title: "Frozen original launch storefront",
  description:
    "The exact static VAIDHURYA launch storefront with Bridal and Everyday Elegance switch preserved as the pre-commerce go-live design reference.",
  sourceComponent: "OriginalPocStatic",
} as const;

export function getGoLiveStaticSnapshot() {
  return GO_LIVE_STATIC_SNAPSHOT;
}
