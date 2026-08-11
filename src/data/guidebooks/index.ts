import type { GuideBookData } from "./types";
import { VARANASI_3DAY } from "./varanasi-3day";
import { VARANASI_BLANK } from "./varanasi-blank";
import { HI, TE, translateBook } from "./translations";

// The books that are actually built, keyed by slug. Add the 5/8/14-day books
// here as we finish them — the tabs and reader pick them up automatically.
// TEMP (visual work): "3-day" points at the BLANK book while we perfect the
// book frame. To restore real content: set "3-day" back to VARANASI_3DAY.
export const GUIDEBOOKS: Record<string, GuideBookData> = {
  "3-day": VARANASI_BLANK,
  "3-day-content": VARANASI_3DAY, // real content, kept wired; not a visible tab
};

export type Lang = "en" | "hi" | "te";
export const LANGS: { key: Lang; label: string }[] = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
  { key: "te", label: "తెలుగు" },
];

// Resolve a book in the chosen language — missing strings fall back to English.
export function getGuideBook(slug: string, lang: Lang): GuideBookData | undefined {
  const en = GUIDEBOOKS[slug];
  if (!en) return undefined;
  if (lang === "hi") return translateBook(en, HI);
  if (lang === "te") return translateBook(en, TE);
  return en;
}

export type GuideBookMeta = {
  slug: string;
  days: number;
  label: string;   // tab label
  blurb: string;
  ready: boolean;  // false → shows a "coming soon" panel
};

// Every planned itinerary length — the tab order. `ready` flips to true when
// its book lands in GUIDEBOOKS above.
export const GUIDEBOOK_LIST: GuideBookMeta[] = [
  { slug: "3-day", days: 3, label: "3 Days", blurb: "The essential Kashi — the river, the makers, and Sarnath.", ready: true },
  { slug: "5-day", days: 5, label: "5 Days", blurb: "Kashi unhurried — room for the food, the music, and a slower river.", ready: false },
  { slug: "8-day", days: 8, label: "8 Days", blurb: "The city and its edges — temples, crafts, and a day beyond the ghats.", ready: false },
  { slug: "14-day", days: 14, label: "14 Days", blurb: "To live it, not visit it — the full slow pilgrimage of Kashi.", ready: false },
];
