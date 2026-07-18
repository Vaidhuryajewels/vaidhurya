// Node-oriented editable pro deck builder.
// Run this after editing SLIDES, SOURCES, and layout functions.
// The init script installs a sibling node_modules/@oai/artifact-tool package link
// and package.json with type=module for shell-run eval builders. Run with the
// Node executable from Codex workspace dependencies or the platform-appropriate
// command emitted by the init script.
// Do not use pnpm exec from the repo root or any Node binary whose module
// lookup cannot resolve the builder's sibling node_modules/@oai/artifact-tool.

const fs = await import("node:fs/promises");
const path = await import("node:path");
const { Presentation, PresentationFile } = await import("@oai/artifact-tool");

const W = 1280;
const H = 720;

const DECK_ID = "vaidhurya-pitch";
const OUT_DIR = "/Users/dpvenkatesh/Desktop/vaidhurya/outputs/vaidhurya-pitch-deck";
const REF_DIR = "/Users/dpvenkatesh/Desktop/vaidhurya/tmp/slides/vaidhurya-pitch/reference";
const SCRATCH_DIR = path.resolve(process.env.PPTX_SCRATCH_DIR || path.join("tmp", "slides", DECK_ID));
const PREVIEW_DIR = path.join(SCRATCH_DIR, "preview");
const VERIFICATION_DIR = path.join(SCRATCH_DIR, "verification");
const INSPECT_PATH = path.join(SCRATCH_DIR, "inspect.ndjson");
const MAX_RENDER_VERIFY_LOOPS = 3;

const INK = "#2A201A";
const GRAPHITE = "#57473D";
const MUTED = "#8A7B70";
const PAPER = "#FBF7EF";
const PAPER_96 = "#FBF7EFF2";
const WHITE = "#FFFFFF";
const ACCENT = "#0F6A4B";
const ACCENT_DARK = "#0A4D36";
const GOLD = "#B99656";
const CORAL = "#8E6251";
const TRANSPARENT = "#00000000";

const TITLE_FACE = "Caladea";
const BODY_FACE = "Lato";
const MONO_FACE = "Aptos Mono";

const LOGO_PATH = "/Users/dpvenkatesh/Desktop/vaidhurya/outputs/vaidhurya-pitch-deck/vaidhurya-logo-clean.png";
const FALLBACK_LOCAL_PLATES = {
  1: "/Users/dpvenkatesh/Desktop/vaidhurya/public/bridal-piece-4.jpeg",
  2: "/Users/dpvenkatesh/Desktop/vaidhurya/public/category-victorian-jewellery.png",
  3: "/Users/dpvenkatesh/Desktop/vaidhurya/public/bridal-piece-3.png",
  4: "/Users/dpvenkatesh/Desktop/vaidhurya/public/category-chains-and-pendants.png",
  5: "/Users/dpvenkatesh/Desktop/vaidhurya/public/category-for-her.png",
  6: "/Users/dpvenkatesh/Desktop/vaidhurya/public/bridal-piece-2.png",
  7: "/Users/dpvenkatesh/Desktop/vaidhurya/public/victorian-polki-secondary.png",
  8: "/Users/dpvenkatesh/Desktop/vaidhurya/public/category-brides-collection.png",
  9: "/Users/dpvenkatesh/Desktop/vaidhurya/public/bridal-piece-4.jpeg",
};

const FALLBACK_PLATE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

const SOURCES = {
  readme: "Repository README: VAIDHURYA Commerce Architecture.",
  architecture: "Repository docs: architecture-overview.md.",
  commerce: "Repository docs: commerce-flows.md.",
  founder: "Founder guidance from the working session: India jewelry market is fragmented and unorganized; team includes Venkatesha DP and Rishitha Adari.",
  assumption: "Deck framing uses placeholders for traction and fundraising details where numeric inputs were not provided.",
};

const SLIDES = [
  {
    "kicker": "VAIDHURYA",
    "title": "AI-Native Marketplace for Jewelry in India",
    "subtitle": "A trusted multi-seller platform for metal, diamond, and gemstone jewelry, personalized through outfit-led AI styling recommendations.",
    "expectedVisual": "Premium cover with jewelry background, logo, strong title, and concise value proposition.",
    "moment": "Premium commerce. Personalized by AI.",
    "notes": "Open by positioning VAIDHURYA as a premium, AI-native marketplace rather than a generic e-commerce site.",
    "sources": [
      "readme",
      "founder"
    ]
  },
  {
    "kicker": "PROBLEM + SOLUTION",
    "title": "Fragmented Market, Personalized Opportunity",
    "subtitle": "India's jewelry market is still trust-heavy, fragmented, and difficult to personalize online.",
    "expectedVisual": "Three-card slide summarizing buyer pain, seller pain, and the VAIDHURYA solution.",
    "cards": [
      [
        "Buyer Pain",
        "Discovery is inconsistent across metal, diamond, and gemstone categories, and shoppers struggle to match jewelry to outfit, occasion, and budget."
      ],
      [
        "Seller Pain",
        "Independent sellers have limited digital visibility, uneven merchandising, and high customer acquisition friction in a market still led by offline trust."
      ],
      [
        "VAIDHURYA",
        "A trusted multi-seller marketplace that combines premium commerce with AI-led recommendations tailored to dress, style, occasion, and spend."
      ]
    ],
    "notes": "Use this slide to frame the problem as both a discovery problem and a trust problem, then position VAIDHURYA as the organizing layer.",
    "sources": [
      "founder"
    ]
  },
  {
    "kicker": "AGENTIC EDGE",
    "title": "What Makes VAIDHURYA Agentic",
    "subtitle": "The platform does more than search inventory; it interprets intent and curates the best next action.",
    "expectedVisual": "Three-card slide describing understanding, matching, and learning.",
    "cards": [
      [
        "Understands",
        "A customer uploads a dress photo and the system reads color, silhouette, neckline, occasion, and aesthetic cues."
      ],
      [
        "Matches",
        "Those signals map to category, metal tone, stone palette, design language, and price band across seller inventory."
      ],
      [
        "Learns",
        "Clicks, saves, purchases, and repeat behavior sharpen recommendations for shoppers while improving marketplace merchandising."
      ]
    ],
    "notes": "Keep the word agentic concrete by describing how the system understands, decides, and improves over time.",
    "sources": [
      "founder"
    ]
  },
  {
    "kicker": "PRODUCT OVERVIEW",
    "title": "Full-Stack Product Experience",
    "subtitle": "VAIDHURYA connects premium storefront design, multi-seller commerce, and AI styling in one buyer journey.",
    "expectedVisual": "Three-card slide covering seller onboarding, buyer discovery, and AI styling flow.",
    "cards": [
      [
        "Seller Onboarding",
        "Sellers register, manage listings, and showcase metal, diamond, and gemstone collections with trust-rich product detail."
      ],
      [
        "Buyer Discovery",
        "Customers browse by category, occasion, material, style, and budget while discovering certified, premium presentation."
      ],
      [
        "AI Styling Flow",
        "Upload a dress photo, receive curated recommendations, compare options, and move into cart, checkout, and order tracking."
      ]
    ],
    "notes": "This slide should make the buyer and seller loop feel operational, not conceptual.",
    "sources": [
      "readme",
      "architecture",
      "commerce"
    ]
  },
  {
    "kicker": "TRACTION",
    "title": "Current Traction and Readiness",
    "subtitle": "The company is positioned as an early-stage build with a clear product thesis and fundraising-ready narrative.",
    "expectedVisual": "Three metric cards framing product readiness, validation stage, and investor readiness.",
    "metrics": [
      [
        "MVP",
        "Product concept and premium commerce foundation are already defined.",
        "Product readiness"
      ],
      [
        "EARLY",
        "Validation is focused on seller onboarding, buyer experience, and styling fit.",
        "Validation stage"
      ],
      [
        "READY",
        "Investor outreach can center on product clarity, AI differentiation, and category timing.",
        "Investor readiness"
      ]
    ],
    "notes": "This is intentionally framed without invented GMV or user metrics. Replace with real numbers when available.",
    "sources": [
      "readme",
      "assumption"
    ]
  },
  {
    "kicker": "TEAM",
    "title": "Built by Founders Focused on Premium Commerce",
    "subtitle": "The founding team is shaping VAIDHURYA at the intersection of jewelry commerce, AI-led personalization, and marketplace execution.",
    "expectedVisual": "Three-card slide introducing the founders and why this team can win.",
    "cards": [
      [
        "Venkatesha DP",
        "Co-founder driving product vision, marketplace execution, and the customer experience needed to modernize jewelry buying in India."
      ],
      [
        "Rishitha Adari",
        "Co-founder shaping brand direction, business build-out, and the premium trust layer needed to attract sellers and shoppers."
      ],
      [
        "Why This Team",
        "Execution-first founders building a trusted commerce brand with AI-native personalization as the product differentiator."
      ]
    ],
    "notes": "If fuller bios become available, replace these summaries with sharper credibility points.",
    "sources": [
      "founder"
    ]
  },
  {
    "kicker": "BUSINESS MODEL",
    "title": "Multiple Monetization Layers",
    "subtitle": "VAIDHURYA is structured to capture transaction revenue, recurring seller revenue, and platform service upside.",
    "expectedVisual": "Three-card slide covering take rate, seller monetization, and value-added services.",
    "cards": [
      [
        "Marketplace Take Rate",
        "Commission on every completed transaction across metal, diamond, and gemstone jewelry sold on the platform."
      ],
      [
        "Seller Revenue",
        "Premium storefront plans, merchandising tools, and optional visibility boosts create recurring platform revenue."
      ],
      [
        "Value-Added Services",
        "Catalog support, certification assistance, content creation, and future logistics enablement deepen monetization over time."
      ]
    ],
    "notes": "Use this to show the model is deeper than just commission revenue.",
    "sources": [
      "readme",
      "commerce",
      "founder"
    ]
  },
  {
    "kicker": "TECH STACK",
    "title": "Built for Scale with Claude and AWS",
    "subtitle": "The platform combines premium commerce infrastructure with an AI layer designed for personalization and operational leverage.",
    "expectedVisual": "Three-card slide covering the commerce platform, planned Claude usage, and AWS infrastructure.",
    "cards": [
      [
        "Commerce Core",
        "Next.js and React power a premium storefront, seller workflows, cart, checkout, tracking, and content-managed merchandising."
      ],
      [
        "Claude + AI",
        "Claude is planned for catalog enrichment, listing assistance, style reasoning, and support workflows around personalization."
      ],
      [
        "AWS Backbone",
        "AWS supports storage, compute, scalability, and orchestration for uploads, media, recommendation flows, and platform operations."
      ]
    ],
    "notes": "Keep the technology story practical and outcome-oriented rather than overly technical.",
    "sources": [
      "readme",
      "architecture",
      "commerce"
    ]
  },
  {
    "kicker": "FUNDRAISING",
    "title": "Fundraising Status",
    "subtitle": "Capital will accelerate product development, AI recommendations, seller acquisition, and marketplace launch readiness.",
    "expectedVisual": "Three metric cards covering round stage, use of funds, and next milestone.",
    "metrics": [
      [
        "PRE-SEED",
        "Fundraising stage focused on building the category-defining jewelry marketplace.",
        "Open investor conversations"
      ],
      [
        "AI + GTM",
        "Primary use of funds across product, recommendation engine, seller onboarding, and customer growth.",
        "Use of funds"
      ],
      [
        "V1 LAUNCH",
        "Next milestone: launch with live sellers and an outfit-led recommendation experience.",
        "Execution milestone"
      ]
    ],
    "notes": "Replace the pre-seed placeholder with the exact amount and instrument before circulating to investors.",
    "sources": [
      "assumption",
      "founder"
    ]
  }
];

const inspectRecords = [];

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readImageBlob(imagePath) {
  const bytes = await fs.readFile(imagePath);
  if (!bytes.byteLength) {
    throw new Error(`Image file is empty: ${imagePath}`);
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function normalizeImageConfig(config) {
  if (!config.path) {
    return config;
  }
  const { path: imagePath, ...rest } = config;
  return {
    ...rest,
    blob: await readImageBlob(imagePath),
  };
}

async function ensureDirs() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const obsoleteFinalArtifacts = [
    "preview",
    "verification",
    "inspect.ndjson",
    ["presentation", "proto.json"].join("_"),
    ["quality", "report.json"].join("_"),
  ];
  for (const obsolete of obsoleteFinalArtifacts) {
    await fs.rm(path.join(OUT_DIR, obsolete), { recursive: true, force: true });
  }
  await fs.mkdir(SCRATCH_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(VERIFICATION_DIR, { recursive: true });
}

function lineConfig(fill = TRANSPARENT, width = 0) {
  return { style: "solid", fill, width };
}

function recordShape(slideNo, shape, role, shapeType, x, y, w, h) {
  if (!slideNo) return;
  inspectRecords.push({
    kind: "shape",
    slide: slideNo,
    id: shape?.id || `slide-${slideNo}-${role}-${inspectRecords.length + 1}`,
    role,
    shapeType,
    bbox: [x, y, w, h],
  });
}

function addShape(slide, geometry, x, y, w, h, fill = TRANSPARENT, line = TRANSPARENT, lineWidth = 0, meta = {}) {
  const shape = slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: lineConfig(line, lineWidth),
  });
  recordShape(meta.slideNo, shape, meta.role || geometry, geometry, x, y, w, h);
  return shape;
}

function normalizeText(text) {
  if (Array.isArray(text)) {
    return text.map((item) => String(item ?? "")).join("\n");
  }
  return String(text ?? "");
}

function textLineCount(text) {
  const value = normalizeText(text);
  if (!value.trim()) {
    return 0;
  }
  return Math.max(1, value.split(/\n/).length);
}

function requiredTextHeight(text, fontSize, lineHeight = 1.18, minHeight = 8) {
  const lines = textLineCount(text);
  if (lines === 0) {
    return minHeight;
  }
  return Math.max(minHeight, lines * fontSize * lineHeight);
}

function assertTextFits(text, boxHeight, fontSize, role = "text") {
  const required = requiredTextHeight(text, fontSize);
  const tolerance = Math.max(2, fontSize * 0.08);
  if (normalizeText(text).trim() && boxHeight + tolerance < required) {
    throw new Error(
      `${role} text box is too short: height=${boxHeight.toFixed(1)}, required>=${required.toFixed(1)}, ` +
        `lines=${textLineCount(text)}, fontSize=${fontSize}, text=${JSON.stringify(normalizeText(text).slice(0, 90))}`,
    );
  }
}

function wrapText(text, widthChars) {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > widthChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines.join("\n");
}

function recordText(slideNo, shape, role, text, x, y, w, h) {
  const value = normalizeText(text);
  inspectRecords.push({
    kind: "textbox",
    slide: slideNo,
    id: shape?.id || `slide-${slideNo}-${role}-${inspectRecords.length + 1}`,
    role,
    text: value,
    textPreview: value.replace(/\n/g, " | ").slice(0, 180),
    textChars: value.length,
    textLines: textLineCount(value),
    bbox: [x, y, w, h],
  });
}

function recordImage(slideNo, image, role, imagePath, x, y, w, h) {
  inspectRecords.push({
    kind: "image",
    slide: slideNo,
    id: image?.id || `slide-${slideNo}-${role}-${inspectRecords.length + 1}`,
    role,
    path: imagePath,
    bbox: [x, y, w, h],
  });
}

function applyTextStyle(box, text, size, color, bold, face, align, valign, autoFit, listStyle) {
  box.text = text;
  box.text.fontSize = size;
  box.text.color = color;
  box.text.bold = Boolean(bold);
  box.text.alignment = align;
  box.text.verticalAlignment = valign;
  box.text.typeface = face;
  box.text.insets = { left: 0, right: 0, top: 0, bottom: 0 };
  if (autoFit) {
    box.text.autoFit = autoFit;
  }
  if (listStyle) {
    box.text.style = "list";
  }
}

function addText(
  slide,
  slideNo,
  text,
  x,
  y,
  w,
  h,
  {
    size = 22,
    color = INK,
    bold = false,
    face = BODY_FACE,
    align = "left",
    valign = "top",
    fill = TRANSPARENT,
    line = TRANSPARENT,
    lineWidth = 0,
    autoFit = null,
    listStyle = false,
    checkFit = true,
    role = "text",
  } = {},
) {
  if (!checkFit && textLineCount(text) > 1) {
    throw new Error("checkFit=false is only allowed for single-line headers, footers, and captions.");
  }
  if (checkFit) {
    assertTextFits(text, h, size, role);
  }
  const box = addShape(slide, "rect", x, y, w, h, fill, line, lineWidth);
  applyTextStyle(box, text, size, color, bold, face, align, valign, autoFit, listStyle);
  recordText(slideNo, box, role, text, x, y, w, h);
  return box;
}

async function addImage(slide, slideNo, config, position, role, sourcePath = null) {
  const image = slide.images.add(await normalizeImageConfig(config));
  image.position = position;
  recordImage(slideNo, image, role, sourcePath || config.path || config.uri || "inline-data-url", position.left, position.top, position.width, position.height);
  return image;
}

async function addPlate(slide, slideNo, opacityPanel = false) {
  slide.background.fill = PAPER;
  const generatedPlatePath = path.join(REF_DIR, `slide-${String(slideNo).padStart(2, "0")}.png`);
  const platePath = (await pathExists(generatedPlatePath)) ? generatedPlatePath : FALLBACK_LOCAL_PLATES[slideNo];
  if (await pathExists(platePath)) {
    await addImage(
      slide,
      slideNo,
      { path: platePath, fit: "cover", alt: `Text-free art-direction plate for slide ${slideNo}` },
      { left: 0, top: 0, width: W, height: H },
      "art plate",
      platePath,
    );
  } else {
    await addImage(
      slide,
      slideNo,
      { dataUrl: FALLBACK_PLATE_DATA_URL, fit: "cover", alt: `Fallback blank art plate for slide ${slideNo}` },
      { left: 0, top: 0, width: W, height: H },
      "fallback art plate",
      "fallback-data-url",
    );
  }
  if (opacityPanel) {
    addShape(slide, "rect", 0, 0, W, H, "#FFFFFFB8", TRANSPARENT, 0, { slideNo, role: "plate readability overlay" });
  }
}

function getSlideArtPath(slideNo) {
  return FALLBACK_LOCAL_PLATES[slideNo] || null;
}

function addCleanBackdrop(slide, slideNo, { rightBand = "#EEF1EA", leftGlow = "#F3E7D6", rightGlow = "#E5EFE7" } = {}) {
  slide.background.fill = PAPER;
  addShape(slide, "rect", 896, 0, 384, H, rightBand, TRANSPARENT, 0, { slideNo, role: "right band" });
  addShape(slide, "ellipse", -140, 470, 360, 300, leftGlow, TRANSPARENT, 0, { slideNo, role: "left glow" });
  addShape(slide, "ellipse", 1010, -90, 320, 260, rightGlow, TRANSPARENT, 0, { slideNo, role: "right glow" });
}

async function addPhotoPanel(slide, slideNo, x, y, w, h) {
  const artPath = getSlideArtPath(slideNo);
  addShape(slide, "roundRect", x - 8, y - 8, w + 16, h + 16, WHITE, "#D8CCBE", 1, { slideNo, role: "photo frame" });
  addShape(slide, "rect", x - 8, y - 8, 8, h + 16, ACCENT, TRANSPARENT, 0, { slideNo, role: "photo accent" });
  if (!(artPath && (await pathExists(artPath)))) return;
  const image = await addImage(
    slide,
    slideNo,
    { path: artPath, fit: "cover", alt: `Jewelry visual for slide ${slideNo}`, geometry: "roundRect" },
    { left: x, top: y, width: w, height: h },
    "photo panel",
    artPath,
  );
  image.geometry = "roundRect";
}

function addHeader(slide, slideNo, kicker, idx, total) {
  addText(slide, slideNo, String(kicker || "").toUpperCase(), 64, 34, 430, 24, {
    size: 13,
    color: ACCENT_DARK,
    bold: true,
    face: MONO_FACE,
    checkFit: false,
    role: "header",
  });
  addText(slide, slideNo, `${String(idx).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, 1114, 34, 104, 24, {
    size: 13,
    color: ACCENT_DARK,
    bold: true,
    face: MONO_FACE,
    align: "right",
    checkFit: false,
    role: "header",
  });
  addShape(slide, "rect", 64, 64, 1152, 2, INK, TRANSPARENT, 0, { slideNo, role: "header rule" });
  addShape(slide, "ellipse", 57, 57, 16, 16, ACCENT, INK, 2, { slideNo, role: "header marker" });
}

function addTitleBlock(slide, slideNo, title, subtitle = null, x = 64, y = 86, w = 780, dark = false) {
  const titleColor = dark ? PAPER : INK;
  const bodyColor = dark ? PAPER : GRAPHITE;
  addText(slide, slideNo, title, x, y, w, 142, {
    size: 40,
    color: titleColor,
    bold: true,
    face: TITLE_FACE,
    role: "title",
  });
  if (subtitle) {
    addText(slide, slideNo, subtitle, x + 2, y + 148, Math.min(w, 720), 70, {
      size: 19,
      color: bodyColor,
      face: BODY_FACE,
      role: "subtitle",
    });
  }
}

function addIconBadge(slide, slideNo, x, y, accent = ACCENT, kind = "signal") {
  addShape(slide, "ellipse", x, y, 54, 54, PAPER_96, INK, 1.2, { slideNo, role: "icon badge" });
  if (kind === "flow") {
    addShape(slide, "ellipse", x + 13, y + 18, 10, 10, accent, INK, 1, { slideNo, role: "icon glyph" });
    addShape(slide, "ellipse", x + 31, y + 27, 10, 10, accent, INK, 1, { slideNo, role: "icon glyph" });
    addShape(slide, "rect", x + 22, y + 25, 19, 3, INK, TRANSPARENT, 0, { slideNo, role: "icon glyph" });
  } else if (kind === "layers") {
    addShape(slide, "roundRect", x + 13, y + 15, 26, 13, accent, INK, 1, { slideNo, role: "icon glyph" });
    addShape(slide, "roundRect", x + 18, y + 24, 26, 13, GOLD, INK, 1, { slideNo, role: "icon glyph" });
    addShape(slide, "roundRect", x + 23, y + 33, 20, 10, CORAL, INK, 1, { slideNo, role: "icon glyph" });
  } else {
    addShape(slide, "rect", x + 16, y + 29, 6, 12, accent, TRANSPARENT, 0, { slideNo, role: "icon glyph" });
    addShape(slide, "rect", x + 25, y + 21, 6, 20, accent, TRANSPARENT, 0, { slideNo, role: "icon glyph" });
    addShape(slide, "rect", x + 34, y + 14, 6, 27, accent, TRANSPARENT, 0, { slideNo, role: "icon glyph" });
  }
}

function addCard(slide, slideNo, x, y, w, h, label, body, { accent = ACCENT, fill = PAPER_96, line = INK, iconKind = "signal" } = {}) {
  if (h < 156) {
    throw new Error(`Card is too short for editable pro-deck copy: height=${h.toFixed(1)}, minimum=156.`);
  }
  addShape(slide, "roundRect", x, y, w, h, fill, line, 1.2, { slideNo, role: `card panel: ${label}` });
  addShape(slide, "rect", x, y, 8, h, accent, TRANSPARENT, 0, { slideNo, role: `card accent: ${label}` });
  addIconBadge(slide, slideNo, x + 22, y + 24, accent, iconKind);
  addText(slide, slideNo, label, x + 88, y + 22, w - 108, 28, {
    size: 15,
    color: ACCENT_DARK,
    bold: true,
    face: MONO_FACE,
    role: "card label",
  });
  const wrapped = wrapText(body, Math.max(30, Math.floor(w / 11)));
  const bodyY = y + 86;
  const bodyH = h - (bodyY - y) - 22;
  if (bodyH < 54) {
    throw new Error(`Card body area is too short: height=${bodyH.toFixed(1)}, cardHeight=${h.toFixed(1)}, label=${JSON.stringify(label)}.`);
  }
  addText(slide, slideNo, wrapped, x + 24, bodyY, w - 48, bodyH, {
    size: 16,
    color: INK,
    face: BODY_FACE,
    role: `card body: ${label}`,
  });
}

function addMetricCard(slide, slideNo, x, y, w, h, metric, label, note = null, accent = ACCENT) {
  if (h < 132) {
    throw new Error(`Metric card is too short for editable pro-deck copy: height=${h.toFixed(1)}, minimum=132.`);
  }
  addShape(slide, "roundRect", x, y, w, h, PAPER_96, INK, 1.2, { slideNo, role: `metric panel: ${label}` });
  addShape(slide, "rect", x, y, w, 7, accent, TRANSPARENT, 0, { slideNo, role: `metric accent: ${label}` });
  addText(slide, slideNo, metric, x + 22, y + 24, w - 44, 54, {
    size: 34,
    color: INK,
    bold: true,
    face: TITLE_FACE,
    role: "metric value",
  });
  addText(slide, slideNo, label, x + 24, y + 82, w - 48, 38, {
    size: 16,
    color: GRAPHITE,
    face: BODY_FACE,
    role: "metric label",
  });
  if (note) {
    addText(slide, slideNo, note, x + 24, y + h - 42, w - 48, 22, {
      size: 10,
      color: MUTED,
      face: BODY_FACE,
      role: "metric note",
    });
  }
}

function addNotes(slide, body, sourceKeys) {
  const sourceLines = (sourceKeys || []).map((key) => `- ${SOURCES[key] || key}`).join("\n");
  slide.speakerNotes.setText(`${body || ""}\n\n[Sources]\n${sourceLines}`);
}

function addReferenceCaption(slide, slideNo) {
  addText(
    slide,
    slideNo,
    "Confidential | VAIDHURYA",
    64,
    674,
    260,
    22,
    {
      size: 10,
      color: MUTED,
      face: BODY_FACE,
      checkFit: false,
      role: "caption",
    },
  );
}

async function slideCover(presentation) {
  const slideNo = 1;
  const data = SLIDES[0];
  const slide = presentation.slides.add();
  addCleanBackdrop(slide, slideNo, { rightBand: "#E9EFE8", leftGlow: "#F2E4D2", rightGlow: "#E2ECE4" });
  addShape(slide, "rect", 802, 0, 478, H, "#0F6A4B14", TRANSPARENT, 0, { slideNo, role: "cover emerald veil" });
  addShape(slide, "rect", 64, 164, 7, 360, ACCENT, TRANSPARENT, 0, { slideNo, role: "cover accent rule" });
  await addPhotoPanel(slide, slideNo, 840, 82, 360, 556);
  if (await pathExists(LOGO_PATH)) {
    await addImage(
      slide,
      slideNo,
      { path: LOGO_PATH, fit: "contain", alt: "VAIDHURYA logo" },
      { left: 64, top: 44, width: 286, height: 92 },
      "logo",
      LOGO_PATH,
    );
  }
  addText(slide, slideNo, data.title, 82, 158, 650, 184, {
    size: 48,
    color: INK,
    bold: true,
    face: TITLE_FACE,
    role: "cover title",
  });
  addText(slide, slideNo, data.subtitle, 86, 348, 620, 86, {
    size: 20,
    color: GRAPHITE,
    face: BODY_FACE,
    role: "cover subtitle",
  });
  addShape(slide, "roundRect", 86, 500, 420, 92, PAPER_96, INK, 1.2, { slideNo, role: "cover moment panel" });
  addText(slide, slideNo, data.moment || "Replace with core idea", 112, 522, 360, 40, {
    size: 23,
    color: INK,
    bold: true,
    face: TITLE_FACE,
    role: "cover moment",
  });
  addReferenceCaption(slide, slideNo);
  addNotes(slide, data.notes, data.sources);
}

async function slideCards(presentation, idx) {
  const data = SLIDES[idx - 1];
  const slide = presentation.slides.add();
  addCleanBackdrop(slide, idx);
  await addPhotoPanel(slide, idx, 916, 94, 268, 196);
  addHeader(slide, idx, data.kicker, idx, SLIDES.length);
  addTitleBlock(slide, idx, data.title, data.subtitle, 64, 86, 760);
  const cards = data.cards?.length
    ? data.cards
    : [
        ["Replace", "Add a specific, sourced point for this slide."],
        ["Author", "Use native PowerPoint chart objects for charts; use deterministic geometry for cards and callouts."],
        ["Verify", "Render previews, inspect them at readable size, and fix actionable layout issues within 3 total render loops."],
      ];
  const cols = Math.min(3, cards.length);
  const cardW = (1114 - (cols - 1) * 24) / cols;
  const iconKinds = ["signal", "flow", "layers"];
  for (let cardIdx = 0; cardIdx < cols; cardIdx += 1) {
    const [label, body] = cards[cardIdx];
    const x = 84 + cardIdx * (cardW + 24);
    addCard(slide, idx, x, 388, cardW, 220, label, body, { iconKind: iconKinds[cardIdx % iconKinds.length] });
  }
  addReferenceCaption(slide, idx);
  addNotes(slide, data.notes, data.sources);
}

async function slideMetrics(presentation, idx) {
  const data = SLIDES[idx - 1];
  const slide = presentation.slides.add();
  addCleanBackdrop(slide, idx);
  await addPhotoPanel(slide, idx, 942, 94, 242, 184);
  addHeader(slide, idx, data.kicker, idx, SLIDES.length);
  addTitleBlock(slide, idx, data.title, data.subtitle, 64, 86, 700);
  const metrics = data.metrics || [
    ["00", "Replace metric", "Source"],
    ["00", "Replace metric", "Source"],
    ["00", "Replace metric", "Source"],
  ];
  const accents = [ACCENT, GOLD, CORAL];
  for (let metricIdx = 0; metricIdx < Math.min(3, metrics.length); metricIdx += 1) {
    const [metric, label, note] = metrics[metricIdx];
    addMetricCard(slide, idx, 92 + metricIdx * 370, 408, 330, 184, metric, label, note, accents[metricIdx % accents.length]);
  }
  addReferenceCaption(slide, idx);
  addNotes(slide, data.notes, data.sources);
}

async function createDeck() {
  await ensureDirs();
  if (!SLIDES.length) {
    throw new Error("SLIDES must contain at least one slide.");
  }
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  await slideCover(presentation);
  for (let idx = 2; idx <= SLIDES.length; idx += 1) {
    const data = SLIDES[idx - 1];
    if (data.metrics) {
      await slideMetrics(presentation, idx);
    } else {
      await slideCards(presentation, idx);
    }
  }
  return presentation;
}

async function saveBlobToFile(blob, filePath) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

async function writeInspectArtifact(presentation) {
  inspectRecords.unshift({
    kind: "deck",
    id: DECK_ID,
    slideCount: presentation.slides.count,
    slideSize: { width: W, height: H },
  });
  presentation.slides.items.forEach((slide, index) => {
    inspectRecords.splice(index + 1, 0, {
      kind: "slide",
      slide: index + 1,
      id: slide?.id || `slide-${index + 1}`,
    });
  });
  const lines = inspectRecords.map((record) => JSON.stringify(record)).join("\n") + "\n";
  await fs.writeFile(INSPECT_PATH, lines, "utf8");
}

async function currentRenderLoopCount() {
  const logPath = path.join(VERIFICATION_DIR, "render_verify_loops.ndjson");
  if (!(await pathExists(logPath))) return 0;
  const previous = await fs.readFile(logPath, "utf8");
  return previous.split(/\r?\n/).filter((line) => line.trim()).length;
}

async function nextRenderLoopNumber() {
  return (await currentRenderLoopCount()) + 1;
}

async function appendRenderVerifyLoop(presentation, previewPaths, pptxPath) {
  const logPath = path.join(VERIFICATION_DIR, "render_verify_loops.ndjson");
  const priorCount = await currentRenderLoopCount();
  const record = {
    kind: "render_verify_loop",
    deckId: DECK_ID,
    loop: priorCount + 1,
    maxLoops: MAX_RENDER_VERIFY_LOOPS,
    capReached: priorCount + 1 >= MAX_RENDER_VERIFY_LOOPS,
    timestamp: new Date().toISOString(),
    slideCount: presentation.slides.count,
    previewCount: previewPaths.length,
    previewDir: PREVIEW_DIR,
    inspectPath: INSPECT_PATH,
    pptxPath,
  };
  await fs.appendFile(logPath, JSON.stringify(record) + "\n", "utf8");
  return record;
}

async function verifyAndExport(presentation) {
  await ensureDirs();
  const nextLoop = await nextRenderLoopNumber();
  if (nextLoop > MAX_RENDER_VERIFY_LOOPS) {
    throw new Error(
      `Render/verify/fix loop cap reached: ${MAX_RENDER_VERIFY_LOOPS} total renders are allowed. ` +
        "Do not rerender; note any remaining visual issues in the final response.",
    );
  }
  await writeInspectArtifact(presentation);
  const previewPaths = [];
  for (let idx = 0; idx < presentation.slides.items.length; idx += 1) {
    const slide = presentation.slides.items[idx];
    const preview = await presentation.export({ slide, format: "png", scale: 1 });
    const previewPath = path.join(PREVIEW_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);
    await saveBlobToFile(preview, previewPath);
    previewPaths.push(previewPath);
  }
  const pptxBlob = await PresentationFile.exportPptx(presentation);
  const pptxPath = path.join(OUT_DIR, "output.pptx");
  await pptxBlob.save(pptxPath);
  const loopRecord = await appendRenderVerifyLoop(presentation, previewPaths, pptxPath);
  return { pptxPath, loopRecord };
}

const presentation = await createDeck();
const result = await verifyAndExport(presentation);
console.log(result.pptxPath);
