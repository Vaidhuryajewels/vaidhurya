import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(2).default(""),
  category: z.string().default(""),
  jewelryType: z.string().default(""),
  metal: z.enum(["silver", "gold", "platinum", "mixed", "unknown"]).default("unknown"),
  purity: z.string().default(""),
  certification: z.string().default(""),
  grossWeightGrams: z.number().positive().nullable().default(null),
  netWeightGrams: z.number().positive().nullable().default(null),
  stones: z.string().default(""),
  finish: z.string().default(""),
  price: z.number().nonnegative().nullable().default(null),
  currency: z.string().length(3).default("INR"),
  inventory: z.number().int().nonnegative().nullable().default(null),
  sku: z.string().default(""),
  description: z.string().default(""),
  confidence: z.number().min(0).max(1).default(0),
  missingFields: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export type SellerListing = z.infer<typeof listingSchema>;

const purityPatterns = [
  { pattern: /(?:silver|sterling)[\s-]*(?:925)|925[\s-]*(?:silver|sterling)/i, metal: "silver", purity: "925" },
  { pattern: /(?:22\s*(?:k|karat|carat)|916)/i, metal: "gold", purity: "22K" },
  { pattern: /(?:18\s*(?:k|karat|carat)|750)/i, metal: "gold", purity: "18K" },
  { pattern: /(?:14\s*(?:k|karat|carat)|585)/i, metal: "gold", purity: "14K" },
  { pattern: /(?:11\s*(?:k|karat|carat))/i, metal: "gold", purity: "11K" },
] as const;

export function deriveListingFromDescription(input: string): SellerListing {
  const purity = purityPatterns.find((entry) => entry.pattern.test(input));
  const priceMatch = input.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i);
  const weightMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gms|grams?)\b/i);
  const typeMatch = input.match(/\b(necklace|earrings?|ring|bracelet|bangle|anklet|pendant|mangalsutra|nose pin|chain)\b/i);
  const certification = /certif(?:ied|icate)|hallmark|bis\b/i.test(input)
    ? /bis\b/i.test(input) ? "BIS hallmarked" : "Seller states certified"
    : "";
  const price = priceMatch ? Number(priceMatch[1].replaceAll(",", "")) : null;
  const weight = weightMatch ? Number(weightMatch[1]) : null;
  const jewelryType = typeMatch?.[1] ?? "";
  const required = {
    title: jewelryType ? jewelryType.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "",
    category: jewelryType || "",
    jewelryType,
    metal: purity?.metal ?? "unknown",
    purity: purity?.purity ?? "",
    certification,
    grossWeightGrams: weight,
    netWeightGrams: null,
    stones: "",
    finish: "",
    price,
    currency: "INR",
    inventory: null,
    sku: "",
    description: input.trim(),
  };
  const missingFields = ["title", "jewelryType", "metal", "purity", "price", "inventory"]
    .filter((field) => !required[field as keyof typeof required] && required[field as keyof typeof required] !== 0);
  const warnings: string[] = [];
  if (/925/i.test(input) && purity?.metal === "gold") warnings.push("925 is normally a silver fineness; confirm the metal.");
  if (price !== null && price <= 0) warnings.push("Price must be greater than zero.");

  return listingSchema.parse({
    ...required,
    confidence: Math.max(0.35, 1 - missingFields.length * 0.09),
    missingFields,
    warnings,
  });
}

export function getListingReadiness(listing: SellerListing, mediaCount: number) {
  const required = ["title", "jewelryType", "metal", "purity", "price", "inventory"] as const;
  const missing = required.filter((field) => {
    const value = listing[field];
    return value === "" || value === null || value === "unknown";
  });
  if (mediaCount === 0) missing.push("title" as const);
  return { ready: missing.length === 0 && mediaCount > 0, missing: [...new Set(missing)] };
}
