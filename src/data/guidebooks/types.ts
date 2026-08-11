// ── Guide Workbook — shared content contract ──────────────────────────────
// One reader engine (components/site/guide-book.tsx) renders any book that
// follows this shape. Each itinerary length (3/5/8/14 days) is its own data
// file exporting a GuideBookData. Content is plain, serialisable data — no
// functions — so a server route can hand it straight to the client reader.

export type CheckItem = {
  id: string;        // unique within the book (used as the saved-tick key)
  time?: string;     // e.g. "Before sunrise"
  label: string;     // the thing to do
  sub?: string;      // the "why", one line — the soul
  how?: string;      // the practical: how to get there / where
  cost?: string;     // rough cost, e.g. "~₹150, negotiate"
  tip?: string;      // one practical tip
};

export type ArrivalKey = "morning" | "afternoon" | "evening";

// A scannable link — in the printed book it becomes a QR code; on screen it is
// a tappable hook. The bridge from paper to the deep story / live "lost?" help.
export type ScanLink = { url: string; hook: string; label?: string };

export type Photo = {
  src?: string;      // a real image, or omit for an empty "paste here" frame
  caption: string;
  rot: number;       // tilt in degrees, for the scattered scrapbook feel
};

export type GuidePage =
  // A built cover: `image` = the photograph that fills the lower half, `logo` = the
  // brand medallion, `features` = the icon strip. Composed square, edge to edge.
  // `artwork` = a finished SQUARE cover image, rendered edge to edge (wins over the built cover).
  // Three ways to be a cover, in order of precedence:
  //   `artwork` — a finished square image, rendered edge to edge, as-is.
  //   `frame`   — the ornamental border art (see cover-frame.png) with the
  //               cover composed live on top of it, over an optional `image`
  //               that washes in behind. The meta box (duration / arrival /
  //               language) reads the reader's own choices, so it can never
  //               contradict the book it's wrapped around.
  //   neither   — a plain centred cover (title / sub / foot).
  | { kind: "cover"; dark?: boolean; deva?: string; title: string; sub: string; foot: string; artwork?: string; image?: string; frame?: string; logo?: string; logotype?: string; logoSub?: string; seal?: string; tagline?: string; features?: string[] }
  // A finished SQUARE page image, rendered edge to edge with no chrome — a
  // designed page dropped in whole (same idea as `cover.artwork`).
  | { kind: "artwork"; image: string; alt: string }
  | { kind: "epigraph"; dark?: boolean; line: string; sub: string }
  | { kind: "plate"; image: string; devanagari?: string; title: string; caption?: string; contain?: boolean } // full-bleed photo (contain = product shot on paper)
  | { kind: "map"; eyebrow: string; title: string; note?: string }                          // illustrated Varanasi map
  | { kind: "text"; eyebrow: string; devanagari?: string; title: string; body: string[]; hint?: string }
  | { kind: "checklist"; eyebrow: string; devanagari?: string; title: string; items: CheckItem[] }
  // pictures (+ one-liners / scan), or blank paste frames. `role` is the one
  // word the place plays in the day — "Seek permission", "Receive blessings".
  | { kind: "collage"; eyebrow?: string; devanagari?: string; title: string; lead?: string; tiles: { n: number; name: string; image?: string; sub?: string; role?: string }[]; paste?: boolean; link?: ScanLink }
  // compact timings (+ optional route map / paste frames). `snapshot` = the
  // at-a-glance figures for the whole route (distance, walk time, ride time).
  | { kind: "plan"; eyebrow?: string; devanagari?: string; title: string; lead?: string; steps: CheckItem[]; pasteCaptions?: string[]; mapTiles?: { n: number; name: string }[]; snapshot?: { label: string; value: string }[] }
  | { kind: "arrival"; eyebrow: string; devanagari?: string; title: string; variants: { key: ArrivalKey; label: string; lead: string; items: CheckItem[] }[] }
  | { kind: "gallery"; eyebrow: string; title: string; note?: string; photos: Photo[] }
  | { kind: "craft"; devanagari: string; name: string; maker: string; image?: string; story: string; addition: string; checkId?: string; link?: ScanLink }
  | { kind: "scrapbook"; eyebrow: string; title: string; prompt: string; slots: Photo[] }
  | { kind: "contact"; eyebrow: string; title: string; body: string[]; link?: ScanLink }
  | { kind: "colophon" }
  | { kind: "blank"; dark?: boolean }; // empty page (dark = an endpaper / inside cover)

export type GuideBookData = {
  slug: string;       // "3-day"
  days: number;       // 3
  topLabel: string;   // shown in the reader's top bar
  storeKey: string;   // localStorage key for this book's ticks (must be unique)
  pages: GuidePage[]; // even count preferred; the reader pads odd with a blank
};
