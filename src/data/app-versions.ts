// Version-wise documentation of what SamsKruti IS — a living narrative that
// grows one version per milestone, building toward a focused, confident pitch.
// Bump only when told to. Each version answers: what is it, for whom, why,
// how it makes money, and what shipped.

export interface AppVersion {
  version: string;     // "v1"
  name: string;        // a short name for the milestone
  date: string;        // commit range / when
  oneLiner: string;    // the elevator line at this version
  whatItIs: string;    // the paragraph you'd say out loud
  audience: string;
  doing: string;       // what we are actually trying to do
  business: string;    // how it becomes a business
  highlights: string[];// what shipped in this version
}

export const APP_VERSIONS: AppVersion[] = [
  {
    version: "v1",
    name: "The Foundation",
    date: "Commits 1–95 · through Jun 2026",
    oneLiner:
      "A map-led cultural platform for India's living cities — entered through three doorways.",
    whatItIs:
      "SamsKruti lets you enter an Indian city rather than browse it. v1 built the world and the way you move through it: an immersive India map that zooms into a city, one themed hero reused on every screen, a drawer sidebar, and the three segments — Sheher Ka Hriday (crafts), Sheher Ki Galiyan (streets), Sheher Ka Swaad (food) — sitting under Varanasi, the first of Chapter 1's twelve Jyotirlinga cities.",
    audience:
      "Indian diaspora, urban Indians (31–50), and culture-seeking foreign travellers.",
    doing:
      "Make India's cultural depth navigable and felt — one coherent frame where only the map, the dots, and the theme change as you go deeper.",
    business:
      "Foundation only — the storefront hadn't formed yet; content was catalogue-style.",
    highlights: [
      "India → Varanasi map with live-projected dots",
      "Unified themed hero + per-segment / per-city colour system",
      "Sidebar nav with the Chapter 1 · 12-Jyotirlinga hierarchy",
      "Three segment pages + a cross-segment itinerary",
      "Nested /varanasi/<segment> routes; top nav + sticky controls",
    ],
  },
  {
    version: "v2",
    name: "The Experiential Turn",
    date: "This commit · Jun 2026",
    oneLiner:
      "Sheher Ka Hriday becomes an experience where the hero is the addition, not the product.",
    whatItIs:
      "v2 turns the crafts segment from a catalogue into an experience. The Heritage Gift Box is the gateway — ready-made tiers and build-your-own — and every craft you add takes the spotlight with the story of why it belongs and the maker who made it. The Varanasi map shows the crafts at their real lanes (hover for the piece), and tapping a doorway zooms and transitions you into the segment behind a brand loader.",
    audience:
      "Same reach — diaspora, urban Indians, travellers — now with a clear buyer: the gift-giver.",
    doing:
      "Sell civilizational memory, not objects. “Don't buy a product. Carry a piece of civilizational memory.”",
    business:
      "Heritage Gift Boxes (₹1,199 / ₹2,999 / ₹4,999+) and build-your-own from GI-tagged crafts, each with a story card; the SamsKruti Cart as the platform-wide shop.",
    highlights: [
      "Build-your-own box — the addition spotlight with maker stories",
      "Product dots on the Varanasi map with hover cards",
      "Varanasi → segment zoom transition + route loader",
      "Light commerce theme for Hriday; the SamsKruti Cart page",
      "Concept + project-plan docs, and this version log",
    ],
  },
];
