// Sheher Ka Hriday — the commerce segment. Heritage Gift Boxes (the gateway
// product) + the GI-tagged Varanasi crafts inside them, and the artisans behind
// them. Sourced from the SamsKruti concept document + investor pitch.

export interface HridayBox {
  id: string;
  name: string;
  hindi: string;
  tier: string;
  price: string;
  delivery: string;
  contents: string[];
  forWhom: string;
  featured?: boolean;
}

export const HRIDAY_BOXES: HridayBox[] = [
  {
    id: "kashi-essentials",
    name: "The Kashi Essentials",
    hindi: "काशी की पहचान",
    tier: "Mid Range",
    price: "₹1,199",
    delivery: "Free across India · Ships in 3 days",
    contents: [
      "Banaras Hand Block Print Dupatta",
      "Gulabi Meenakari Pendant",
      "Rudraksha Mala (5 Mukhi)",
      "Hand-poured Beeswax Diyas (set of 3)",
      "Thandai Masala Mix",
      "SamsKruti Story Cards (5)",
    ],
    forWhom: "First-time gifting · Festivals · Birthdays",
    featured: true,
  },
  {
    id: "artisans-selection",
    name: "The Artisan's Selection",
    hindi: "कारीगर की दुनिया",
    tier: "Signature",
    price: "₹2,999",
    delivery: "Free across India · Ships in 5 days",
    contents: [
      "Banarasi Zardozi Stole",
      "Banaras Metal Repoussé Art Piece",
      "Gulabi Meenakari Jewellery Box",
      "Rudraksha Mala (108 beads)",
      "Premium Agarbatti Set",
      "Banarasi Paan Masala",
      "Story Cards (8)",
      "Handwritten Artisan Note",
    ],
    forWhom: "Weddings · Corporate gifting · Premium occasions",
  },
  {
    id: "heritage-collector",
    name: "The Heritage Collector",
    hindi: "विरासत का ख़ज़ाना",
    tier: "Bespoke · Luxury",
    price: "From ₹4,999",
    delivery: "Fully customisable · Ships in 7 days",
    contents: [
      "Banarasi Silk Saree or Brocade Fabric",
      "Banaras Wood Carving (signed original)",
      "Soft Stone Jali Decorative Item",
      "Banaras Glass Beads Necklace",
      "Premium Rudraksha (rare Mukhi)",
      "Handmade Kulhad Set (6)",
      "Story Cards (12)",
      "Certificate of Artisan Provenance",
    ],
    forWhom: "Collectors · Diaspora · Luxury occasions",
  },
];

export type HridayCategory = "Textile" | "Metal" | "Paper" | "Wood" | "Clay";

export interface HridayProduct {
  id: string;
  name: string;
  devanagari: string;
  category: HridayCategory;
  price: string;
  gi: boolean;
  image: string;
  blurb: string;
  /** Maker — name · role, lane. ILLUSTRATIVE until verified. */
  maker: string;
  /** The "why" — the maker's story; the hero of the addition. */
  story: string;
  /** Where the craft is made, [lng, lat], for the map dots. */
  coords: [number, number];
}

// The five focused crafts of Sheher Ka Hriday — one per material family.
// Maker names + stories are ILLUSTRATIVE until verified (see product docs).
export const HRIDAY_PRODUCTS: HridayProduct[] = [
  {
    id: "banarasi-saree", name: "Banarasi Silk Saree", devanagari: "बनारसी साड़ी",
    category: "Textile", price: "₹5K – ₹2L+", gi: true,
    image: "/data/images/hriday/banarasi-saree/product.png",
    blurb: "Handwoven zari brocade — Kashi's most patient art.",
    maker: "Raheem Ansari · Weaver, Madanpura",
    story: "For five centuries Banaras has woven silk threaded with real gold zari. A single saree takes weeks to months on a pit loom; its motifs carry Mughal-Persian and ancient Indian memory, learned by watching, never written down.",
    coords: [83.004, 25.306],
  },
  {
    id: "tamba", name: "Tamba — Copper & Brass", devanagari: "तांबा-पीतल",
    category: "Metal", price: "₹600 – ₹20K", gi: true,
    image: "/data/images/hriday/tamba/product.png",
    blurb: "Hand-hammered in the street of metal-beaters.",
    maker: "Vishwanath Kasera · Metalsmith, Thatheri Bazar",
    story: "In Thatheri Bazar the day begins with hammers. Copper and brass are beaten into the lamps and vessels Kashi prays with, and embossed by hand with deities — the same tools, the same forms, for centuries.",
    coords: [83.012, 25.312],
  },
  {
    id: "paper", name: "Banaras Handmade Paper", devanagari: "हस्तनिर्मित कागज़",
    category: "Paper", price: "₹150 – ₹3K", gi: false,
    image: "/data/images/hriday/paper/product.png",
    blurb: "Pulled from cotton rag, sheet by sheet.",
    maker: "Imran Ali · Paper-maker, Kashmiriganj",
    story: "Long before mills, Kashi made paper by hand from cotton rags — pulped, pulled on a screen, and sun-dried into thick deckle-edged sheets that hold ink like cloth holds dye.",
    coords: [82.998, 25.299],
  },
  {
    id: "wooden-toys", name: "Wooden Toys & Lacquerware", devanagari: "लकड़ी के खिलौने",
    category: "Wood", price: "₹50 – ₹3K", gi: true,
    image: "/data/images/hriday/wooden-toys/product.png",
    blurb: "Colour spun onto wood on a hand-lathe.",
    maker: "Ram Khelawan · Khilauna-maker, Khojwan",
    story: "When ivory was banned, Kashi's carvers turned to soft gular wood — shaping birds, gods and tops, then sealing them in lac dyed red, yellow and green while the piece spins on a hand-lathe. Made by some 200 families.",
    coords: [82.994, 25.295],
  },
  {
    id: "clay", name: "Clay — Kulhad & Pottery", devanagari: "मिट्टी के कुल्हड़",
    category: "Clay", price: "₹5 – ₹500", gi: false,
    image: "/data/images/hriday/clay/product.png",
    blurb: "Shaped from the river, returned to it.",
    maker: "Shyam Prajapati · Potter, Bhadaini",
    story: "From the clay of the Ganga's banks, Kashi's kumhars throw the kulhads that give ghat chai its earth-smell and the diyas that float at dusk — shaped in seconds, used once, returned to the earth.",
    coords: [83.000, 25.288],
  },
];

export const HRIDAY_ARTISAN = {
  name: "Raheem Ansari",
  craft: "Banarasi Silk Weaver",
  place: "Madanpura, Varanasi",
  image: "/data/images/hriday/banarasi-weave.jpg",
  story:
    "On a narrow lane in Madanpura, Raheem sits at a loom his grandfather built. He weaves Banarasi silk — but not just silk. Each motif carries the memory of centuries: some echo ancient Indian traditions, others the delicate Persian influence of the Mughal courts. None of it is written down. It is learned by watching, by repeating, by remembering. His son studies software engineering in Pune. What Raheem weaves is not just fabric — it is memory, threaded, lived, and slowly fading.",
  pull: "The man. The motif. The meaning.",
};
