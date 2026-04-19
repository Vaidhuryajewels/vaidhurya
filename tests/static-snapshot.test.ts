import assert from "node:assert/strict";
import test from "node:test";
import {
  GO_LIVE_STATIC_SNAPSHOT,
  getGoLiveStaticSnapshot,
} from "../lib/static-snapshot.ts";

test("go-live static snapshot metadata points at the preserved original poc design", () => {
  const snapshot = getGoLiveStaticSnapshot();

  assert.deepEqual(snapshot, GO_LIVE_STATIC_SNAPSHOT);
  assert.equal(snapshot.href, "/poc");
  assert.equal(snapshot.sourceComponent, "OriginalPocStatic");
  assert.match(snapshot.description, /pre-commerce go-live design reference/i);
  assert.match(snapshot.description, /bridal and everyday elegance switch/i);
});
