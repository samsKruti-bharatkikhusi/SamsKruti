# SamsKruti — Streets of India

SamsKruti is a cultural narrative platform. Quiet, rooted, and intentional. Three products, one purpose: to tell India's hidden stories with depth and respect.

## The Thesis

India cannot be understood through highlights. It must be experienced — through its streets, its kitchens, and the hands that carry its memory. SamsKruti surfaces **hidden treasures**: the overlooked heritage, the forgotten recipes, the artisans nobody documents.

## The Three Segments

Each segment is a distinct sub-brand within the SamsKruti family. Same parent, three different doorways into the same civilisation.

| Segment | Hindi | Identity | Theme Colour | Background |
|---|---|---|---|---|
| **Sheher Ki Galiyan** | शहर की गलियाँ | Heritage in the city — ancient lanes, temples, havelis, step-wells, city gates that most people walk past | `#3D7050` Heritage Jade | `#050F09` |
| **Khane Ki Parampara** | खाने की परंपरा | Food in the city — traditional recipes, kitchen culture, the dishes that carry civilisational memory | `#A83828` Tamarind Red | `#0D0302` |
| **Sheher Ka Hriday** | शहर का हृदय | Arts & Crafts in the city — weavers, potters, painters, smiths carrying living knowledge in their hands | `#4F76B0` Indigo | `#060810` |

## Parent Brand — SamsKruti

| Token | Value | Meaning |
|---|---|---|
| Primary accent | `#C8652A` Terracotta | The living city — brick, dust, ancient streets |
| Background | `#1F0F06` Deep Earth | The oldest, darkest layer |
| Gold leaf | `#B8893E` | Used on editorial accents, dividers, manuscript moments |

## Overall Theme: Hidden Treasures

The unifying idea across all three segments is **surfacing what is hidden**:
- Galiyan surfaces hidden **heritage** — the buildings and streets time forgot
- Parampara surfaces hidden **recipes** — the dishes that never made it to a restaurant menu
- Hriday surfaces hidden **makers** — the artisans whose names nobody knows

Itineraries are planned as a **cross-segment experience** — a Varanasi itinerary, for example, weaves heritage stops (Galiyan), food stops (Parampara), and artisan visits (Hriday) into one journey.

## Brand Marks

All brand marks are in `public/brand/`:

| File | Used for |
|---|---|
| `master-mark.png` | SamsKruti parent — light backgrounds |
| `master-seal-deep-earth.png` | SamsKruti parent — dark backgrounds |
| `sheher-ki-galiyan.jpg` | Galiyan segment — temple street illustration |
| `khane-ki-parampara.jpg` | Parampara segment — clay pot + diya |
| `sheher-ka-hriday.jpg` | Hriday segment — hands holding lotus, loom behind |

## Design System

- **Display font:** Cormorant Garamond (`--display`)
- **Devanagari:** Noto Serif Devanagari (`--devanagari`)
- **Base palette:** deep earth, terracotta, ochre-glow, aged-ivory, dust, walnut
- **Design file:** `uploads/samskruti-design-system.html`

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + custom CSS design tokens
- **React:** 19.2.4

## Routes

| Route | Segment |
|---|---|
| `/` | Hub — SamsKruti home |
| `/galiyan` | Sheher Ki Galiyan |
| `/galiyan?tab=cities` | Cities tab |
| `/galiyan?tab=itinerary` | Varanasi 4-day itinerary |
| `/galiyan?tab=stories` | Field stories |
| `/parampara` | Khane Ki Parampara |
| `/hriday` | Sheher Ka Hriday |

## Key Data Files

| File | Contents |
|---|---|
| `src/data/varanasi-itinerary.json` | 4-day Varanasi itinerary — 18 stops, civilisational story notes |
| `src/data/cities.json` | City profiles |
| `src/data/stories.json` | Field stories |
| `src/data/food.json` | Food traditions |
| `src/data/artisans.json` | Artisan profiles |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
