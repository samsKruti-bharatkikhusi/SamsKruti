# Design Changelog

A running record of design-system changes: what the state **was**, what it **is**, and **why**.
Newest entry first. Every entry names the files touched so any change can be traced or reversed.

**Baseline commit:** `cc11e86` — everything below is uncommitted working-tree change unless stated.

---

## 2026-08-20 · Entry 009 — Identity locked; housekeeping

### Settled
User: *"we will go ahead with what we have currently."* The mark is final.

| | | |
|---|---|---|
| **Glyph** — the S alone, no ring | every size in the app | nav, sidebar, loading, favicon, Apple icon |
| **Crest** — layered medallion (F), cropped to its edge | 96px+ | home hero centre, OG |
| **Seal** — glyph in a rust ring | built, **not used in the app** | available for print |

`Mark` renders the glyph at all sizes — no size switch, no variant, nothing that can drift. Verified in the build: 33 glyph references across the app, crest exactly twice (both on the home hero).

### Also rejected, and archived
A full-colour tricolour poster (Aug 20, 19:19). Measured **21.0% cool** (green 13, blue 8) against a locked rule of zero — three times the 6.9% that eliminated crest B. Also 64.5% dark background against a light-first system, and 2:3 rather than square. Archived to `uploads/logo-candidates/poster-tricolour-Aug20.png`; suggested uses are a book cover or a launch image, neither of which is the logo.

**Pattern worth recording:** each successive generated image was more beautiful and less usable than the last. Generative iteration optimises for the impressive still, not for a 44px slot beside a button. The glyph is dull at 512px and correct at 24px, which is the right trade for a mark.

### Housekeeping
- **Six master PNGs moved out of `public/`** into `uploads/brand-masters/` — 6.9MB that was publicly reachable and never requested by a browser. `public/brand/` is now **728KB across 13 files**, all of them actually served.
- **`logo-compare.html` archived.** It referenced 22 deleted candidate exports and would have 404'd throughout; its conclusion lives in Entries 005–008. Moved to `uploads/logo-candidates/logo-compare-archived.html`.
- Verified zero broken asset references across `src/` and all five remaining design pages.

### Open, deliberately
- The faint vertical seam in the glyph, inherited from the source's background. Invisible at interface sizes; regenerate on a flat ground before print.
- `crest-1024.webp` is 228KB, above the 180KB imagery budget. Nothing loads it yet.
- The tricolour/national-symbol question needs a legal check before any public-facing use of the archived poster.
- The unused seal exports (48KB) are kept on the assumption that print will want them.

---

## 2026-08-20 · Entry 008 — The mark, resolved

### Where it landed
The identity is now **one mark at two densities**, built from a division of labour that took several wrong turns to find:

| | | |
|---|---|---|
| **Seal** | glyph inside a single rust-brown outline | 44px and up |
| **Glyph** | the S alone, scaled to fill | below 44px |

**The glyph is drawn artwork** (generated, supplied by the user). **The ring is generated geometry** — an exact circle from arithmetic, aspect 1.0000.

That split is the finding. Image generators draw the organic calligraphic S beautifully and get precise geometry subtly wrong every time; code is the exact inverse. Roughly a dozen generated seals had wonky rings before we stopped asking for them.

### The path here, honestly
1. Crest A (monochrome paper-cut) — eliminated: lowest structure at 44px (37.0). Its S was soft tonal shifts, and downscaling destroys those first.
2. B (full colour) — eliminated: only candidate to break the warm rule (93.1% warm, real blue).
3. C, D, E, F, G, H — six further crests. F then G each won on measurement in turn.
4. **A mess I made:** I hand-authored an SVG seal to approximate the user's reference, iterated it three times against rendered previews, and shipped it into the app. It scored 104.4 at 44px — the highest of anything — which only proved the metric rewards crude high-contrast shapes. It was legible and ugly. Removed.
5. The user then supplied a clean flat glyph and proposed the split: *"I am sharing you glyph, you can create seal."* That was the right call.

### Variant chosen
Three ring treatments were built and measured: double hairline (36.4), dotted (36.5), single ring (36.3) — **within 0.2 of each other, so the ring is taste, not performance.** The dotted ring was installed first; the user then supplied their own seal: a **double hairline ring, no dots, no diamonds**. That is the final design.

**The supplied seal was measured before use and its ring was an oval** — bounding box 351x364, i.e. 3.6% taller than wide, with the radius varying ±1.32%. Visible at large sizes. So the *design* was taken from the user's version and the *geometry* rebuilt in code: rebuilt bounding box 382x382, aspect exactly 1.0000.

This is the division of labour working as intended, on the second pass: the user's drawn glyph and chosen ring treatment, executed with arithmetic rather than by a generator that cannot draw a circle.

The bare glyph scores **41.9**, ~15% above any framed version, because without the ring the S fills the frame instead of sitting inside a circle that eats a third of the diameter. That is why the mark switches to the glyph below 44px.

### Files

**Added** — `public/brand/seal-source.png`, `glyph.png`, `glyph-source.png`, plus `seal-{64,128,256,512}.webp` and `glyph-{64,128,256,512}.webp`.

**Regenerated** — `src/app/icon.png` (glyph on a **circular** disc, transparent corners, 20KB), `src/app/apple-icon.png` (seal, **square** by design, 6KB), `public/brand/og.png` (24KB, was 356KB at baseline).

**Favicon shape.** CSS rounds the mark everywhere else, but the browser draws the favicon file as-is, so it was rendering square. `icon.png` is now masked to a disc with transparent corners. The S is fitted to 90% of the radius: a first attempt at 100% clipped its extremes, measured as a half-diagonal of 579px against a 512px radius. The Apple touch icon stays **square** on purpose — iOS applies its own mask, and transparent corners there render black.

**Removed** — the hand-authored `seal.svg` / `seal-compact.svg`, all eight crest candidate export sets, and `samskruti-crest.png`. Rejected candidate sources are archived in `uploads/logo-candidates/` — kept, but out of `public/` so they are not shipped.

**Updated** — `src/components/site/seals.tsx`; comments in `globals.css` and `site-hero.tsx` that still said "crest".

### The crest, restored as a third asset
The illustrated medallion was brought back from the archive and documented on the logo page — **not as a logo**, as a print asset. Candidate **G** (flat) was restored first; the user then identified **F** (layered paper-cut) as their crest, confirmed pixel-identical to the archived `crest-f-source.png` (fingerprint diff 0.0). F is correct here: its dimensional depth is a liability in a logo and an asset in a print piece.

| | Crest | Seal | Glyph |
|---|---|---|---|
| Warm-earth only | 100% | 100% | 100% |
| Structure at 44px | 43.9 — *incoherent* | 39.1 | 41.9 |
| Distinct elements | dozens | 4 | 3 |
| Legible in a browser tab | no | no | **yes** |

The crest scores *highest* of the three at 44px, and that number is misleading in the same way it was throughout: it counts surviving contrast, not whether the contrast resolves into a recognisable shape. At 44px the landscape, wheel and botanical average into a mottled disc.

**Guardrails so it cannot drift into the UI:** the crest has no React component and **no exports below 256px** — it has to be reached for deliberately. Exports are `crest-{256,512,1024}.webp` plus `crest-1024.avif`, 17–104KB. Source restored to `public/brand/crest-source.png`; the other seven candidates stay archived.

### The outline — a sub-pixel bug, not a taste problem
User: *"whatever seal that we have it does not feel like [a seal]... bring very dark outline"*, and *"remove that two lines from the seal"*.

The diagnosis was arithmetic. The seal used two hairline rings at 3.4px and 2.2px on a 1024px canvas. **At 44px — the size it is actually used — that is 0.26px.** Below one pixel a stroke cannot render as a line; it dissolves into a grey haze. The seal was never a seal at the size anyone saw it.

Six outline weights were built and measured for how thick the ring lands at 44px:

| Weight | At 44px | Glyph area |
|---|---|---|
| 6px (old hairline) | 0.26px | 98% |
| 14px | 0.60px | 95% |
| 22px | 0.95px | 92% |
| **34px — chosen** | **1.46px** | **87%** |
| 46px | 1.98px | 83% |
| 58px | 2.49px | 79% |

Initially set to 34px (1.46px at 44). The user found that too bold, so it was reduced to **24px = 1.03px at 44** — the lightest weight that still clears one pixel. Below that (20px = 0.86px) it returns to being a grey smear. The two hairlines are gone; the seal is now glyph + one stroke.

**Ring colour.** First installed as near-black `#2A1B10`, which read as a foreign circle drawn around the mark. The glyph was then sampled: it is **65% `#604020`** (the S), 19% `#C06030` (the copper accent). The ring took the S's own `#604020`, so ring and mark are the same material. Five candidates were compared — `#513518` (10.0:1), `#6B4423` (7.5:1), `#8A4E24` (5.8:1, too close to the copper accent and competing with it), `#2A1B10` (14.8:1, too detached). **`#604020` at 8.3:1** won on belonging rather than on contrast, having ample contrast either way.

Structure surviving at 44px went from **39.1 to 59.3** — a 52% improvement — and the exports got *smaller* (512px: 24KB → 17KB), because a single bold stroke compresses better than two faint ones.

### Filling the seal
User: *"the S should be larger... it should feel like filled, as of now there is lots of white space"* and *"similar to crest the top of the S should touch border"*.

Measured: at the 0.56 scale the S's ink reached only **64% of the ring's usable radius**. It was floating, not filling.

Scaling it up exposed a second problem — **the glyph source ships on an opaque cream field**, so above ~0.74 that rectangle punched a visible square hole straight through the ring. Fixed by knocking the cream out to transparency with a soft alpha ramp (`public/brand/glyph-cut.png`), after which the S composites as artwork rather than as a card laid on top.

Scale then set to **0.90**, where the S's tips meet the ring's inner edge — matching how the S meets the frame in the crest. 0.94 and above push the S through the ring.

The standalone glyph went to 0.94 of its frame, and the circular favicon to 0.92 of the disc radius (the largest that clips nothing).

| | Before | After |
|---|---|---|
| S scale in the seal | 0.56 | **0.90** |
| Ink vs usable radius | 64% | **~99%** |
| Structure at 44px | 52.0 | **56.4** |

### Optical centring — fixed at the master, not per-asset
User: *"shift little right the S in the seal"*, then later *"your entire glyph is shifted towards left"*.

The S's ink centroid measured **39.8% of the width** — a full 10% left of geometric centre. Bounding-box centring therefore places it optically left in **every** asset.

The first fix was a `+28px` nudge applied to the seal only, which left the standalone glyph, the favicon and the Apple icon still wrong. Corrected properly by **baking the offset into the master**: `glyph-cut.png` is padded 140px on its left (687→827 wide), moving the ink centroid to exactly 50.0%. Every downstream asset now inherits it and the per-asset nudge was removed.

Verified after regeneration — glyph 49.5%, seal 49.7%, favicon 50.1%.

Padding costs nothing in size: the art is taller than wide, so fitting it into a square is height-governed and the S renders identically.

### Known flaw
A faint vertical seam runs through the glyph where `trim` caught a slight variation in the source background. Invisible at interface sizes; it would show on a large print. Regenerate the glyph on a perfectly flat ground before it goes on a cover.

### Verification
`tsc` clean, lint clean, production build clean, all 9 routes 200, every asset serving. Home hero renders `seal-256.webp`; nav renders `seal-128.webp` at 3.5KB.

---

## 2026-08-20 · Entry 007 — Crest placed on the home hero

### Change
The crest now sits **above the "SamsKruti" wordmark** on the home screen (`/`).

- `src/components/site/site-hero.tsx` — new optional `mark` prop (default `false`), rendering `<Mark size={104} />` above `.lp-wordmark`.
- `src/components/site/landing-client.tsx` — passes `mark`.
- `src/app/globals.css` — `.lp-mark` styles.

### Why a prop rather than always-on
`SiteHero` is shared by the home page, `/varanasi`, and all three segment pages. Adding the crest unconditionally would have put it on five screens. Verified: `lp-mark` appears once on `/` and zero times on `/varanasi` and `/varanasi/galiyan`.

### The detail that mattered
The crest artwork carries its own **cream field** — it is not transparent. Dropped straight onto the deep-earth hero it reads as a pale rectangle floating on dark. Fixed by masking to a disc (`border-radius: 50%`) and adding a hairline ring in the hero accent plus a soft drop shadow, so it reads as a medallion pressed onto the surface.

Also required overriding `.nav-seal { width: 44px }` from the legacy stylesheet — `.lp-mark .nav-seal` wins on specificity and sizes it to `clamp(74px, 8.2vw, 112px)`.

Enters at `0.25s`, just ahead of the wordmark at `0.5s`, so it leads the existing stagger rather than interrupting it.

### Verification
`tsc` clean, lint clean, build clean. Home requests `crest-256.webp` (15KB) for the 104px slot via the `size × 2` rule.

---

## 2026-08-20 · Entry 006 — Crest implemented as the single mark

### Decision
User: *"Wherever, there'll be only one logo. No coloring, no changing, nothing will be there. This will be the logo."* The crest is the identity across the whole application. No variants, no per-segment tints, no recolouring.

### Before → after

| | Before | After |
|---|---|---|
| Marks in the codebase | **7** competing | **1** |
| Per-segment tints | 4 (`s-hub/galiyan/parampara/hriday.png`) | none |
| Favicon | old lotus-S, 83KB | crest, 131KB |
| Apple icon | old, 40KB | crest, 16KB |
| OG card | old `og.png`, 356KB | crest on brand ground, 132KB |

### Files

**Replaced**
- `src/components/site/seals.tsx` — rewritten. One `Mark` component; `NavSealHub/Galiyan/Parampara/Hriday` all alias to it, so no call site changed and no tint can creep back. `Mark` picks the nearest crest export up from `size × 2`, so the browser never downscales a 512px file into a 44px slot.
- `src/app/icon.png`, `src/app/apple-icon.png`, `public/brand/og.png` — regenerated from the crest with sharp, palette-quantised, all under the 180KB budget.
- `src/app/new-style/page.tsx` — placeholder SVG replaced with `<Mark />`.

**Deleted** (all tracked in git, fully recoverable)
`s-hub.png`, `s-galiyan.png`, `s-parampara.png`, `s-hriday.png`, `samskruti-s.png`, `samskruti-arch-logo.png`, `samskruti-medallion.png`, and the unused `CardSeal*` SVG components.

**Added**
`public/brand/samskruti-crest.png` (source, 2.6MB) + `crest-{64,128,256,512}.webp` and `crest-1024.avif`.

### Incident during the work
The `seals.tsx` rewrite accidentally dropped `FooterSeal` and `HeroMandalaHub`/`HeroMandalaSegment`, breaking three files. Caught by `tsc`. They are **page ornaments, not marks** — restored verbatim from git. Lesson recorded: the file mixed logo components with decorative SVGs; they are now separated by a comment banner.

### Known limitation, accepted
At 16–20px the crest renders as a warm circle — roughly 200 elements cannot resolve at that size. This is inherent to a crest, not a defect. Accepted deliberately in exchange for a single unambiguous identity. If it becomes a problem, the fix is a simplified favicon only, not a change to the crest.

### Verification
`tsc` clean, lint clean, production build clean, all 12 routes 200, all 7 brand assets serving. No dangling references to any deleted file.

---

## 2026-08-20 · Entry 005 — New crest received; three-tier mark architecture

### What arrived
The user commissioned/produced a **new crest**: a layered paper-cut circular medallion in warm earth tones. Contents: a central flowing river-S, the outline of India, a mandala, jali lattice, an Ashoka-style wheel, cobbled lane texture, temple silhouettes, contour lines. Double outer ring with diamond markers at the cardinal points.

**Assessment: it is a real improvement** on everything in `public/brand/`. Warm-earth throughout so it sits inside the palette without a fight; layered depth reads as craft; the motifs carry meaning rather than decorate.

### The limit, stated honestly
It runs to roughly two hundred distinct elements. That is what makes it beautiful at 1200px and a beige circle at 16px. **Not a flaw in the drawing — it is what a crest is.** Crests were made to be pressed into wax, not to sit in a browser tab.

### The resolution — three tiers, one form
Rather than choose between crest and glyph, the glyph is **derived from the crest's own centre**, so the small mark and the large crest are visibly the same idea.

| Tier | Asset | Size range | Where |
|---|---|---|---|
| 1 | **The Crest** — as drawn, untouched | 96px+ | book cover, OG, splash, print, keepsake |
| 2 | **The Seal** — outer ring + river only | 24–96px | avatar, app icon, stamp, loading |
| 3 | **The Glyph** — the river-S alone | 16px+ | nav, favicon, notifications, inline |

### Why the river-S
The crest's central curve is **simultaneously the letter S of SamsKruti and the winding river/street the brand is named for**. It is one stroke, legible at 16px, recolours for dark, and it is already theirs.

**This supersedes the ghat-step mark recommended in Entry 004.** The ghat was a good form but externally invented; the river-S is drawn out of the user's own crest, which makes it more ownable and means every use reinforces the others.

### Positioning note
The crest contains the outline of India. Correct for *SamsKruti the brand* (Chapter 1 = twelve cities); wrong for *the product* (Varanasi only). Acceptable because the crest lives on covers, not in the app. **Do not let the India map migrate into product UI**, the way "STREETS OF INDIA" did.

### File received and optimised
Source: `ChatGPT Image Aug 20, 2026, 12_01_02 AM.png` — 1254×1254, **2.6MB**, raster, AI-generated.
Saved as `public/brand/samskruti-crest.png`; web exports generated with sharp:

| File | Size | Budget |
|---|---|---|
| `crest-1024.avif` | 117KB | ok |
| `crest-512.webp` | 51KB | ok |
| `crest-256.webp` | 15KB | ok |
| `crest-128.webp` | 4KB | ok |
| `crest-64.webp` | 1KB | ok |

2.6MB → 51KB at display size.

### Open actions
- **Obtain or commission a vector source.** 1254px raster cannot go to print: a 100mm cover at 300dpi needs ~1200px minimum for flat art and considerably more for fine line work. It must be redrawn as SVG before the book.
- **Produce a single-colour line-art reduction.** A crest on a book cover is normally debossed or foiled — one colour, no tonal layering. The current mid-tone layering (jali, cobble band, contours) will collapse into mud.
- **Check ownership.** The mark is AI-generated; trademark registrability of AI-generated marks is contested in several jurisdictions. Worth confirming before it becomes the registered identity.
- Retire the four segment-tinted `s-*.png` (segments are retired).

### Status
Glyph and seal are drawn as inline SVG and ready to drop into `seals.tsx`. **Nothing in the application has been changed** — `seals.tsx` and `public/brand/*` untouched.

### Files
Rewrote `public/design/logo.html`. Nothing else touched.

---

## 2026-08-19 · Entry 004 — Logo exploration

### Context: a reversed decision
Entry 001 recorded the logo as **preserved, untouched** — at the user's explicit instruction ("I do not want to change my theme and the color, especially the logo"). On 2026-08-19 the user reversed this: they do not like the current mark and want it reworked against the new system. **The logo is now in scope.**

### The finding, before any question of taste
The brand does not have one mark. It has **seven**, and the circular "STREETS OF INDIA" seal the user shared is **not in the codebase at all**.

| Mark | In the app? |
|---|---|
| Lotus-S emblem ×4 segment tints (`s-hub/galiyan/parampara/hriday.png`) | yes — nav, sidebar, loading |
| `samskruti-medallion.png` (1.4MB) | OG / large use |
| `samskruti-arch-logo.png` | unused |
| `samskruti-s.png` (1MB) | unused |
| Circular card seals ×3 (`seals.tsx`, text-on-path) | segment cards |
| `og.png` (356KB) | metadata |
| The "STREETS OF INDIA" seal | **not in the repo** |

**Three of the four PNG marks are tinted per segment** — and those segments are retired, so three quarters of the mark system is already orphaned.

### The diagnosis
**A seal is a print mark; an app needs a glyph.** The current logo is not badly drawn — it is the wrong category of object for a 20px nav chip. A circular badge with a double ring, dotted border and letterspaced small caps is the "artisanal / est. 1892" trope: the same antique cue that gold was dropped for in Entry 001. It also cannot recolour for dark mode, because it is a flat raster.

### Four directions explored (`public/design/logo.html`)
All hand-authored SVG, shown at 16/20/24/32/48/96px against the current emblem, in both themes.

| | Direction | Verdict |
|---|---|---|
| **A** | **The Ghat** — steps descending to the water | **Recommended** |
| B | The Arch — the low doorway of a lane | Good, but widely owned |
| C | The Caret — the chalk mark meaning "this way" | Flawless, characterless |
| D | The Seal, reduced — the ring kept, interior stripped | Holds to ~24px; the honest ceiling for a circular mark |

### Recommendation
**Take the ghat as the product mark; keep the seal for print.** The ghat is the only option that could not belong to another city, survives 16px, works in one colour, recolours for dark, and means the right thing — a guided descent, one step at a time.

The seal is not wasted: a circular seal with letterspaced caps is a *print* device. It belongs debossed on the cover of the ₹500 book and stamped on the last page, held at 100mm and never at 20px.

**The tagline must go.** "STREETS OF INDIA" is wrong twice: the product is one city, not India, and "streets" was Sheher Ki Galiyan — a retired segment. Taglines also vanish below ~100px.

### Status
Exploration only. **No mark has been changed in the application** — `seals.tsx`, `public/brand/*` and all rendering code are untouched. Awaiting a decision.

### Files
Created `public/design/logo.html`. Nothing else touched.

---

## 2026-08-19 · Entry 003 — The system wired into the application

### What changed

| | Before | After |
|---|---|---|
| Design tokens | 19, in `globals.css`, bypassed 473× by inline hex | 54, in `tokens.css`, single source of truth |
| Themes | Dark only. No light mode, no switch. | Light **and** dark as designed peers + Light/Dark/System switch, persisted |
| Component primitives | 2 (`.btn-primary`, `.btn-ghost`); 0 generic component files of 34 | 13 `.sk-*` primitives, 8 states each |
| `:focus-visible` rules | **0** in 7,135 lines — unusable by keyboard | Global floor in `globals.css` |
| Theme flash on load | n/a | Blocking inline script stamps theme before first paint |

### Files

**Created**
- `src/app/tokens.css` — the single source of truth. Three theme states: `:root` (light), `prefers-color-scheme: dark` (guarded so an explicit light choice wins), `[data-theme="dark"]` (so the toggle wins both directions).
- `src/app/components.css` — the 13 `.sk-*` primitives. Namespaced so they cannot collide with the 615 legacy route classes.
- `src/components/site/theme-toggle.tsx` — `ThemeToggle` + `ThemeScript`.
- `src/styles/brand.module.css` — rewritten as a **thin alias layer** over `--sk-*`, so the app and the spec cannot drift.

**Modified — total 25 lines added, 1 changed, across 2 files**
- `src/app/globals.css` — +17 lines, **0 removed**: two `@import`s and a `:focus-visible` block. All 7,135 legacy lines, 615 route classes, and the original `:root` tokens are untouched.
- `src/app/layout.tsx` — +8/−1: `ThemeScript`, `suppressHydrationWarning`.

### Decisions and why

- **The two systems coexist deliberately.** Legacy pages keep their old tokens and still work (all 12 routes return 200). Most are slated for deletion in the Aklavya redesign, so restyling them would be wasted effort.
- **Old tokens were NOT aliased onto new ones.** `--aged-ivory` is used as both a background *and* a foreground depending on the page; making it theme-aware would invert colours on half the app.
- **`next/script` with `beforeInteractive` was rejected** for the theme — the Next docs state it does not block paint, so it would still flash. A plain synchronous inline script is used instead.
- **`useSyncExternalStore`, not `useEffect`,** in the toggle — reading localStorage in an effect triggers cascading renders and failed lint.

### Verification
Production build: 54 tokens, 35 `.sk-*` classes, both dark blocks, focus rules — all compiled. `tsc` clean, lint clean, all 12 routes 200. Zero hex values outside `tokens.css`.

### Known follow-up
- Turbopack dev holds a stale module graph — **restart `npm run dev`** to pick up the new `@import` targets. Production build is unaffected.
- Page-by-page migration onto `.sk-*` is not started.

---

## 2026-08-19 · Entry 002 — Imagery system added

### What changed
The system specified type on colour for a product that is **mostly photographs**. That gap is closed.

| | Before | After |
|---|---|---|
| Aspect ratios | none | 4 fixed: 3:2 place, 1:1 maker/food, 4:5 lane, 16:9 header |
| Scrims | one flat token | 3 measured: caption `.78` (10.1:1), top `.45` (3.1:1), hero `.62` (5.6:1) |
| Image tint | none | 6% warm — **place/architecture only** |
| Dark-theme images | none | `brightness(.88)` — a 100% photo beside a `#2E2016` card is a 15.7:1 glare |
| Image states | none | 4: skeleton → blur-up → loaded → failed |
| Photo policy | none | written; see below |

### The two rules that matter most
- **Never tint food or a face.** Tinted food looks stale and he will not go; a person's face is not a design surface.
- **Our imagery must obey the etiquette it teaches.** We tell Aklavya not to photograph at Manikarnika. A pyre on our own card kills that instruction and his trust in everything else.

### Audit of the real library (`public/data/images/`, 23 files)
| Finding | Measured |
|---|---|
| Over the 180KB budget | **19 of 23** (`page-04-places.png` = 2,534KB, ~14×) |
| Within budget | 4 — all JPEGs |
| True vertical (4:5) | **0** |
| Food photographs | **0** |
| Maker portraits | **0** |
| Licence confirmed | **0** (the Dashashwamedh README flags this itself) |

**Shoot list this produces:** vertical lanes → food as served → makers' hands and faces.
The library photographs what Varanasi *looks like* (tiers 4–5), not what he *needs* (tiers 1–3) — the same gap as the content.

### Files
`public/design/design-system.html` (§06), `src/styles/brand.module.css` (scrim/tint/dim tokens).

---

## 2026-08-19 · Entry 001 — Design system v3

### The brand contract (locked)
- **Preserved:** the logo, untouched. The warm terracotta / deep-earth family. Cormorant Garamond, with a narrower job.
- **Changed:** the ground (dark → light default), what colour *means*, structure and voice.
- **Nothing turns cool.** A limewash/river-ink palette was proposed and **rejected**.

### Colour: before → after
| Element | Was | Is | Why |
|---|---|---|---|
| Default mode | Dark `#1F0F06` | Light `#F8F3EB → #EFE3D2` | The decisive screen is a phone in daylight; this audience skews light |
| Terracotta | atmosphere/accent | **the primary action colour** | He must always know what to press |
| **Gold leaf** | text, dividers, accents | **DROPPED** (logo only) | 3.1:1 as text, 2.5:1 as a divider — could not carry information in *any* role, and was the strongest antique cue |
| Jade (Galiyan) | section identity | semantic **safe / done** | Colour must say what happens, not where you are |
| Tamarind red (Swaad) | section identity | semantic **caution** | Tier 2 needed a warning colour; the brand had none |
| Indigo (Hriday) | section identity | **retired** | The only cool hue in the set |
| Per-page themes | 5 palettes | 1 palette, 2 modes | Five palettes means a button has five colours |

### UI style: locked to warm soft minimalism
- **Neumorphism rejected** — element/ground contrast ~1.1:1 where 3:1 is required, and daylight erases shadows first.
- **Glassmorphism restricted to two places** — the sticky lifeline bar, and captions over photo plates. Contrast must never be conditional on a photograph, and `backdrop-filter` costs battery, which in the field *is* a safety issue.
- **Shape reversed from an earlier draft.** Was `0/2/999px` on the reasoning that 2px "reads printed, not SaaS". That was wrong: Aklavya reads Google and Amazon fluently daily, and fluency lowers anxiety. Now `10/14/20/28/pill`, shadows separating surfaces instead of borders.
- Motto: **remove elements, not warmth.**

### Defects found by measurement (all fixed)
1. Dark primary button: white on `#C8652A` = **3.92:1**, failed. → fill lifted to `#E08246`, ink label, **6.06:1**.
2. Dark pressed state: **4.35:1**, failed. → `#D2762F`, **5.18:1**.
3. Card/ground separation: **1.048:1** — cards were invisible without shadow, the exact neumorphism failure. → grounds deepened, **1.105:1** light / **1.216:1** dark (iOS is 1.116, Material 1.103).
4. Deepening the ground broke action-as-text (3.67:1). → new `--action-text` token.

### Corrections to my own method
- HSL saturation **lies about near-whites** — `#FDF9F4` computed as "69% saturated" but is a channel spread of 9. That flag was an artifact; channel spread is the honest metric.
- A 1.20:1 surface-separation target was **invented**. Benchmarked: iOS 1.116, Material 1.103. ~1.10 is the platform norm.

### Result
Every text pair passes 4.5:1 in **both** themes, lowest 4.64:1.

### Files
`public/design/design-system.html` (the spec, with live Theme and Sunlight controls),
`public/design/guiding-aklavya.html` (the redesign), `public/design/design-brief.html` (the audit).

---

## Before all of this — the starting state

Measured from `src/` at baseline `cc11e86`:

| Signal | Found |
|---|---|
| `globals.css` | 7,135 lines |
| Design tokens defined | 19 |
| Hardcoded hex inside components | **473** (tokens bypassed ~25:1) |
| Distinct font-size values | **114** (no scale) |
| Class selectors, route-prefixed | **615** (`seg-` 139, `hub-` 92, `side-` 60, `hr-` 58) |
| Reusable primitives | **2** |
| Generic component files | **0 of 34** |
| `:focus-visible` rules | **0** |
| Light mode | none |

**Diagnosis:** SamsKruti had a visual identity, not a design system. Colour encoded *editorial identity* (jade = streets, red = food, indigo = crafts) rather than *function* — so nobody could answer "what colour is the button?" without first asking "which page is it on."
