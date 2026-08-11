import type { GuideBookData } from "./types";

// Working book — filling one spread at a time. Day 1 · Morning = 4 pages,
// designed around Aklavya's experience (see aklavya-persona-framework.md):
//   Page 4  the places I'll go — pictures + one-liners + scan the stories   [reduce anxiety]
//   Page 5  the plan — stops/timeline + the map                            [where & how]
//   Page 6  the places again — a grounding reference view                  [I'm walking them]
//   Page 7  what I did — paste my own photos                               [ownership]
// Content from SamsKruti_Varanasi_Itinerary.html (Day 1 · Slot 1). DRAFT.

// `role` = the one thing each place is *for*, so the six read as an arc rather
// than a list: permission -> protection -> blessings -> nourishment -> pause ->
// completion. From the Day 1 · Morning design.
const PLACES = [
  { n: 1, name: "Kal Bhairav", role: "Seek permission", sub: "The guardian of Kashi. Come here first." },
  { n: 2, name: "Maha Mrityunjaya", role: "Seek protection", sub: "The temple of the deathless mantra." },
  { n: 3, name: "Kashi Vishwanath", role: "Receive blessings", sub: "The golden Jyotirlinga — Kashi's heart.", image: "/data/images/varanasi/kashi-vishwanath.jpg" },
  { n: 4, name: "Annapurna Temple", role: "Receive nourishment", sub: "The goddess who feeds all of Kashi." },
  { n: 5, name: "Vishwanath Corridor", role: "Pause & reflect", sub: "The restored path down to the river." },
  { n: 6, name: "Vishalakshi", role: "Complete the journey", sub: "One of the 51 Shakti Peethas." },
];

export const VARANASI_BLANK: GuideBookData = {
  slug: "3-day",
  days: 3,
  topLabel: "Varanasi · Three Days",
  storeKey: "gb-varanasi-3day-work",
  pages: [
    {
      kind: "cover",
      frame: "/data/images/varanasi/cover-frame.png",   // ornament: mandala corners + rule
      image: "/data/images/varanasi/cover-bg-ghats.png", // washes in from the foot
      logotype: "SamsKruti",
      logoSub: "Living Culture of India",
      title: "VARANASI",
      sub: "The Eternal City of Light & Liberation",
      tagline: "A SamsKruti Guide for Curious Travellers",
      seal: "Curated with love",
      // Every claim here has to survive the traveller opening the book. "Scan
      // for stories" is the QR on page 4; the other three are the itinerary.
      features: ["Heritage walks", "Local flavours", "Hidden stories", "Scan for stories"],
      foot: "Crafted with historians, artists, priests, boatmen and local storytellers.",
    },
    { kind: "blank", dark: true }, // inside front cover (endpaper)
    { kind: "blank" }, // page 1
    { kind: "blank" }, // page 2
    { kind: "blank" }, // page 3

    // ── Page 4 (LEFT): the places I'll go — pictures + one-liners + scan the stories ──
    {
      kind: "collage",
      eyebrow: "Day One · Morning",
      title: "Seek permission, receive blessings",
      lead: "Begin your journey in Kashi with devotion and an open heart.",
      tiles: PLACES,
      link: { url: "https://samskruti.life/kashi/morning", hook: "The story behind each temple — why you go, in what spirit, and what to do inside.", label: "One scan. Six sacred stories →" },
    },
    // ── Page 5 (RIGHT): the plan — the route, the figures, the timeline ──
    {
      kind: "plan",
      eyebrow: "Day One · Morning",
      title: "Today's journey",
      lead: "A sacred walk through the heart of Kashi. Everything is close, so we walk slow.",
      snapshot: [
        { value: "~3.6 km", label: "Distance" },
        { value: "~40–50 min", label: "On foot" },
        { value: "~15–20 min", label: "By ride" },
      ],
      mapTiles: [
        { n: 1, name: "Kal Bhairav" },
        { n: 2, name: "Maha Mrityunjaya" },
        { n: 3, name: "Kashi Vishwanath" },
        { n: 4, name: "Corridor" },
        { n: 5, name: "Vishalakshi" },
        { n: 6, name: "Breakfast" },
        { n: 7, name: "Vishwanath Gali" },
      ],
      steps: [
        { id: "d1m-wake", time: "3:15 AM", label: "Wake, dress, carry only essentials" },
        { id: "d1m-leave", time: "3:45 AM", label: "Leave the hotel by cab / auto" },
        { id: "d1m-kalbhairav", time: "4:00 AM", label: "Kal Bhairav — seek His permission" },
        { id: "d1m-mahamrityunjaya", time: "4:30 AM", label: "Maha Mrityunjaya Temple" },
        { id: "d1m-vishwanath", time: "5:15 AM", label: "Kashi Vishwanath (+ Annapurna)" },
        { id: "d1m-corridor", time: "7:15 AM", label: "Walk the Vishwanath Corridor" },
        { id: "d1m-vishalakshi", time: "7:40 AM", label: "Shri Vishalakshi Temple" },
        { id: "d1m-breakfast", time: "8:00 AM", label: "Banarasi breakfast" },
        { id: "d1m-gali", time: "9:00 AM", label: "Wander Vishwanath Gali" },
      ],
    },

    // ── Page 6 (LEFT): the same places again — a grounding reference view ──
    {
      kind: "collage",
      eyebrow: "Photo album · Morning",
      title: "The places",
      tiles: PLACES.map(({ n, name, image }) => ({ n, name, image })),
    },
    // ── Page 7 (RIGHT): what I did — paste my own photos ──
    {
      kind: "collage",
      paste: true,
      eyebrow: "Photo album · Morning",
      title: "What I did",
      tiles: PLACES.map(({ n, name }) => ({ n, name })),
    },

    // ── remaining blank (build next) ──
    { kind: "blank" }, // page 8
    { kind: "blank" }, // page 9
  ],
};
