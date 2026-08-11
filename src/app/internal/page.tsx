import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT_LIBRARY, CHAPTER_TITLE, JYOTIRLINGA_ORIGIN, type FacetKey, type EntryHistory } from "@/data/content-library";
import { APP_VERSIONS } from "@/data/app-versions";

export const metadata: Metadata = {
  title: "Architecture · SamsKruti Internal",
  robots: { index: false, follow: false },
};

// ── Buckets & tabs ────────────────────────────────────────
// Sections are grouped into three buckets. Within a bucket, each section is a
// tab. All URL-based (?tab=…) so every view is shareable and back-compatible —
// same convention as /galiyan.
const BUCKETS = [
  { id: "plan",        label: "The Plan",    blurb: "The one that matters most — the real problem, the north star, the traveller's journey, and the book. Open this first each session." },
  { id: "application", label: "Application", blurb: "What the platform is — the world users move through: the brand → state → district → segment hierarchy and the city roadmap." },
  { id: "tech",        label: "Tech",        blurb: "How it is built — the data shapes, the map system, the file organisation, and the route map." },
  { id: "content",     label: "Content & Research", blurb: "How entries get made — the pipeline, the place to do the work, and the day-wise project plan." },
  { id: "story",       label: "Story",       blurb: "What SamsKruti is, version by version — the evolving narrative, building toward a focused pitch." },
] as const;

type BucketId = (typeof BUCKETS)[number]["id"];

const TABS = [
  { id: "plan-strategy", num: "00", label: "The Plan",       bucket: "plan" },
  { id: "hierarchy", num: "01", label: "Hierarchy",          bucket: "application" },
  { id: "districts", num: "02", label: "Districts",          bucket: "application" },
  { id: "data",      num: "03", label: "Data Model",         bucket: "tech" },
  { id: "maps",      num: "04", label: "Map System",         bucket: "tech" },
  { id: "structure", num: "05", label: "File Org",           bucket: "tech" },
  { id: "routes",    num: "06", label: "Routes",             bucket: "tech" },
  { id: "content",   num: "07", label: "Content & Research", bucket: "content" },
  { id: "plan",      num: "08", label: "Project Plan",        bucket: "content" },
  { id: "versions",  num: "09", label: "Versions",            bucket: "story" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const firstTabOf = (bucket: BucketId): TabId =>
  (TABS.find((t) => t.bucket === bucket) ?? TABS[0]).id;

// ── Types used in the data model display ─────────────────
// Source of truth: src/data/index.ts (content) + src/data/map-cities.ts,
// src/data/varanasi-places.ts (map geometry). Kept in sync with those files.
const DATA_MODEL = `// ── Platform root ────────────────────────────────────────
// src/data/platform.json — brand, segment registry, state + district index.

type Platform = {
  slug: "samskruti";
  name: string;
  devanagari: string;
  thesis: "hidden-treasures";
  brand: { accent; background; gold; ... };
  segments: SegmentConfig[];      // galiyan | parampara | hriday
  states: string[];               // slugs, e.g. "uttar-pradesh"
  activeDistricts: string[];      // ["varanasi"]
  plannedDistricts: string[];
};

// ── Geography: District meta ─────────────────────────────
// src/data/districts/<slug>/meta.json — aggregated in DISTRICTS[].

type DistrictMeta = City & {
  hindi: string;
  stateName: string;              // "Uttar Pradesh"
  coordinates?: [number, number]; // [lat, lng]
};

type City = {
  _id: string;
  name: string;                   // "Varanasi"
  slug: string;                   // "varanasi"
  state: string;                  // ref → State slug
  featured: boolean;
  tagline: string;
  description: string;
  dimensions: Record<"culture"|"craft"|"people"|"memory", CityDimension>;
};

// ── Segment entry types ──────────────────────────────────
// One JSON file per segment per district:
//   districts/<slug>/{galiyan,parampara,hriday}.json
// Aggregated into stories[], foods[], artisans[] in index.ts.

type Story = {              // Galiyan — heritage
  _id; name?; title; slug; excerpt; body;
  districtName?; districtSlug?; category; tag?;
  featured: boolean; gradient: { g1; g2 };
};

type FoodTradition = {      // Parampara — food
  _id; name; slug; excerpt; body;
  districtName?; districtSlug?; category;
  featured: boolean; gradient; tags: string[];
};

type Artisan = {            // Hriday — crafts
  _id; name; slug; excerpt; body;
  districtName?; districtSlug?; craft; generation;
  featured: boolean; gradient; tags: string[];
};

// ── Cross-segment itinerary ──────────────────────────────
// districts/<slug>/itineraries/<n>-day.json (Varanasi: 4-day).

type CityItinerary = {
  cityId; cityName; title; subtitle; intro;
  stats: { days; stops; pricePerPerson };
  days: ItineraryDay[];               // theme, accentColor, stops[]
  operationalNotes: ItineraryNote[];
};

// ── Map geometry (separate from content) ─────────────────

type MapCity = {            // src/data/map-cities.ts — India level
  id; hindi; temple; city; state;
  lat; lng; active: boolean; tagline?;   // 12 Jyotirlinga cities
};

type VaranasiPlace = {      // src/data/varanasi-places.ts — city level
  name; hindi?;
  coords: [number, number]; // [lng, lat]
  segment: "galiyan" | "parampara" | "hriday";
  featured?; heroLabel?;    // shared by hero dots + map explorer
};`;

// ── File organisation, grouped by subsystem (not by folder) ──
// Files are organised by the role they play, not where they sit on disk —
// because the map system, in particular, is one subsystem spanning three
// directories (components/site, data, public/data).
type Layer = {
  name: string;
  where: string;          // dir(s) this subsystem lives in
  color: string;
  blurb: string;
  files: { path: string; note: string }[];
};

const LAYERS: Layer[] = [
  {
    name: "Routes",
    where: "src/app/",
    color: "#C8652A",
    blurb: "Each folder is a route. The map is the entry point, not a text hub.",
    files: [
      { path: "page.tsx", note: "Landing · India map + city dots" },
      { path: "varanasi/page.tsx", note: "District hub · three doorways" },
      { path: "galiyan|parampara|hriday/page.tsx", note: "The three segments" },
      { path: "maps/page.tsx", note: "Full-screen explorer (noindex)" },
      { path: "internal/page.tsx", note: "This reference (noindex)" },
      { path: "layout.tsx", note: "Root shell · fonts · globals" },
    ],
  },
  {
    name: "Map system",
    where: "components/site · data · public/data",
    color: "#B07A1E",
    blurb: "One subsystem across three directories — see §04. Geometry is kept out of editorial content.",
    files: [
      { path: "site/india-map-explorer.tsx", note: "/maps in-place zoom engine" },
      { path: "site/google-india-map.tsx", note: "Landing Google map" },
      { path: "site/google-varanasi-map.tsx", note: "City Google map" },
      { path: "site/india-map.tsx", note: "SVG India (react-simple-maps)" },
      { path: "site/varanasi-district-map.tsx", note: "SVG district" },
      { path: "site/city-dots.tsx · varanasi-dots.tsx", note: "Dot overlays" },
      { path: "site/map-style.ts", note: "SAMSKRUTI_DARK theme" },
      { path: "data/map-cities.ts", note: "India cities (geometry)" },
      { path: "data/varanasi-places.ts", note: "City ideal points (geometry)" },
      { path: "public/data/*.json", note: "Boundary Topo/GeoJSON · 4 files" },
    ],
  },
  {
    name: "Content & data",
    where: "src/data/",
    color: "#3D7050",
    blurb: "Source content plus the aggregator that types it and exposes the collections.",
    files: [
      { path: "platform.json", note: "Platform root · brand · indexes" },
      { path: "index.ts", note: "Aggregator + all TS types" },
      { path: "states/*.json", note: "5 states" },
      { path: "districts/<city>/meta.json", note: "City meta (DistrictMeta)" },
      { path: "districts/<city>/{galiyan,parampara,hriday}.json", note: "Segment entries" },
      { path: "districts/varanasi/itineraries/4-day.json", note: "Cross-segment itinerary" },
    ],
  },
  {
    name: "Shared UI & brand",
    where: "components/ · lib/ · types/",
    color: "#4F76B0",
    blurb: "Composition and brand config shared across every page.",
    files: [
      { path: "navbar/index.tsx", note: "Nav · hub|landing|maps|segment" },
      { path: "site/site-hero.tsx", note: "Shared full-screen map hero" },
      { path: "site/landing-client.tsx", note: "Landing composition" },
      { path: "site/site-hero.tsx", note: "Universal themed hero (map + dots)" },
      { path: "site/{galiyan,parampara,hriday}-*", note: "Segment content blocks" },
      { path: "site/seals · newsletter · editorial-footer · marquee · traits", note: "UI atoms" },
      { path: "lib/segments.ts", note: "SEGMENTS brand config" },
      { path: "lib/utils.ts · types/", note: "Helpers + ambient types" },
    ],
  },
];

// Two flows the structure expresses — shown above the layers.
const FLOWS: { label: string; steps: string[] }[] = [
  { label: "Navigation", steps: ["/ — India map", "/<city> hub", "galiyan · parampara · hriday"] },
  { label: "Explore (no nav)", steps: ["/maps", "zoom to city", "segment-coded points"] },
  { label: "Data", steps: ["platform.json + districts/*.json", "data/index.ts", "pages"] },
];

// ── Route map ─────────────────────────────────────────────
const ROUTES: { path: string; description: string; status: string }[] = [
  { path: "/", description: "Landing — India map; click a city → district hub", status: "live" },
  { path: "/varanasi", description: "District hub — hero map + three segment doorways", status: "live" },
  { path: "/maps", description: "Full-screen map explorer — India↔city zoom (noindex)", status: "live" },
  { path: "/varanasi/galiyan", description: "Sheher Ki Galiyan — heritage segment home", status: "live" },
  { path: "/varanasi/galiyan?tab=cities", description: "Cities tab — district cards", status: "live" },
  { path: "/varanasi/galiyan?tab=itinerary", description: "Varanasi 4-day itinerary", status: "live" },
  { path: "/varanasi/galiyan?tab=stories", description: "Field stories", status: "live" },
  { path: "/varanasi/parampara", description: "Sheher Ka Swaad — food segment (#traditions, #cities)", status: "live" },
  { path: "/varanasi/hriday", description: "Sheher Ka Hriday — crafts segment (#artisans, #crafts)", status: "live" },
  { path: "/internal", description: "Architecture reference (this page · noindex)", status: "live" },
  { path: "/[district]", description: "Per-district hub for Kolkata/Jaipur/Mumbai/Delhi", status: "planned" },
  { path: "/varanasi/galiyan/[district]", description: "District-scoped heritage detail", status: "planned" },
  { path: "/varanasi/parampara/[district]", description: "District-scoped food entries", status: "planned" },
  { path: "/hriday/[district]", description: "District-scoped artisan profiles", status: "planned" },
];

// ── Districts seed list ───────────────────────────────────
// The 12 Jyotirlinga cities plotted on the map (src/data/map-cities.ts).
// Status mirrors MAP_CITIES.active — only Varanasi is live; the rest are
// "Coming Soon" markers on the India map / landing nav.
const DISTRICTS: {
  state: string;
  district: string;
  temple: string;
  galiyanFocus: string;
  paramparaFocus: string;
  hridayFocus: string;
  status: string;
}[] = [
  {
    state: "Uttar Pradesh",
    district: "Varanasi",
    temple: "Kashi Vishwanath",
    galiyanFocus: "Ghats, Kashi Vishwanath corridor, havelis",
    paramparaFocus: "Baati chokha, kachori sabzi, thandai",
    hridayFocus: "Banarasi silk, wooden toys, brasswork",
    status: "active",
  },
  {
    state: "Uttarakhand",
    district: "Kedarnath",
    temple: "Kedarnath",
    galiyanFocus: "Garhwal shrine trail, Gaurikund, Mandakini valley",
    paramparaFocus: "Pahadi rajma, mandua roti, bal mithai",
    hridayFocus: "Ringaal bamboo craft, woollen weaving, temple woodwork",
    status: "planned",
  },
  {
    state: "Jharkhand",
    district: "Deoghar",
    temple: "Vaidyanath",
    galiyanFocus: "Baidyanath Dham, Naulakha temple, Tapovan",
    paramparaFocus: "Deoghar peda, sattu, litti",
    hridayFocus: "Stone carving, terracotta, dokra metalwork",
    status: "planned",
  },
  {
    state: "Gujarat",
    district: "Somnath",
    temple: "Somnath",
    galiyanFocus: "Somnath temple, Triveni Sangam, Prabhas Patan",
    paramparaFocus: "Kathiawadi thali, ghatiya, fafda-jalebi",
    hridayFocus: "Patola weaving, bandhani, beadwork",
    status: "planned",
  },
  {
    state: "Gujarat",
    district: "Dwarka",
    temple: "Nageshwar",
    galiyanFocus: "Dwarkadhish, Nageshwar, Bet Dwarka",
    paramparaFocus: "Gujarati thali, fafda, shrikhand",
    hridayFocus: "Bandhani, mashru weaving, shell craft",
    status: "planned",
  },
  {
    state: "Maharashtra",
    district: "Bhimashankar",
    temple: "Bhimashankar",
    galiyanFocus: "Sahyadri nagara shrine, wildlife sanctuary, ghat trails",
    paramparaFocus: "Ghat-Maharashtrian fare, thalipeeth, jhunka bhakar",
    hridayFocus: "Warli painting, bamboo craft, Sahyadri woodwork",
    status: "planned",
  },
  {
    state: "Maharashtra",
    district: "Nashik (Trimbak)",
    temple: "Trimbakeshwar",
    galiyanFocus: "Trimbakeshwar, Kushavarta kund, Godavari ghats, Panchavati",
    paramparaFocus: "Misal, chivda, grape & wine country",
    hridayFocus: "Brass & copper work, Paithani (Yeola), terracotta",
    status: "planned",
  },
  {
    state: "Maharashtra",
    district: "Aurangabad (Verul)",
    temple: "Grishneshwar",
    galiyanFocus: "Grishneshwar, Ellora caves, Daulatabad, Bibi ka Maqbara",
    paramparaFocus: "Naan qalia, Marathwada-Deccan fare",
    hridayFocus: "Himroo & Paithani weaving, Bidri-style metalwork",
    status: "planned",
  },
  {
    state: "Andhra Pradesh",
    district: "Srisailam",
    temple: "Mallikarjuna",
    galiyanFocus: "Mallikarjuna temple, Nallamala forest, Krishna gorge",
    paramparaFocus: "Andhra meals, gongura, pulihora",
    hridayFocus: "Kondapalli toys, Kalamkari, brass lamps",
    status: "planned",
  },
  {
    state: "Madhya Pradesh",
    district: "Ujjain",
    temple: "Mahakaleshwar",
    galiyanFocus: "Mahakaleshwar, Ram Ghat, Kal Bhairav, Sandipani",
    paramparaFocus: "Poha-jalebi, dal bafla, Malwa sev",
    hridayFocus: "Batik, Malwa block print, clay craft",
    status: "planned",
  },
  {
    state: "Madhya Pradesh",
    district: "Omkareshwar",
    temple: "Omkareshwar",
    galiyanFocus: "Omkareshwar & Mamleshwar, Narmada ghats, Mandhata island",
    paramparaFocus: "Nimari Malwa fare, dal bafla, bhutte ka kees",
    hridayFocus: "Narmada stone craft, handloom weaving, beadwork",
    status: "planned",
  },
  {
    state: "Tamil Nadu",
    district: "Rameswaram",
    temple: "Ramanathaswamy",
    galiyanFocus: "Ramanathaswamy corridor, Agni Theertham, Dhanushkodi, Pamban",
    paramparaFocus: "Tamil-Chettinad meals, idli-dosa, filter coffee",
    hridayFocus: "Shell craft, Pamban fishing craft, palm-leaf weaving",
    status: "planned",
  },
];

// ── Anatomy of an entry ───────────────────────────────────
// Every entry — a place, a food, a craft — shares ONE anatomy: three tenses of
// time, told through stories, carried by people, reached through experience.
// The same six facets repeat across all three segments, specialised to each
// subject. The three tenses map to the brand line: "Not preserved. Practiced. Continued."
type TenseLabel = "History" | "Memory" | "Continuity";
type ThreadLabel = "Stories" | "People" | "Experience";

const ENTRY_TENSES: { label: TenseLabel; when: string; tense: string; color: string }[] = [
  { label: "History",    when: "Past",    tense: "Preserved", color: "#6F5F48" },
  { label: "Memory",     when: "Present", tense: "Practiced", color: "#C8652A" },
  { label: "Continuity", when: "Future",  tense: "Continued", color: "#97701F" },
];

const ENTRY_THREADS: { role: string; label: ThreadLabel }[] = [
  { role: "Told through", label: "Stories" },
  { role: "Carried by",   label: "People" },
  { role: "Reached via",  label: "Experience" },
];

// Each segment = the same six facets, specialised to its subject.
const SEGMENT_ANATOMY: {
  name: string;
  subject: string;
  color: string;
  tense: Record<TenseLabel, string>;
  thread: Record<ThreadLabel, string>;
}[] = [
  {
    name: "Sheher Ki Galiyan", subject: "a Place", color: "#3D7050",
    tense: {
      History: "Why the place exists · what happened here",
      Memory: "Why people come · what they do here now",
      Continuity: "Cared for, fading, or forgotten",
    },
    thread: {
      Stories: "The place's own narratives",
      People: "Priests, boatmen, residents — its keepers",
      Experience: "Visit — when to go, what to do, must-see vs hidden",
    },
  },
  {
    name: "Sheher Ka Swaad", subject: "a Food", color: "#A83828",
    tense: {
      History: "Origin of the dish · who first made it",
      Memory: "When & why it's eaten · the ritual around it",
      Continuity: "Still cooked, or a dying recipe",
    },
    thread: {
      Stories: "The dish's narratives",
      People: "Cooks, vendors, the families who keep it",
      Experience: "Taste — where to eat, where to buy, why",
    },
  },
  {
    name: "Sheher Ka Hriday", subject: "a Craft / Art", color: "#4F76B0",
    tense: {
      History: "Origin of the craft · how it began",
      Memory: "How it's practised now · the living form",
      Continuity: "Generations left · endangered or thriving",
    },
    thread: {
      Stories: "The maker's narratives",
      People: "Artisans, performers — knowledge in the hands",
      Experience: "Meet — who makes it, where to see & learn",
    },
  },
];

// ── The place to do it, and the week-1 plan ───────────────
const CONTENT_PLACE: { path: string; note: string }[] = [
  { path: "content/README.md",            note: "How the pipeline works" },
  { path: "content/entry-template.md",    note: "The six-facet fill-in template" },
  { path: "content/varanasi/backlog.md",  note: "What to make next, in order" },
  { path: "content/varanasi/research/",   note: "Notes & sources — one file per entry" },
];

// Week 1 — one task a day, Mon → Fri, finished one by one.
const PROJECT_PLAN: { date: string; task: string; done: boolean }[] = [
  { date: "Mon · 8 Jun",  task: "Finalised Chapter 1 (the 12 Jyotirlinga origin), the Varanasi city story, and the content architecture — chapter → city → place, with connected dots. Opened Kashi Vishwanath, Dashashwamedh & Divodaseshwara.", done: true },
  { date: "Tue · 9 Jun",  task: "Finish the Kashi Vishwanath section — complete Memory · Continuity · Stories · People, add photos, and publish it.", done: false },
  { date: "Wed · 10 Jun", task: "Second place — build Manikarnika Ghat (the Shiva–Parvati earring legend + liberation).", done: false },
  { date: "Thu · 11 Jun", task: "Complete Dashashwamedh to full (it's drafted) — its facets, photos, and verify.", done: false },
  { date: "Fri · 12 Jun", task: "Build Divodaseshwara, then review the week's connected places end-to-end.", done: false },
];

// Facet display order + colour for the library (History·Memory·Continuity → Stories·People·Experience).
// History is rendered separately (structured into story-sections); these are
// the remaining five facets shown as simple bilingual rows.
const FACET_META: { key: FacetKey; label: string; color: string }[] = [
  { key: "memory",     label: "Memory",     color: "#C8652A" },
  { key: "continuity", label: "Continuity", color: "#97701F" },
  { key: "stories",    label: "Stories",    color: "#2B2620" },
  { key: "people",     label: "People",     color: "#4A6B58" },
  { key: "experience", label: "Experience", color: "#4F76B0" },
];

// ── The Plan — the north star, the journey, the book (added 2026-07-12) ──
// The strategic plan we work to. Full detail in uploads/project-plan/.
const REAL_PROBLEM =
  "A traveller enters a city and feels LOST — a hundred videos, no idea where to go or what to do. We make them feel GUIDED, like a guide is walking beside them. That feeling is the whole product.";

const NORTH_STAR = {
  primary: "100 genuinely guided souls",
  secondary: "how many recommend it onward",
  note: "The count is reach. The recommendation is the honesty check — you can't fake a referral. Book sales are the business proof; guided souls stay the true star.",
};

const SCOREBOARD = { souls: 1, recommendations: 0, target: 100 };

const JOURNEY: { n: string; stage: string; feel: string; you: string; scores: string; color: string }[] = [
  { n: "1", stage: "Lost",            feel: "drowning in 100 videos, anxious — 'where do I even go?'", you: "nothing yet — but this pain is the opening line", scores: "—",                color: "#6F5F48" },
  { n: "2", stage: "Found you",       feel: "'this is exactly my problem'",                            you: "show up where travellers are, one honest line",  scores: "a hand raised",    color: "#C8652A" },
  { n: "3", stage: "First taste",     feel: "relief — 'they get it'",                                  you: "3 questions → a free guided snippet",             scores: "a guided soul ★",  color: "#97701F" },
  { n: "4", stage: "The yes",         feel: "'obviously yes — it's ₹500'",                             you: "make the offer; produce the book",               scores: "a book sale",      color: "#3D7050" },
  { n: "5", stage: "The journey",     feel: "never alone — 'a guide beside me'",                       you: "be the phone guide; learn from every call",      scores: "the real value",   color: "#4F76B0" },
  { n: "6", stage: "The glow + tell", feel: "proud, grateful",                                         you: "ask two questions; the book becomes a keepsake", scores: "a recommendation", color: "#A83828" },
  { n: "7", stage: "The loop",        feel: "—",                                                       you: "their recommendation = the next soul's stage 2", scores: "the flywheel",     color: "#4A6B58" },
];

const PHASES: { id: string; label: string; note: string; status: string }[] = [
  { id: "A", label: "Deep research of Varanasi", note: "the content of the book + itinerary — done for a real trip, never abstract", status: "researching" },
  { id: "B", label: "The itinerary framework",   note: "3 questions (how long · what pulls you · what pace) → a personalised day-by-day plan", status: "todo" },
  { id: "C", label: "Soul #001",                 note: "guide the first real traveller (~Aug–Sep 2026) by hand — his trip writes the first book", status: "todo" },
  { id: "D", label: "The guidebook",             note: "beautiful booklet, ~₹400–500, every page a soul, phone number inside", status: "todo" },
  { id: "E", label: "The landing page",          note: "one job — the hook + 'guide me'. A door, not the house", status: "todo" },
];

export default async function InternalPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active: TabId = (TABS.some((t) => t.id === tab) ? tab : TABS[0].id) as TabId;
  const activeBucket: BucketId = TABS.find((t) => t.id === active)!.bucket;
  return (
    <div style={{
      background: "#F6F3EE",
      color: "#2B2620",
      fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
      fontSize: "13px",
      lineHeight: "1.7",
      minHeight: "100vh",
      padding: "0",
    }}>
      {/* ── Banner ── */}
      <div style={{
        background: "#C8652A",
        color: "#FFF3E8",
        textAlign: "center",
        padding: "6px 24px",
        fontSize: "11px",
        letterSpacing: "2px",
        fontWeight: "600",
        textTransform: "uppercase",
      }}>
        Internal · Not For Public Distribution · SamsKruti Architecture Reference
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "48px 32px 96px" }}>

        {/* ── Tab nav (buckets + sections) ── */}
        <TabNav active={active} activeBucket={activeBucket} />

        {/* ── Section 0: The Plan ── */}
        {active === "plan-strategy" && (
        <Section title="00 · The Plan" subtitle="The real problem → the north star → the journey → the book">
          <div style={{ display: "grid", gap: "28px" }}>

            {/* The real problem */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderLeft: "3px solid #C8652A", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ color: "#C8652A", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>The real problem (locked)</p>
              <p style={{ color: "#33302A", fontSize: "13px", lineHeight: "1.75", margin: 0 }}>{REAL_PROBLEM}</p>
            </div>

            {/* The north star */}
            <div style={{ background: "rgba(200,101,42,0.06)", border: "1px solid #C8652A", borderRadius: "6px", padding: "24px" }}>
              <p style={{ color: "#6F5F48", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>North star · next 6 months</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap", marginBottom: "10px" }}>
                <span style={{ color: "#1C1815", fontFamily: "Georgia, serif", fontSize: "26px" }}>{NORTH_STAR.primary}</span>
                <span style={{ color: "#B0642A", fontSize: "14px", fontStyle: "italic" }}>+ {NORTH_STAR.secondary}</span>
              </div>
              <p style={{ color: "#5F574B", fontSize: "12px", lineHeight: "1.7", margin: 0, maxWidth: "660px" }}>{NORTH_STAR.note}</p>
            </div>

            {/* Scoreboard */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: "Guided souls", val: `${SCOREBOARD.souls} / ${SCOREBOARD.target}`, sub: "Soul #001 — real, arriving ~Aug–Sep 2026", color: "#3D7050" },
                { label: "Recommendations", val: `${SCOREBOARD.recommendations}`, sub: "too early — earned, never bought", color: "#97701F" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, minWidth: "220px", background: "#FFFFFF", border: "1px solid #E4DED2", borderTop: `2px solid ${s.color}`, borderRadius: "4px", padding: "16px 20px" }}>
                  <div style={{ color: "#877E70", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</div>
                  <div style={{ color: "#1C1815", fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "4px" }}>{s.val}</div>
                  <div style={{ color: "#8C8478", fontSize: "11px" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* The user journey */}
            <div>
              <p style={{ color: "#C8652A", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>The user journey</p>
              <p style={{ color: "#877E70", fontSize: "11px", fontStyle: "italic", marginBottom: "14px" }}>Lost → Found → Guided → Moved → Tells others. We help before we ever ask for money.</p>
              <div style={{ display: "grid", gap: "8px" }}>
                {JOURNEY.map((j) => (
                  <div key={j.n} style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderLeft: `3px solid ${j.color}`, borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ color: j.color, fontFamily: "monospace", fontSize: "12px", fontWeight: 700 }}>{j.n}</span>
                      <span style={{ color: "#1C1815", fontWeight: 600, fontSize: "13px" }}>{j.stage}</span>
                      <span style={{ marginLeft: "auto", color: j.color, fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.5px" }}>{j.scores}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px" }}>
                      <span style={{ color: "#5F574B", fontSize: "11px", lineHeight: "1.55" }}><span style={{ color: "#877E70", textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>they feel · </span>{j.feel}</span>
                      <span style={{ color: "#5F574B", fontSize: "11px", lineHeight: "1.55" }}><span style={{ color: "#877E70", textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>you do · </span>{j.you}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The business model — the book */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderLeft: "3px solid #4F76B0", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ color: "#4F76B0", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>The business model · the book</p>
              <p style={{ color: "#33302A", fontSize: "12.5px", lineHeight: "1.75", margin: "0 0 8px" }}>
                A beautiful guidebook (~₹400–500), sold to a traveller for their own trip after the free 1–2 pager — the whole trip day-by-day, every page a soul, a phone number inside for a live guide. It replaces the box (a gift, costly, unclear demand) and it outlives the trip: a keepsake that keeps recommending you.
              </p>
              <p style={{ color: "#877E70", fontSize: "11px", fontStyle: "italic", margin: 0 }}>Guided souls stay the true star; book sales are the business proof. Never let selling override guiding.</p>
            </div>

            {/* The build — phases A–E */}
            <div>
              <p style={{ color: "#C8652A", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>The build · Phases A–E</p>
              <p style={{ color: "#877E70", fontSize: "11px", fontStyle: "italic", marginBottom: "14px" }}>The one rule: finish one to done before opening the next. Now → Phase A + C together: research for Soul #001&apos;s real trip.</p>
              <div style={{ display: "grid", gap: "8px" }}>
                {PHASES.map((p) => (
                  <div key={p.id} style={{ display: "flex", gap: "14px", alignItems: "baseline", background: "#FFFFFF", border: "1px solid #E4DED2", borderRadius: "4px", padding: "14px 18px", flexWrap: "wrap" }}>
                    <span style={{ color: "#C8652A", fontFamily: "monospace", fontSize: "14px", fontWeight: 700, width: "18px", flexShrink: 0 }}>{p.id}</span>
                    <span style={{ color: "#1C1815", fontWeight: 600, fontSize: "12px", width: "200px", flexShrink: 0 }}>{p.label}</span>
                    <span style={{ color: "#5F574B", fontSize: "11.5px", lineHeight: "1.6", flex: 1, minWidth: "200px" }}>{p.note}</span>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </div>

            <p style={{ color: "#877E70", fontSize: "11px", lineHeight: "1.7", borderTop: "1px solid #E4DED2", paddingTop: "16px" }}>
              Full detail lives in <code style={{ color: "#6F5F48" }}>uploads/project-plan/</code> — USER-JOURNEY.txt (the why), PROJECT-PLAN.txt (the how), GUIDED-SOULS.txt (the scoreboard), IDEAS-INBOX.txt (the catch-net).
            </p>
          </div>
        </Section>
        )}

        {/* ── Section 1: Platform Hierarchy ── */}
        {active === "hierarchy" && (
        <Section title="01 · Platform Hierarchy" subtitle="How the world is organised — from brand to entry">
          <div style={{ display: "grid", gap: "24px" }}>

            {/* Tree visual */}
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #E4DED2",
              borderRadius: "4px",
              padding: "32px",
              fontFamily: "monospace",
              fontSize: "13px",
            }}>
              <TreeNode color="#C8652A" dot="◉" label="SamsKruti" sublabel="Platform · parent brand · hub at /" indent={0} />
              <TreeNode color="#6F5F48" dot="├──" label="State" sublabel="e.g. Uttar Pradesh, Rajasthan, West Bengal" indent={1} connector />
              <TreeNode color="#4A6B58" dot="│   ├──" label="District" sublabel="e.g. Varanasi, Lucknow, Jaipur" indent={2} />
              <div style={{ paddingLeft: "72px", marginTop: "6px" }}>
                {SEGMENT_ANATOMY.map((seg) => (
                  <div key={seg.name} style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ color: "#C2B8A6", fontFamily: "monospace" }}>├──</span>
                    <span style={{ color: seg.color, fontWeight: "700" }}>⬡ {seg.name}</span>
                    <span style={{ color: "#6F5F48", fontSize: "11px" }}>catalogues {seg.subject}</span>
                  </div>
                ))}

                {/* Shared entry anatomy — same six facets in every segment */}
                <div style={{ paddingLeft: "26px", marginTop: "8px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "5px" }}>
                    <span style={{ color: "#C2B8A6", fontFamily: "monospace" }}>↳</span>
                    <span style={{ color: "#2B2620", fontWeight: "600" }}>each Entry</span>
                    <span style={{ color: "#A09789", fontSize: "11px" }}>a place · a food · a craft — one anatomy</span>
                  </div>
                  <div style={{ paddingLeft: "22px" }}>
                    {ENTRY_TENSES.map((t) => (
                      <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
                        <span style={{ color: "#D4CCBC", fontFamily: "monospace" }}>├──</span>
                        <span style={{ color: t.color, fontWeight: "600" }}>{t.label}</span>
                        <span style={{ color: "#A09789", fontSize: "10.5px" }}>{t.when} · {t.tense}</span>
                      </div>
                    ))}
                    {ENTRY_THREADS.map((th, i) => (
                      <div key={th.label} style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
                        <span style={{ color: "#D4CCBC", fontFamily: "monospace" }}>{i === ENTRY_THREADS.length - 1 ? "└──" : "├──"}</span>
                        <span style={{ color: "#4A4033", fontWeight: "600" }}>{th.label}</span>
                        <span style={{ color: "#A09789", fontSize: "10.5px" }}>{th.role.toLowerCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary — cross-segment */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
                  <span style={{ color: "#C2B8A6", fontFamily: "monospace" }}>└──</span>
                  <span style={{ color: "#97701F", fontWeight: "700" }}>⬡ Itinerary</span>
                  <span style={{ color: "#A09789", fontSize: "11px" }}>Cross-segment — strings entries into a route</span>
                </div>
              </div>

              <div style={{ marginTop: "20px", borderTop: "1px solid #E4DED2", paddingTop: "16px", color: "#877E70", fontSize: "11px", lineHeight: "1.7" }}>
                Each district carries all three segments. They differ only in their <strong style={{ color: "#6F5F48" }}>subject</strong> —
                a place, a food, a craft — but every entry shares one <strong style={{ color: "#6F5F48" }}>anatomy</strong> (below).
                The itinerary is cross-segment: it strings chosen entries into a route.
              </div>
            </div>

            {/* Segment brand pills */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { name: "SamsKruti", color: "#C8652A", bg: "#FBEEE4", role: "Parent brand · hub · itinerary provider" },
                { name: "Sheher Ki Galiyan", color: "#3D7050", bg: "#E6F0EA", role: "Segment I · Heritage" },
                { name: "Sheher Ka Swaad", color: "#A83828", bg: "#FBEAE6", role: "Segment II · Food" },
                { name: "Sheher Ka Hriday", color: "#4F76B0", bg: "#E9EEF7", role: "Segment III · Crafts" },
              ].map(s => (
                <div key={s.name} style={{
                  background: s.bg,
                  border: `1px solid ${s.color}33`,
                  borderLeft: `3px solid ${s.color}`,
                  borderRadius: "3px",
                  padding: "10px 16px",
                  flex: "1",
                  minWidth: "200px",
                }}>
                  <div style={{ color: s.color, fontWeight: "600", fontSize: "12px", marginBottom: "2px" }}>{s.name}</div>
                  <div style={{ color: "#8C8478", fontSize: "11px" }}>{s.role}</div>
                </div>
              ))}
            </div>

            {/* Anatomy of an entry — same six facets across all three segments */}
            <div>
              <p style={{ color: "#C8652A", letterSpacing: "1.5px", fontSize: "10px", textTransform: "uppercase", marginBottom: "8px" }}>
                Anatomy of an entry
              </p>
              <p style={{ color: "#6F5F48", fontSize: "12px", lineHeight: "1.7", marginBottom: "6px", maxWidth: "680px" }}>
                Every entry shares the same six facets — three tenses of time
                (<strong style={{ color: "#2B2620" }}>History · Memory · Continuity</strong>), told through
                <strong style={{ color: "#2B2620" }}> Stories</strong>, carried by
                <strong style={{ color: "#2B2620" }}> People</strong>, reached via
                <strong style={{ color: "#2B2620" }}> Experience</strong> — specialised to each segment below.
              </p>
              <p style={{ color: "#877E70", fontSize: "11px", fontStyle: "italic", marginBottom: "18px" }}>
                “Not preserved. Practiced. Continued.” — <span style={{ color: "#6F5F48" }}>History · Memory · Continuity.</span>
              </p>

              <div style={{ display: "grid", gap: "14px" }}>
                {SEGMENT_ANATOMY.map((seg) => (
                  <div key={seg.name} style={{
                    background: "#FFFFFF",
                    border: "1px solid #E4DED2",
                    borderLeft: `3px solid ${seg.color}`,
                    borderRadius: "4px",
                    padding: "18px 20px",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                      <span style={{ color: seg.color, fontWeight: "700", fontSize: "13px" }}>{seg.name}</span>
                      <span style={{ color: "#8C8478", fontSize: "11px" }}>an entry = {seg.subject}</span>
                    </div>

                    {/* three tenses */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "12px" }}>
                      {ENTRY_TENSES.map((t) => (
                        <div key={t.label} style={{
                          background: "#F1EDE4",
                          border: "1px solid #E4DED2",
                          borderTop: `2px solid ${t.color}`,
                          borderRadius: "3px",
                          padding: "10px 12px",
                        }}>
                          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "5px" }}>
                            <span style={{ color: t.color, fontWeight: "700", fontSize: "12px" }}>{t.label}</span>
                            <span style={{ color: "#877E70", fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>{t.when} · {t.tense}</span>
                          </div>
                          <div style={{ color: "#8C8478", fontSize: "10.5px", lineHeight: "1.55" }}>{seg.tense[t.label]}</div>
                        </div>
                      ))}
                    </div>

                    {/* three threads */}
                    <div style={{ display: "grid", gap: "6px", borderTop: "1px solid #EAE4D8", paddingTop: "12px" }}>
                      {ENTRY_THREADS.map((th) => (
                        <div key={th.label} style={{ display: "flex", gap: "10px", alignItems: "baseline", flexWrap: "wrap" }}>
                          <span style={{ color: "#877E70", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", width: "84px", flexShrink: 0 }}>{th.role}</span>
                          <span style={{ color: "#2B2620", fontWeight: "600", fontSize: "11.5px", width: "80px", flexShrink: 0 }}>{th.label}</span>
                          <span style={{ color: "#8C8478", fontSize: "10.5px", lineHeight: "1.55", flex: 1, minWidth: "180px" }}>{seg.thread[th.label]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>
        )}

        {/* ── Section 2: District Seed List ── */}
        {active === "districts" && (
        <Section title="02 · Districts — Seed List" subtitle="The 12 Jyotirlinga cities on the map · focus areas per segment">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #D9D1C2" }}>
                  {["State", "City", "Jyotirlinga", "Galiyan Focus", "Parampara Focus", "Hriday Focus", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6F5F48", fontWeight: "400", letterSpacing: "1.5px", fontSize: "10px", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRICTS.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #EEE8DD" }}>
                    <td style={{ padding: "10px 12px", color: "#6F5F48" }}>{d.state}</td>
                    <td style={{ padding: "10px 12px", color: "#1C1815", fontWeight: "600" }}>{d.district}</td>
                    <td style={{ padding: "10px 12px", color: "#97701F" }}>{d.temple}</td>
                    <td style={{ padding: "10px 12px", color: "#3D7050" }}>{d.galiyanFocus}</td>
                    <td style={{ padding: "10px 12px", color: "#A83828" }}>{d.paramparaFocus}</td>
                    <td style={{ padding: "10px 12px", color: "#4F76B0" }}>{d.hridayFocus}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "12px", lineHeight: "1.7" }}>
            These 12 cities are the live navigation (src/data/map-cities.ts). Note: the
            <code style={{ color: "#6F5F48" }}> src/data/districts/</code> folder currently also holds metro
            sample data (Kolkata, Jaipur, Mumbai, Delhi) from an earlier pass — that content is not yet
            mapped to a Jyotirlinga city on the roadmap.
          </p>
        </Section>
        )}

        {/* ── Section 3: Data Model ── */}
        {active === "data" && (
        <Section title="03 · Data Model" subtitle="TypeScript type definitions — the canonical schema">
          <pre style={{
            background: "#F1EDE4",
            border: "1px solid #E4DED2",
            borderRadius: "4px",
            padding: "28px",
            overflowX: "auto",
            color: "#37423A",
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.8",
            whiteSpace: "pre",
          }}>{DATA_MODEL}</pre>
        </Section>
        )}

        {/* ── Section 4: Map System ── */}
        {active === "maps" && (
        <Section title="04 · Map System" subtitle="Three map surfaces, two data sources, one set of ideal points">
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              {
                surface: "Landing map",
                route: "/",
                component: "landing-client → google-india-map + city-dots",
                tech: "Google Maps (satellite, SAMSKRUTI_DARK)",
                behaviour: "India view with Jyotirlinga city dots. Clicking a city zooms in, fades, then routes to /<district>. Navigation-based.",
                color: "#C8652A",
              },
              {
                surface: "Map explorer",
                route: "/maps",
                component: "india-map-explorer",
                tech: "Google Maps + rAF camera fly",
                behaviour: "India ↔ Varanasi zoom IN PLACE — no navigation. India dots → click active city → fly to city → segment-coded ideal points. 'Back to India' control. The exploration surface.",
                color: "#B07A1E",
              },
              {
                surface: "District hero map",
                route: "/varanasi",
                component: "site-hero → google-varanasi-map + varanasi-dots",
                tech: "Google Maps (non-interactive backdrop)",
                behaviour: "Static framed city map behind the hero, with the same ideal points as decorative dots. Sets the scene above the three doorways.",
                color: "#4F76B0",
              },
            ].map((m) => (
              <div key={m.surface} style={{
                background: "#FFFFFF",
                border: "1px solid #E4DED2",
                borderLeft: `3px solid ${m.color}`,
                borderRadius: "4px",
                padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ color: "#1C1815", fontWeight: "600", fontSize: "13px" }}>{m.surface}</span>
                  <code style={{ color: m.color, fontFamily: "monospace", fontSize: "11px" }}>{m.route}</code>
                  <span style={{ color: "#877E70", fontSize: "10px", letterSpacing: "0.5px" }}>{m.tech}</span>
                </div>
                <div style={{ color: "#6F5F48", fontSize: "11px", fontFamily: "monospace", marginBottom: "6px" }}>{m.component}</div>
                <div style={{ color: "#8C8478", fontSize: "12px", lineHeight: "1.7" }}>{m.behaviour}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "14px", lineHeight: "1.7" }}>
            <strong style={{ color: "#6F5F48" }}>Geometry data is separate from content.</strong> India cities live in{" "}
            <code style={{ color: "#6F5F48" }}>src/data/map-cities.ts</code> (MAP_CITIES — 12 Jyotirlingas, one active).
            Varanasi ideal points live in <code style={{ color: "#6F5F48" }}>src/data/varanasi-places.ts</code> (PLACES, segment-coded),
            shared so the hero overlay and the explorer never drift. Boundary outlines are fetched at runtime from{" "}
            <code style={{ color: "#6F5F48" }}>public/data/*.json</code> (Topo/GeoJSON) and drawn on the Google Maps data layer —
            including <code style={{ color: "#6F5F48" }}>india-north-claimed.json</code> for the corrected northern border.
          </p>
        </Section>
        )}

        {/* ── Section 5: File Organisation ── */}
        {active === "structure" && (
        <Section title="05 · File Organisation" subtitle="Grouped by subsystem (the role a file plays), not by folder">

          {/* Flow strip — how the structure actually moves */}
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E4DED2",
            borderRadius: "4px",
            padding: "20px 24px",
            marginBottom: "20px",
            display: "grid",
            gap: "12px",
          }}>
            {FLOWS.map((f) => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ color: "#877E70", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", width: "120px", flexShrink: 0 }}>
                  {f.label}
                </span>
                {f.steps.map((step, i) => (
                  <span key={step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {i > 0 && <span style={{ color: "#C8652A" }}>→</span>}
                    <code style={{
                      background: "#EEE8DD",
                      border: "1px solid #D9D1C2",
                      borderRadius: "3px",
                      padding: "4px 9px",
                      color: "#2B2620",
                      fontFamily: "monospace",
                      fontSize: "11px",
                    }}>{step}</code>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Subsystem layer cards */}
          <div style={{ display: "grid", gap: "12px" }}>
            {LAYERS.map((layer) => (
              <div key={layer.name} style={{
                background: "#FFFFFF",
                border: "1px solid #E4DED2",
                borderLeft: `3px solid ${layer.color}`,
                borderRadius: "4px",
                padding: "18px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ color: layer.color, fontWeight: "600", fontSize: "13px" }}>{layer.name}</span>
                  <code style={{ color: "#6F5F48", fontFamily: "monospace", fontSize: "11px" }}>{layer.where}</code>
                </div>
                <p style={{ color: "#8C8478", fontSize: "12px", lineHeight: "1.6", marginBottom: "12px" }}>{layer.blurb}</p>
                <div style={{ display: "grid", gap: "5px" }}>
                  {layer.files.map((file) => (
                    <div key={file.path} style={{ display: "flex", gap: "12px", alignItems: "baseline", flexWrap: "wrap" }}>
                      <code style={{ color: "#37423A", fontFamily: "monospace", fontSize: "11.5px", minWidth: "260px", flexShrink: 0 }}>{file.path}</code>
                      <span style={{ color: "#877E70", fontSize: "11px" }}>{file.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "14px", lineHeight: "1.7" }}>
            Paths are relative to <code style={{ color: "#6F5F48" }}>src/</code> unless prefixed. New files
            should join an existing subsystem; the map system stays split between{" "}
            <code style={{ color: "#6F5F48" }}>components/site</code> (render),{" "}
            <code style={{ color: "#6F5F48" }}>data</code> (point geometry), and{" "}
            <code style={{ color: "#6F5F48" }}>public/data</code> (boundary geometry) on purpose.
          </p>
        </Section>
        )}

        {/* ── Section 6: Route Map ── */}
        {active === "routes" && (
        <Section title="06 · Route Map" subtitle="All frontend routes — live and planned">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #D9D1C2" }}>
                  {["Path", "Description", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6F5F48", fontWeight: "400", letterSpacing: "1.5px", fontSize: "10px", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #EEE8DD" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#C8652A", fontSize: "11px" }}>{r.path}</td>
                    <td style={{ padding: "10px 12px", color: "#2B2620" }}>{r.description}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        )}

        {/* ── Section 7: Content & Research ── */}
        {active === "content" && (
        <Section title="07 · Content & Research" subtitle="The library — every entry by hierarchy: what we have, and what's still to gather">
          {/* Chapter heading + the 12-Jyotirlinga origin (why they exist) */}
          <div style={{ marginBottom: "18px" }}>
            <p style={{ color: "#97701F", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
              {CHAPTER_TITLE}
            </p>
            <div style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderLeft: "3px solid #97701F", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ color: "#6F5F48", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
                Why the Jyotirlingas exist · the chapter root
              </p>
              <HistoryStack history={JYOTIRLINGA_ORIGIN} label="Origin" />
            </div>
          </div>

          {/* The library — collapsible store, by hierarchy */}
          <p style={{ color: "#877E70", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
            The library · what we have, by hierarchy
          </p>
          <div style={{ marginBottom: "24px" }}>
            {CONTENT_LIBRARY.map((d) => {
              const all = d.segments.flatMap((s) => s.entries);
              const withContent = all.filter((e) => e.status !== "todo").length;
              return (
                <details key={d.slug} open style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderRadius: "4px", marginBottom: "12px", padding: "4px 0" }}>
                  <summary style={{ cursor: "pointer", padding: "12px 18px", color: "#1C1815", fontWeight: "600", fontSize: "13px" }}>
                    {d.district}
                    <span style={{ color: "#877E70", fontWeight: "400", fontSize: "11px", marginLeft: "10px" }}>{all.length} entries · {withContent} with content</span>
                  </summary>
                  <div style={{ padding: "0 18px 12px" }}>
                    {d.origin && (
                      <div style={{ borderBottom: "1px solid #EAE4D8", paddingBottom: "14px", marginBottom: "6px" }}>
                        <p style={{ color: "#C8652A", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", margin: "10px 0 8px" }}>
                          Why this city exists · the root
                        </p>
                        <HistoryStack history={d.origin} label="Origin" />
                        <p style={{ color: "#877E70", fontSize: "10.5px", fontStyle: "italic", paddingLeft: "94px" }}>
                          From this root, three doorways branch — Galiyan · Parampara · Hriday. Every entry below traces back here.
                        </p>
                      </div>
                    )}
                    {d.segments.map((s) => {
                      const done = s.entries.filter((e) => e.status !== "todo").length;
                      return (
                        <details key={s.segment} style={{ marginTop: "8px", borderTop: "1px solid #EAE4D8", paddingTop: "8px" }}>
                          <summary style={{ cursor: "pointer", padding: "6px 0", color: s.color, fontWeight: "600", fontSize: "12px" }}>
                            {s.label}
                            <span style={{ color: "#877E70", fontWeight: "400", fontSize: "10.5px", marginLeft: "8px" }}>{done}/{s.entries.length}</span>
                          </summary>
                          <div style={{ paddingLeft: "12px" }}>
                            {s.entries.map((e) => (
                              <details key={e.slug} style={{ borderLeft: `2px solid ${s.color}33`, paddingLeft: "12px", margin: "8px 0" }}>
                                <summary style={{ cursor: "pointer", padding: "4px 0" }}>
                                  <span style={{ color: "#2B2620", fontWeight: "600", fontSize: "12px" }}>{e.name}</span>
                                  {e.hindiName && <span style={{ color: "#6F5F48", fontSize: "11px", marginLeft: "6px" }}>{e.hindiName}</span>}
                                  <span style={{ color: "#877E70", fontSize: "10px", marginLeft: "8px" }}>{e.subject}{e.type ? ` · ${e.type}` : ""}</span>
                                  <span style={{ marginLeft: "8px" }}><StatusBadge status={e.status} /></span>
                                  {e.vitality && <span style={{ color: "#8C8478", fontSize: "9px", letterSpacing: "0.5px", marginLeft: "8px" }}>{e.vitality}</span>}
                                </summary>
                                <div style={{ padding: "10px 0 12px" }}>
                                  {/* Images — at least five per entry */}
                                  {e.images && e.images.length > 0 && (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                                      {e.images.map((img) => (
                                        <figure key={img.src} style={{ margin: 0, width: "132px" }}>
                                          {img.pending ? (
                                            <div style={{ width: "132px", height: "88px", borderRadius: "3px", border: "1px dashed #D4CCBC", background: "#F1EDE4", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2B8A6", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" }}>
                                              Photo pending
                                            </div>
                                          ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img.src} alt={img.alt} style={{ width: "132px", height: "88px", objectFit: "cover", borderRadius: "3px", border: "1px solid #E4DED2", display: "block" }} />
                                          )}
                                          <figcaption style={{ marginTop: "4px", color: "#8C8478", fontSize: "9.5px", lineHeight: "1.4" }}>
                                            {img.caption}
                                            {img.hindiCaption && <span style={{ display: "block", color: "#877E70" }}>{img.hindiCaption}</span>}
                                          </figcaption>
                                        </figure>
                                      ))}
                                    </div>
                                  )}

                                  {/* History — why this place → its stories */}
                                  {e.history && <HistoryStack history={e.history} label="History" />}

                                  {/* Facets — English + Hindi */}
                                  {FACET_META.map((f) => {
                                    const v = e.facets[f.key];
                                    return (
                                      <div key={f.key} style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "9px", flexWrap: "wrap" }}>
                                        <span style={{ color: f.color, fontWeight: "600", fontSize: "10px", letterSpacing: "0.5px", width: "84px", flexShrink: 0, textTransform: "uppercase" }}>{f.label}</span>
                                        {v ? (
                                          <span style={{ flex: 1, minWidth: "240px" }}>
                                            <span style={{ display: "block", color: "#5F574B", fontSize: "11px", lineHeight: "1.6" }}>{v.en}</span>
                                            <span style={{ display: "block", color: "#5C544A", fontSize: "11px", lineHeight: "1.75", marginTop: "3px" }}>{v.hi}</span>
                                          </span>
                                        ) : (
                                          <span style={{ color: "#C2B8A6", fontSize: "11px", fontStyle: "italic", flex: 1, minWidth: "240px" }}>— not gathered yet</span>
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Sources — always links */}
                                  {e.sources && e.sources.length > 0 && (
                                    <div style={{ marginTop: "10px", borderTop: "1px solid #EAE4D8", paddingTop: "8px" }}>
                                      <span style={{ color: "#877E70", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" }}>Sources</span>
                                      <ul style={{ margin: "4px 0 0", paddingLeft: "16px", color: "#877E70", fontSize: "10.5px", lineHeight: "1.7" }}>
                                        {e.sources.map((src) => (
                                          <li key={src.url}>
                                            <a href={src.url} target="_blank" rel="noreferrer" style={{ color: "#4A6B58" }}>{src.label}</a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {e.clipPrompt && (
                                    <div style={{ marginTop: "10px", borderTop: "1px solid #EAE4D8", paddingTop: "8px" }}>
                                      <span style={{ color: "#877E70", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" }}>Story-clip prompt</span>
                                      <p style={{ color: "#5C544A", fontSize: "10.5px", lineHeight: "1.65", marginTop: "4px", fontStyle: "italic", whiteSpace: "pre-wrap" }}>{e.clipPrompt}</p>
                                    </div>
                                  )}
                                  {e.connects && e.connects.length > 0 && (
                                    <div style={{ marginTop: "10px", borderTop: "1px solid #EAE4D8", paddingTop: "8px" }}>
                                      <span style={{ color: "#877E70", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" }}>Connects to</span>
                                      <div style={{ display: "grid", gap: "5px", marginTop: "5px" }}>
                                        {e.connects.map((c) => (
                                          <div key={c.slug} style={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
                                            <span style={{ color: "#4A6B58", fontWeight: "600", fontSize: "11px", flexShrink: 0 }}>↔ {c.label}</span>
                                            <span style={{ color: "#877E70", fontSize: "10.5px", lineHeight: "1.55", flex: 1, minWidth: "200px" }}>{c.note}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </details>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>

          {/* The place to do it */}
          <p style={{ color: "#877E70", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
            The place to do it
          </p>
          <div style={{ background: "#FFFFFF", border: "1px solid #E4DED2", borderRadius: "4px", padding: "18px 22px" }}>
            <div style={{ display: "grid", gap: "8px" }}>
              {CONTENT_PLACE.map((row) => (
                <div key={row.path} style={{ display: "flex", gap: "12px", alignItems: "baseline", flexWrap: "wrap" }}>
                  <code style={{ color: "#37423A", fontFamily: "monospace", fontSize: "11.5px", minWidth: "230px", flexShrink: 0 }}>{row.path}</code>
                  <span style={{ color: "#877E70", fontSize: "11px" }}>{row.note}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "12px", lineHeight: "1.7" }}>
            Draft in markdown in <code style={{ color: "#6F5F48" }}>content/</code>, then publish the finished entry into{" "}
            <code style={{ color: "#6F5F48" }}>src/data/districts/</code>. Milestone: every mapped Varanasi place, food &amp; craft as a full, verified entry.
          </p>
        </Section>
        )}

        {/* ── Section 8: Project Plan ── */}
        {active === "plan" && (
        <Section title="08 · Project Plan" subtitle="One task a day · Mon → Fri · finished one by one">
          <p style={{ color: "#6F5F48", fontSize: "12px", lineHeight: "1.7", marginBottom: "18px", maxWidth: "660px" }}>
            <strong style={{ color: "#2B2620" }}>Week 1:</strong> Chapter 1 and the Varanasi story are locked — now we finish the places one by one, starting with Kashi Vishwanath.
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {PROJECT_PLAN.map((d, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "14px",
                alignItems: "baseline",
                background: "#FFFFFF",
                border: "1px solid #E4DED2",
                borderLeft: d.done ? "3px solid #3D7050" : "3px solid #D9D1C2",
                borderRadius: "4px",
                padding: "14px 18px",
              }}>
                <span style={{ color: d.done ? "#3D7050" : "#877E70", fontSize: "14px", flexShrink: 0 }}>{d.done ? "☑" : "☐"}</span>
                <span style={{ color: d.done ? "#877E70" : "#1C1815", fontWeight: "600", fontSize: "12px", width: "92px", flexShrink: 0 }}>{d.date}</span>
                <span style={{ color: d.done ? "#877E70" : "#4A4033", fontSize: "12px", lineHeight: "1.6", textDecoration: d.done ? "line-through" : "none" }}>{d.task}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "14px", lineHeight: "1.7" }}>
            Tick a task by flipping <code style={{ color: "#6F5F48" }}>done: true</code> in the PROJECT_PLAN list — or just tell me and I&apos;ll mark it. Each finished entry is one notch of consistency.
          </p>
        </Section>
        )}

        {/* ── Section 9: Versions ── */}
        {active === "versions" && (
        <Section title="09 · Versions" subtitle="What SamsKruti is, version by version — building toward a focused pitch">
          <p style={{ color: "#6F5F48", fontSize: "12px", lineHeight: "1.8", marginBottom: "28px", maxWidth: "70ch" }}>
            A living narrative of the application — one entry per milestone. The point is to make
            the idea sayable out loud: what it is, who it&apos;s for, why it exists, and how it
            becomes a business. By the latest version, this should read as a confident pitch.
          </p>

          <div style={{ display: "grid", gap: "20px" }}>
            {APP_VERSIONS.map((v, i) => {
              const latest = i === APP_VERSIONS.length - 1;
              return (
                <div key={v.version} style={{
                  background: "#FFFFFF",
                  border: `1px solid ${latest ? "#C8652A" : "#E4DED2"}`,
                  borderRadius: "6px",
                  overflow: "hidden",
                }}>
                  {/* header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 22px", borderBottom: "1px solid #EAE4D8", background: latest ? "rgba(200,101,42,0.06)" : "transparent" }}>
                    <span style={{ background: latest ? "#C8652A" : "#D9D1C2", color: latest ? "#0A0807" : "#4A4033", fontWeight: "700", fontSize: "12px", letterSpacing: "1px", padding: "4px 10px", borderRadius: "3px" }}>{v.version.toUpperCase()}</span>
                    <span style={{ color: "#1C1815", fontWeight: "600", fontSize: "15px" }}>{v.name}</span>
                    <span style={{ marginLeft: "auto", color: "#877E70", fontSize: "11px" }}>{v.date}{latest ? " · current" : ""}</span>
                  </div>

                  <div style={{ padding: "20px 22px", display: "grid", gap: "16px" }}>
                    <p style={{ color: "#B0642A", fontStyle: "italic", fontSize: "15px", lineHeight: "1.5" }}>{v.oneLiner}</p>
                    <p style={{ color: "#33302A", fontSize: "13px", lineHeight: "1.75" }}>{v.whatItIs}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                      {[
                        { k: "For whom", val: v.audience },
                        { k: "What we're doing", val: v.doing },
                        { k: "The business", val: v.business },
                      ].map((f) => (
                        <div key={f.k} style={{ background: "#F1EDE4", border: "1px solid #EAE4D8", borderRadius: "4px", padding: "12px 14px" }}>
                          <div style={{ color: "#C8652A", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "6px" }}>{f.k}</div>
                          <div style={{ color: "#4A4033", fontSize: "12px", lineHeight: "1.6" }}>{f.val}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div style={{ color: "#877E70", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>What shipped</div>
                      <div style={{ display: "grid", gap: "5px" }}>
                        {v.highlights.map((h) => (
                          <div key={h} style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                            <span style={{ color: latest ? "#C8652A" : "#3D7050", fontSize: "12px", flexShrink: 0 }}>◆</span>
                            <span style={{ color: "#5C544A", fontSize: "12px", lineHeight: "1.6" }}>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ color: "#877E70", fontSize: "11px", marginTop: "18px", lineHeight: "1.7" }}>
            Add a version in <code style={{ color: "#6F5F48" }}>src/data/app-versions.ts</code> — or tell me when to bump and I&apos;ll capture what changed.
          </p>
        </Section>
        )}

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid #E4DED2", marginTop: "64px", paddingTop: "24px", color: "#C2B8A6", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
          <span>SamsKruti Internal Architecture Reference</span>
          <span>Not for public distribution · noindex</span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function TabNav({ active, activeBucket }: { active: TabId; activeBucket: BucketId }) {
  const bucket = BUCKETS.find((b) => b.id === activeBucket)!;
  const sections = TABS.filter((t) => t.bucket === activeBucket);
  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Bucket row */}
      <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", borderBottom: "1px solid #D9D1C2" }}>
        {BUCKETS.map((b) => {
          const on = b.id === activeBucket;
          return (
            <Link
              key={b.id}
              href={`/internal?tab=${firstTabOf(b.id)}`}
              scroll={false}
              style={{
                padding: "11px 18px",
                textDecoration: "none",
                fontSize: "13px",
                letterSpacing: "0.4px",
                color: on ? "#1C1815" : "#6F5F48",
                borderBottom: on ? "2px solid #C8652A" : "2px solid transparent",
                marginBottom: "-1px",
                fontWeight: on ? "600" : "400",
              }}
            >
              {b.label}
            </Link>
          );
        })}
      </div>

      {/* Active bucket blurb */}
      <p style={{ color: "#877E70", fontSize: "12px", margin: "14px 0 16px", lineHeight: "1.6", maxWidth: "640px" }}>
        {bucket.blurb}
      </p>

      {/* Section sub-tabs within the bucket */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {sections.map((t) => {
          const on = t.id === active;
          return (
            <Link
              key={t.id}
              href={`/internal?tab=${t.id}`}
              scroll={false}
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "7px",
                padding: "7px 13px",
                textDecoration: "none",
                fontSize: "11.5px",
                letterSpacing: "0.5px",
                borderRadius: "3px",
                color: on ? "#1C1815" : "#6F5F48",
                background: on ? "#ECE5D8" : "transparent",
                border: on ? "1px solid #D9D1C2" : "1px solid transparent",
                fontWeight: on ? "600" : "400",
              }}
            >
              <span style={{ color: on ? "#C8652A" : "#877E70", fontFamily: "monospace", fontSize: "10px" }}>{t.num}</span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Renders "why this place/city" + its named story-sections (each a dropdown
// with an image prompt). Shared by the city Origin and every entry's History.
function HistoryStack({ history, label }: { history: EntryHistory; label: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "baseline", flexWrap: "wrap", marginBottom: "8px" }}>
        <span style={{ color: "#6F5F48", fontWeight: "600", fontSize: "10px", letterSpacing: "0.5px", width: "84px", flexShrink: 0, textTransform: "uppercase" }}>{label}</span>
        {history.intro && (
          <span style={{ flex: 1, minWidth: "240px" }}>
            <span style={{ display: "block", color: "#5F574B", fontSize: "11px", lineHeight: "1.6" }}>{history.intro.en}</span>
            <span style={{ display: "block", color: "#5C544A", fontSize: "11px", lineHeight: "1.75", marginTop: "3px" }}>{history.intro.hi}</span>
          </span>
        )}
      </div>
      <div style={{ display: "grid", gap: "6px", paddingLeft: "94px" }}>
        {history.sections.map((st) => (
          <details key={st.id} style={{ borderLeft: "2px solid #D9D1C2", paddingLeft: "12px" }}>
            <summary style={{ cursor: "pointer", padding: "3px 0" }}>
              <span style={{ color: "#4A4033", fontWeight: "600", fontSize: "11.5px" }}>{st.title}</span>
              {st.hindiTitle && <span style={{ color: "#8C8478", fontSize: "10.5px", marginLeft: "6px" }}>· {st.hindiTitle}</span>}
            </summary>
            <div style={{ padding: "6px 0 8px" }}>
              <span style={{ display: "block", color: "#5F574B", fontSize: "11px", lineHeight: "1.6" }}>{st.en}</span>
              <span style={{ display: "block", color: "#5C544A", fontSize: "11px", lineHeight: "1.75", marginTop: "3px" }}>{st.hi}</span>
              {st.imagePrompt && (
                <div style={{ marginTop: "7px", display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ color: "#877E70", fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>Image prompt</span>
                  <span style={{ color: "#877E70", fontSize: "10px", fontStyle: "italic", lineHeight: "1.55", flex: 1, minWidth: "200px" }}>{st.imagePrompt}</span>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
      {history.sources && history.sources.length > 0 && (
        <ul style={{ margin: "8px 0 0", paddingLeft: "110px", color: "#877E70", fontSize: "10px", lineHeight: "1.6", listStyle: "none" }}>
          {history.sources.map((s) => (
            <li key={s.url}>↳ <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "#4A6B58" }}>{s.label}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    active: { bg: "#3D705022", fg: "#3D7050" },
    live:   { bg: "#3D705022", fg: "#3D7050" },
    seeded: { bg: "#97701F22", fg: "#97701F" },
    proposed:{ bg: "#C8652A22", fg: "#C8652A" },
    planned:{ bg: "#D9D1C2",   fg: "#877E70" },
    todo:        { bg: "#D9D1C2",   fg: "#877E70" },
    researching: { bg: "#97701F22", fg: "#97701F" },
    draft:       { bg: "#C8652A22", fg: "#C8652A" },
    published:   { bg: "#3D705022", fg: "#3D7050" },
  };
  const { bg, fg } = palette[status] ?? palette.planned;
  return (
    <span style={{
      background: bg,
      color: fg,
      padding: "2px 8px",
      borderRadius: "20px",
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
    }}>{status}</span>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "64px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "400", color: "#1C1815", marginBottom: "4px" }}>{title}</h2>
        <p style={{ color: "#877E70", fontSize: "12px" }}>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function TreeNode({ color, dot, label, sublabel, indent, connector }: {
  color: string; dot: string; label: string; sublabel: string; indent: number; connector?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px", paddingLeft: `${indent * 24}px` }}>
      <span style={{ color: "#C2B8A6", whiteSpace: "pre", fontFamily: "monospace" }}>{dot}</span>
      <span style={{ color, fontWeight: "600" }}>{label}</span>
      <span style={{ color: "#A09789", fontSize: "11px" }}>{sublabel}</span>
    </div>
  );
}

