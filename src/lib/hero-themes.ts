import type { HeroTheme } from "@/components/site/site-hero";

// One palette per screen. Drives the hero (--hero-* tokens) AND the sidebar
// (--side-* tokens) so "change the theme" is a single value per page. Accent +
// background come from the canonical SEGMENTS palette; glow/text are tuned per
// screen for the dark map hero.
//
// IMPORTANT: `panel` MUST equal `bg`. The left copy panel paints with `panel`
// while the panel→map seam gradient (.lp-right::before) starts from `bg`. If the
// two differ you get a visible vertical "partition" at the seam; keeping them
// identical (as on home) makes the screen read as one continuous surface.
export type ScreenKey = "home" | "varanasi" | "galiyan" | "parampara" | "hriday";

export const HERO_THEMES: Record<ScreenKey, HeroTheme> = {
  home: {
    bg: "#1F0F06", bgRgb: "31, 15, 6", panel: "#1F0F06",
    accent: "#C8652A", accentRgb: "200, 101, 42", text: "#FAF7F3",
    glow: "#E8A870", mapTint: 0.75,
  },
  varanasi: {
    bg: "#140D04", bgRgb: "20, 13, 4", panel: "#140D04",
    accent: "#E8A23C", accentRgb: "232, 162, 60", text: "#FBF6EC",
    glow: "#F5C266", mapTint: 0.55,
  },
  galiyan: {
    bg: "#050F09", bgRgb: "5, 15, 9", panel: "#050F09",
    accent: "#3D7050", accentRgb: "61, 112, 80", text: "#F2F7F3",
    glow: "#6FB088", mapTint: 0.6,
  },
  parampara: {
    bg: "#0D0302", bgRgb: "13, 3, 2", panel: "#0D0302",
    accent: "#A83828", accentRgb: "168, 56, 40", text: "#FBF1EE",
    glow: "#E08A5A", mapTint: 0.6,
  },
  hriday: {
    bg: "#060810", bgRgb: "6, 8, 16", panel: "#060810",
    accent: "#4F76B0", accentRgb: "79, 118, 176", text: "#EEF2FB",
    glow: "#86A8DC", mapTint: 0.6,
  },
};
