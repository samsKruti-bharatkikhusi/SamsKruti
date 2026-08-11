import type { GuideBookData } from "./types";

// ── Varanasi · Three Days ─────────────────────────────────────────────────
// LAYOUT RULE: every spread is IMAGE (left) + CONTENT (right). So the pages
// alternate: even index = a visual (plate / map / cover), odd index = content.
// Image-forward, minimal prose. Spine: Day1 the river / Day2 the makers /
// Day3 Sarnath+farewell. Maker names ILLUSTRATIVE until verified.

const IMG = "/data/images/varanasi";
const CRAFT = "/data/images/hriday";

export const VARANASI_3DAY: GuideBookData = {
  slug: "3-day",
  days: 3,
  topLabel: "Varanasi · Three Days",
  storeKey: "gb-varanasi-3day",
  pages: [
    // ── Opening ──
    { kind: "cover", dark: true, deva: "वाराणसी", title: "Varanasi", sub: "Three Days · A Guided Workbook", foot: "काशी · The city that guides · First Edition" },
    { kind: "epigraph", dark: true, line: "For the traveller who has three days — and does not want to waste one.", sub: "काशी" },

    // ── Entering · how to use ──
    { kind: "plate", image: `${IMG}/ghats-golden.png`, devanagari: "काशी", title: "You are entering Kashi", caption: "Older than history — and twice as old as it looks." },
    {
      kind: "text",
      eyebrow: "How to use this book",
      devanagari: "यह किताब कैसे चलाएँ",
      title: "It becomes yours",
      body: [
        "Not a book to only read — a book to walk with, and to fill.",
        "Tick each thing as you do it; the book remembers. Paste your photos into the frames.",
        "Every code is a door — scan it for the full story behind a face, or for live help the moment you feel lost.",
      ],
      hint: "☑  tick as you go   ✂  paste your photos   ▣  scan for more",
    },

    // ── The map · Day One ──
    { kind: "map", eyebrow: "The journey", title: "Three days of Kashi", note: "The river and its ghats · the makers' lanes · Sarnath. Your three days, marked." },
    {
      kind: "arrival",
      eyebrow: "Day One",
      devanagari: "पहला दिन",
      title: "Your first hours",
      variants: [
        {
          key: "morning",
          label: "Early morning",
          lead: "You hit the jackpot — Kashi's finest hour is happening now. Don't settle in; go straight to the river.",
          items: [
            { id: "d1-boat", time: "On arrival", label: "Drop bags, go straight to a sunrise boat", sub: "The whole city rises from the water; the light won't wait.", how: "Assi or Dashashwamedh ghat", cost: "shared ~₹150/person, negotiate", tip: "carry small cash" },
            { id: "d1-breakfast", time: "After the boat", label: "Kachori-sabzi and a kulhad of chai", sub: "Banaras breakfasts like a king.", how: "Kachori Gali, near Vishwanath", cost: "~₹60" },
            { id: "d1-rest", time: "Midday", label: "Rest through the heat — not optional", sub: "Kashi at noon is brutal; return at dusk." },
            { id: "d1-vishwanath", time: "Late afternoon", label: "Kashi Vishwanath, via the corridor", sub: "The golden heart of the city.", how: "walk from Godowlia", tip: "no phones inside; expect a queue" },
            { id: "d1-aarti", time: "Evening", label: "Ganga Aarti at Dashashwamedh", sub: "Fire, brass, a thousand voices to the river.", how: "arrive by 5:45 for a spot", cost: "boat view ~₹150" },
          ],
        },
        {
          key: "afternoon",
          label: "Afternoon",
          lead: "The city is hot and loud, and so are you. Ease in — don't fight it. The river keeps its magic for dawn tomorrow.",
          items: [
            { id: "d1-checkin", time: "On arrival", label: "Check in, eat, rest an hour", sub: "Let the heat and the journey settle." },
            { id: "d1-walk", time: "Late afternoon", label: "A gentle first walk along the ghats", sub: "No agenda — just meet the river.", how: "start at Assi, walk north" },
            { id: "d1-aarti", time: "Evening", label: "Ganga Aarti at Dashashwamedh", sub: "Your first big moment.", how: "arrive by 5:45", cost: "boat view ~₹150" },
            { id: "d1-early", time: "Night", label: "Eat well, sleep early, set an alarm", sub: "Tomorrow you wake before dawn for the boat." },
          ],
        },
        {
          key: "evening",
          label: "Evening",
          lead: "You arrive as the city lights its fire. Move fast for the Aarti, or rest easy — either is right.",
          items: [
            { id: "d1-dropfast", time: "On arrival", label: "Drop your bags fast", sub: "The city's most theatrical hour is starting." },
            { id: "d1-aarti", time: "Before 6:15", label: "If you can, go straight to the Aarti", sub: "Arrive as fire meets the river.", how: "Dashashwamedh Ghat" },
            { id: "d1-street", time: "If you miss it", label: "A quiet ghat and a street-food walk", sub: "Chaat, a lassi, the lanes at night.", cost: "~₹100" },
            { id: "d1-early", time: "Night", label: "Sleep early, set an alarm", sub: "Dawn on the water, first thing tomorrow." },
          ],
        },
      ],
    },

    // ── The evening fire · Day Two ──
    { kind: "plate", image: `${IMG}/ganga-aarti.jpg`, devanagari: "आरती", title: "The evening fire", caption: "Stand at the back, or watch it burn from a boat." },
    {
      kind: "checklist",
      eyebrow: "Day Two",
      devanagari: "दूसरा दिन",
      title: "The lanes, the makers, the flavours",
      items: [
        { id: "d2-weave", time: "Morning", label: "Find the pit looms of Madanpura", sub: "Six months become a single Banarasi saree.", how: "Madanpura, walk from the ghats", tip: "ask before you photograph a loom" },
        { id: "d2-metal", time: "Late morning", label: "Hear the hammers of Thatheri Bazar", sub: "Copper and brass, beaten by hand.", how: "Thatheri Bazar, near Chowk" },
        { id: "d2-food", time: "Lunch", label: "Kachori-sabzi, then a thick lassi", sub: "Banaras breakfasts like a king — and argues about it.", how: "Kachori Gali / Chowk", cost: "~₹80" },
        { id: "d2-paan", time: "Afternoon", label: "Fold a Banarasi paan into your cheek", sub: "The city's full stop: sweet, cool, and slow.", cost: "~₹30" },
        { id: "d2-craft", time: "Late afternoon", label: "Watch wood spun into toys at Khojwan", sub: "Soft gular wood, sealed in red and gold lac.", how: "Khojwan" },
      ],
    },

    // ── The Weaver ──
    { kind: "plate", image: `${CRAFT}/banarasi-saree/product.png`, contain: true, title: "Banarasi silk", caption: "Gold thread on silk; six months to a saree." },
    {
      kind: "craft",
      devanagari: "बुनकर",
      name: "The Weaver",
      maker: "Raheem Ansari · Madanpura",
      story: "Raheem sits at a loom his grandfather built. Each motif carries centuries of memory — none of it written down, all of it learned by watching.",
      addition: "Five centuries, six months, one saree.",
      checkId: "met-weaver",
      link: { url: "https://samskruti.life/kashi/weaver", hook: "Raheem's whole story — the loom his grandfather built, the son studying in Pune, the craft slowly fading.", label: "Scan for the full story →" },
    },

    // ── The Potter ──
    { kind: "plate", image: `${CRAFT}/clay/product.png`, contain: true, title: "The river's clay", caption: "Thrown, used once, returned to the earth." },
    {
      kind: "craft",
      devanagari: "कुम्हार",
      name: "The Potter",
      maker: "Shyam Prajapati · Bhadaini",
      story: "From the clay of the Ganga's banks, the kumhars throw the kulhads that give ghat chai its earth-smell. Shaped in seconds, used once, returned to the earth.",
      addition: "Shaped from the river, returned to it.",
      checkId: "met-potter",
      link: { url: "https://samskruti.life/kashi/potter", hook: "The potter's dawn — clay pulled from the Ganga's banks, a wheel older than memory, a cup used once.", label: "Scan for the full story →" },
    },

    // ── The makers' hands · Day Three ──
    { kind: "plate", image: `${IMG}/wooden-toys.jpg`, devanagari: "खिलौने", title: "The makers' hands", caption: "A century of colour, spun onto wood." },
    {
      kind: "checklist",
      eyebrow: "Day Three",
      devanagari: "तीसरा दिन",
      title: "Sarnath, and farewell",
      items: [
        { id: "d3-sarnath", time: "Morning", label: "Travel to Sarnath — the deer park", sub: "Where the Buddha first taught: ten miles, and a world, away.", how: "auto/taxi, ~40 min", cost: "~₹800 round trip with wait", tip: "start by 8am to beat the heat" },
        { id: "d3-stupa", time: "Late morning", label: "Circle the Dhamek Stupa in silence", sub: "Fifteen hundred years of stone, and a great stillness.", cost: "site entry ~₹25" },
        { id: "d3-museum", time: "Midday", label: "Meet the Ashoka lion capital", sub: "The four lions that became a nation's emblem.", cost: "~₹20; closed Fridays", tip: "it's in the main hall" },
        { id: "d3-return", time: "Afternoon", label: "Walk one last unfamous lane", sub: "Say goodbye to the city the slow way." },
        { id: "d3-diya", time: "Dusk", label: "Float a diya on the Ganga, and let go", sub: "Leave a little light on the water behind you.", cost: "diya ~₹10" },
      ],
    },

    // ── One last look · your checklist ──
    { kind: "plate", image: `${IMG}/ghats-aerial.jpg`, devanagari: "विदाई", title: "One last look", caption: "You leave changed." },
    {
      kind: "checklist",
      eyebrow: "Your Kashi",
      devanagari: "आपकी काशी",
      title: "Did you…",
      items: [
        { id: "k-vishwanath", label: "Enter Kashi Vishwanath" },
        { id: "k-boat", label: "Take a boat at first light" },
        { id: "k-kulhad", label: "Drink chai from a clay kulhad" },
        { id: "k-saree", label: "Watch a Banarasi saree being woven" },
        { id: "k-metal", label: "Hear the metal-beaters of Thatheri Bazar" },
        { id: "k-paan", label: "Eat a Banarasi paan" },
        { id: "k-sarnath", label: "Stand at the Dhamek Stupa, Sarnath" },
        { id: "k-diya", label: "Float a diya at dusk" },
      ],
    },

    // ── Keep the memory · scrapbook ──
    { kind: "plate", image: `${IMG}/ganga-aarti.jpg`, title: "Hold onto this", caption: "The fire, the river, the morning you'll never forget." },
    {
      kind: "scrapbook",
      eyebrow: "Your memories",
      title: "The city, in your hand",
      prompt: "Paste the moments you want to keep.",
      slots: [
        { caption: "________________", rot: -5 },
        { caption: "________________", rot: 3 },
        { caption: "________________", rot: -2 },
      ],
    },

    // ── Farewell · the lifeline ──
    { kind: "plate", image: `${IMG}/ghats-golden.png`, title: "Kashi remembers you", caption: "Every page has a soul. · SamsKruti, made in Kashi." },
    {
      kind: "contact",
      eyebrow: "If the city turns",
      title: "You are never lost",
      body: [
        "A lane will end where you were sure it turned. A temple will be closed. This is not the plan failing — it is the city being itself.",
        "When it happens, take out your phone. A real guide who knows this exact corner will walk the next step with you, live.",
      ],
      link: { url: "https://samskruti.life/kashi/lost", hook: "Lost right now? Scan this. Tell us where you're standing — we'll tell you exactly what to do, and where to go next.", label: "Scan if you're lost →" },
    },
  ],
};
