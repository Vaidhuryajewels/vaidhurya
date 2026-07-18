import assert from "node:assert/strict";
import test from "node:test";
import { slugifyListing } from "../lib/seller-listing-storage.ts";

test("seller listing slug is stable for title and SKU", () => {
  assert.equal(slugifyListing("925 Silver Necklace", "VDY 001"), "925-silver-necklace-vdy-001");
});
