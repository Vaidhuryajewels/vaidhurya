import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const workspace = "/Users/dpvenkatesh/Desktop/vaidhurya";

test.skip("root index.html exists as a static poc-style homepage for GitHub Pages", () => {
  const html = readFileSync(path.join(workspace, "index.html"), "utf8");

  assert.match(html, /<title>VAIDHURYA Launch Storefront<\/title>/);
  assert.match(html, /Static VAIDHURYA launch storefront/i);
  assert.match(html, /WHATSAPP_NUMBER = "917026651789"/);
  assert.match(html, /Nose Pin/);
  assert.match(html, /Order now/);
  assert.match(html, /renderTheme\("bridal"\)/);
  assert.match(html, /\.\/public\/vaidhurya-logo\.png/);
});
