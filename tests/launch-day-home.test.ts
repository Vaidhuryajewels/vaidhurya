import assert from "node:assert/strict";
import test from "node:test";
import { getLaunchDayHomeData, launchDayHero } from "../lib/launch-day-home.ts";

test("launch-day homepage data resolves premium launch content and linked catalog entries", () => {
  const launchDay = getLaunchDayHomeData();

  assert.match(launchDayHero.title, /launch day at vaidhurya/i);
  assert.equal(launchDay.collections.length, 3);
  assert.deepEqual(
    launchDay.collections.map((collection) => collection.slug),
    ["brides-collection", "victorian-jewellery", "bracelet-collection"],
  );
  assert.deepEqual(
    launchDay.products.map((product) => product.slug),
    ["chandraharam-mangalasutra", "victorian-polki-set", "celestial-cuff-bracelet"],
  );
  assert.equal(launchDay.featureCards.length, 4);
  assert.equal(launchDay.moments.length, 3);
  assert.equal(launchDay.promises.length, 3);
});
