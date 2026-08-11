// Canonical Varanasi "ideal points" — the ghats, lanes, kitchens, and
// artisan quarters that the city is entered through. Shared by the SVG
// district map (varanasi-district-map.tsx) and the hero dot overlay
// (varanasi-dots.tsx) so the two never drift apart.

export type VaranasiSegment = "galiyan" | "parampara" | "hriday";

// Segment colours (order: Hriday → Galiyan → Swaad)
export const SEG: Record<VaranasiSegment, string> = {
  hriday: "#4F76B0",
  galiyan: "#3D7050",
  parampara: "#A83828",
};

export const SEG_LABELS: Record<VaranasiSegment, string> = {
  hriday: "Sheher Ka Hriday",
  galiyan: "Sheher Ki Galiyan",
  parampara: "Sheher Ka Swaad",
};

// Short English descriptor for the hover card.
export const SEG_KIND: Record<VaranasiSegment, string> = {
  hriday: "Artisan Quarter",
  galiyan: "Streets & Ghats",
  parampara: "Taste of the City",
};

export interface VaranasiPlace {
  name: string;
  hindi?: string;
  /** [longitude, latitude] */
  coords: [number, number];
  segment: VaranasiSegment;
  featured?: boolean;
  /** Show a label in the hero overlay. Reserved for well-separated points so
   *  the dense ghat cluster doesn't pile labels on top of each other. */
  heroLabel?: boolean;
}

export const PLACES: VaranasiPlace[] = [
  // ── Galiyan – Heritage & Streets ──────────────────────
  { name: "Dashashwamedh Ghat", hindi: "दशाश्वमेध घाट", coords: [83.0104, 25.3077], segment: "galiyan", featured: true, heroLabel: true },
  { name: "Manikarnika Ghat",   hindi: "मणिकर्णिका घाट", coords: [83.0095, 25.3142], segment: "galiyan", featured: true },
  { name: "Kashi Vishwanath",   hindi: "काशी विश्वनाथ",  coords: [83.0104, 25.3109], segment: "galiyan" },
  { name: "Assi Ghat",          hindi: "अस्सी घाट",      coords: [83.0065, 25.2808], segment: "galiyan", featured: true, heroLabel: true },
  { name: "Sarnath",            hindi: "सारनाथ",         coords: [83.0248, 25.3814], segment: "galiyan" },
  { name: "Ramnagar Fort",      hindi: "रामनगर किला",    coords: [83.0378, 25.2613], segment: "galiyan" },

  // ── Parampara – Food Traditions ────────────────────────
  { name: "Kachori Gali", hindi: "कचौरी गली", coords: [83.0073, 25.3095], segment: "parampara", featured: true },
  { name: "Godaulia",     hindi: "गोदौलिया",  coords: [83.0082, 25.3068], segment: "parampara", featured: true },
  { name: "Chowk Bazaar", hindi: "चौक बाज़ार", coords: [83.0072, 25.3126], segment: "parampara" },
  { name: "Lanka Market", hindi: "लंका",       coords: [83.0005, 25.2680], segment: "parampara" },

  // ── Hriday – Artisans & Crafts ─────────────────────────
  { name: "Madanpura",  hindi: "मदनपुरा",  coords: [83.0020, 25.3244], segment: "hriday", featured: true, heroLabel: true },
  { name: "Lallapura",  hindi: "लल्लापुरा", coords: [82.9790, 25.3440], segment: "hriday", featured: true, heroLabel: true },
  { name: "Peeli Kothi", hindi: "पीली कोठी", coords: [82.9900, 25.3350], segment: "hriday" },
  { name: "Adampura",   hindi: "आदमपुरा",  coords: [83.0050, 25.3390], segment: "hriday" },
];

// Shared camera view for the Varanasi hero — the Google map and the dot
// overlay both read this so they stay perfectly aligned. Centred on the
// district centroid and zoomed out to frame the entire administrative
// district outline within the half-width hero panel.
export const VARANASI_VIEW = {
  center: { lat: 25.372, lng: 82.927 },
  zoom: 11,
} as const;
