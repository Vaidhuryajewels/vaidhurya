import assert from "node:assert/strict";
import test from "node:test";
import { deriveListingFromDescription, getListingReadiness } from "../lib/seller-schema.ts";

test("extracts 925 silver listing facts deterministically", () => {
  const listing = deriveListingFromDescription("BIS certified 925 silver necklace, 82 grams, INR 23,793");
  assert.equal(listing.metal, "silver"); assert.equal(listing.purity, "925"); assert.equal(listing.price, 23793); assert.equal(listing.grossWeightGrams, 82); assert.match(listing.certification, /BIS/);
});

test("normalizes common gold purity terminology", () => {
  assert.equal(deriveListingFromDescription("18 carat gold ring ₹45000").purity, "18K");
  assert.equal(deriveListingFromDescription("916 gold bangle INR 68000").purity, "22K");
  assert.equal(deriveListingFromDescription("11 karat gold pendant Rs 9000").purity, "11K");
});

test("publish readiness requires commercial fields and media", () => {
  const listing = { ...deriveListingFromDescription("925 silver anklet INR 3000"), title: "Silver Anklet", inventory: 2 };
  assert.equal(getListingReadiness(listing, 0).ready, false);
  assert.equal(getListingReadiness(listing, 1).ready, true);
});
