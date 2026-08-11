// ── Platform root ─────────────────────────────────────────
import platformRaw from "./platform.json";

// ── District data imports ─────────────────────────────────

// District: Varanasi
import varanasiMeta from "./districts/varanasi/meta.json";
import varanasiGaliyan from "./districts/varanasi/galiyan.json";
import varanasiParampara from "./districts/varanasi/parampara.json";
import varanasiHriday from "./districts/varanasi/hriday.json";
import varanasiItineraryRaw from "./districts/varanasi/itineraries/4-day.json";

// District: Kolkata
import kolkataMeta from "./districts/kolkata/meta.json";
import kolkataGaliyan from "./districts/kolkata/galiyan.json";
import kolkataParampara from "./districts/kolkata/parampara.json";
import kolkataHriday from "./districts/kolkata/hriday.json";

// District: Jaipur
import jaipurMeta from "./districts/jaipur/meta.json";
import jaipurGaliyan from "./districts/jaipur/galiyan.json";
import jaipurParampara from "./districts/jaipur/parampara.json";
import jaipurHriday from "./districts/jaipur/hriday.json";

// District: Mumbai
import mumbaiMeta from "./districts/mumbai/meta.json";
import mumbaiGaliyan from "./districts/mumbai/galiyan.json";
import mumbaiParampara from "./districts/mumbai/parampara.json";
import mumbaiHriday from "./districts/mumbai/hriday.json";

// District: Delhi
import delhiMeta from "./districts/delhi/meta.json";
import delhiGaliyan from "./districts/delhi/galiyan.json";
import delhiParampara from "./districts/delhi/parampara.json";
import delhiHriday from "./districts/delhi/hriday.json";

// ── Shared types ──────────────────────────────────────────

export type Gradient = { g1: string; g2: string };

export type CityDimensionKey = "culture" | "craft" | "people" | "memory";

export type CityDimension = {
  title: string;
  body: string;
  accentColor: string;
};

export type City = {
  _id: string;
  name: string;
  slug: string;
  state: string;
  featured: boolean;
  tagline: string;
  description: string;
  dimensions: Record<CityDimensionKey, CityDimension>;
};

export type Story = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cityName?: string;
  districtName?: string;
  districtSlug?: string;
  category: string;
  tag?: string;
  featured: boolean;
  gradient: Gradient;
  cityId?: string;
  districtId?: string;
};

export type FoodTradition = {
  _id: string;
  name: string;
  slug: string;
  cityName?: string;
  districtName?: string;
  districtSlug?: string;
  category: string;
  featured: boolean;
  excerpt: string;
  body: string;
  gradient: Gradient;
  tags: string[];
  cityId?: string;
  districtId?: string;
};

export type Artisan = {
  _id: string;
  name: string;
  slug: string;
  cityName?: string;
  districtName?: string;
  districtSlug?: string;
  craft: string;
  generation: string;
  featured: boolean;
  excerpt: string;
  body: string;
  gradient: Gradient;
  tags: string[];
  cityId?: string;
  districtId?: string;
};

export type ItineraryStop = {
  time: string;
  name: string;
  desc: string;
  story: string;
  duration: string;
  isClosing?: boolean;
};

export type ItineraryDay = {
  day: number;
  theme: string;
  themeEnglish: string;
  hindi: string;
  tagline: string;
  accentColor: string;
  stops: ItineraryStop[];
};

export type ItineraryNote = {
  icon: string;
  title: string;
  body: string;
};

export type CityItinerary = {
  cityId: string;
  cityName: string;
  title: string;
  subtitle: string;
  intro: string;
  stats: { days: number; stops: number; pricePerPerson: string };
  days: ItineraryDay[];
  operationalNotes: ItineraryNote[];
};

export type DistrictMeta = City & {
  hindi: string;
  stateName: string;
  coordinates?: [number, number];
};

// ── Aggregated collections ────────────────────────────────

export const DISTRICTS = [
  varanasiMeta,
  kolkataMeta,
  jaipurMeta,
  mumbaiMeta,
  delhiMeta,
] as DistrictMeta[];

export const cities = DISTRICTS as City[];

export const stories = [
  ...varanasiGaliyan,
  ...kolkataGaliyan,
  ...jaipurGaliyan,
  ...mumbaiGaliyan,
  ...delhiGaliyan,
] as Story[];

export const foods = [
  ...varanasiParampara,
  ...kolkataParampara,
  ...jaipurParampara,
  ...mumbaiParampara,
  ...delhiParampara,
] as FoodTradition[];

export const artisans = [
  ...varanasiHriday,
  ...kolkataHriday,
  ...jaipurHriday,
  ...mumbaiHriday,
  ...delhiHriday,
] as Artisan[];

export const varanasiItinerary = varanasiItineraryRaw as CityItinerary;

// ── Per-district accessors ────────────────────────────────

export const DISTRICT_DATA = {
  varanasi: {
    meta: varanasiMeta as DistrictMeta,
    galiyan: varanasiGaliyan as Story[],
    parampara: varanasiParampara as FoodTradition[],
    hriday: varanasiHriday as Artisan[],
    itinerary: varanasiItineraryRaw as CityItinerary,
  },
  kolkata: {
    meta: kolkataMeta as DistrictMeta,
    galiyan: kolkataGaliyan as Story[],
    parampara: kolkataParampara as FoodTradition[],
    hriday: kolkataHriday as Artisan[],
  },
  jaipur: {
    meta: jaipurMeta as DistrictMeta,
    galiyan: jaipurGaliyan as Story[],
    parampara: jaipurParampara as FoodTradition[],
    hriday: jaipurHriday as Artisan[],
  },
  mumbai: {
    meta: mumbaiMeta as DistrictMeta,
    galiyan: mumbaiGaliyan as Story[],
    parampara: mumbaiParampara as FoodTradition[],
    hriday: mumbaiHriday as Artisan[],
  },
  delhi: {
    meta: delhiMeta as DistrictMeta,
    galiyan: delhiGaliyan as Story[],
    parampara: delhiParampara as FoodTradition[],
    hriday: delhiHriday as Artisan[],
  },
} as const;

export type DistrictSlug = keyof typeof DISTRICT_DATA;

export const DIMENSION_ORDER: CityDimensionKey[] = ["culture", "craft", "people", "memory"];

// ── Platform root export ──────────────────────────────────
export const platform = platformRaw;
