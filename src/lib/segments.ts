export type SegmentSlug = "galiyan" | "parampara" | "hriday";

export type Segment = {
  slug: SegmentSlug;
  name: string;
  devanagari: string;
  english: string;
  tagline: string;
  description: string;
  cta: string;
  seg: string;
  segDark: string;
  segBg: string;
};

// Order: Sheher Ka Hriday → Sheher Ki Galiyan → Sheher Ka Swaad.
export const SEGMENTS: Segment[] = [
  {
    slug: "hriday",
    name: "Sheher Ka Hriday",
    devanagari: "शहर का हृदय",
    english: "Heart of the City",
    tagline:
      "Behind every city is a community of artisans who make the objects it prays with, wears, and gives. Meet the weavers, potters, painters, and smiths who carry living knowledge in their hands.",
    description: "Heart of the City",
    cta: "Meet the makers",
    seg: "#4F76B0",
    segDark: "#2D4A7A",
    segBg: "#060810",
  },
  {
    slug: "galiyan",
    name: "Sheher Ki Galiyan",
    devanagari: "शहर की गलियाँ",
    english: "Streets of the City",
    tagline:
      "Enter the living fabric of India's great cities — through the rituals, the people, and the memories that define each place. Five cities. Four dimensions. Stories that do not simplify.",
    description: "Streets of the City",
    cta: "Enter the streets",
    seg: "#3D7050",
    segDark: "#1E4030",
    segBg: "#050F09",
  },
  {
    slug: "parampara",
    name: "Sheher Ka Swaad",
    devanagari: "शहर का स्वाद",
    english: "Taste of the City",
    tagline:
      "India's food is not cuisine — it is memory, geography, and devotion on a plate. Discover the ancient kitchens, the street inventors, and the dying recipes of India's great cities.",
    description: "Taste of the City",
    cta: "Enter the kitchen",
    seg: "#A83828",
    segDark: "#6A1C10",
    segBg: "#0D0302",
  },
];

export const SEGMENT_BY_SLUG: Record<SegmentSlug, Segment> = SEGMENTS.reduce(
  (acc, segment) => {
    acc[segment.slug] = segment;
    return acc;
  },
  {} as Record<SegmentSlug, Segment>,
);
