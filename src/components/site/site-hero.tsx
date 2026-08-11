import type { CSSProperties, ReactNode } from "react";
import { HeroMandalaHub } from "./seals";

/** Per-page hero palette. Any omitted field falls back to the home defaults. */
export interface HeroTheme {
  /** Page background. */
  bg?: string;
  /** Same as bg as "r, g, b" — used for the seam gradient + map tint. */
  bgRgb?: string;
  /** Left (copy) panel background. */
  panel?: string;
  /** Accent colour — wordmark emphasis, rule, hint, mandala. */
  accent?: string;
  /** Same as accent as "r, g, b" — used for translucent accents. */
  accentRgb?: string;
  /** Main heading colour. */
  text?: string;
  /** Mandala inner-petal glow. */
  glow?: string;
  /** Opacity (0–1) of the dark tint over the map. Lower = brighter map. */
  mapTint?: number;
}

interface SiteHeroProps {
  /** Decorative mandala behind the left copy. Defaults to a themed hub mandala. */
  mandala?: ReactNode;
  /** Small uppercase kicker above the wordmark (e.g. a segment name). */
  eyebrow?: ReactNode;
  /** Roman numeral / chapter mark shown beside the eyebrow. */
  roman?: ReactNode;
  /** Main wordmark / heading. */
  title: ReactNode;
  devanagari?: ReactNode;
  tagline?: ReactNode;
  sub?: ReactNode;
  /** Small uppercase hint line at the bottom of the copy. */
  hint?: ReactNode;
  /** CTA buttons rendered under the copy. */
  actions?: ReactNode;
  /** Map that fills the right panel. Omit for a mandala-only hero. */
  map?: ReactNode;
  /** Optional dot overlay above the map. */
  dots?: ReactNode;
  /** Palette override. Omit for the home (earth + terracotta) theme. */
  theme?: HeroTheme;
}

/**
 * Shared full-screen hero used across pages. Reuses the landing page's exact,
 * proven layout (lp-* / landing-* classes) so every page reads as the same map
 * experience — mandala + copy on the left, map + dots on the right. Colours are
 * driven by --hero-* tokens, so a `theme` re-skins the whole hero (including the
 * seam gradient and map tint, which inherit the tokens through the cascade).
 */
export function SiteHero({
  mandala,
  eyebrow,
  roman,
  title,
  devanagari,
  tagline,
  sub,
  hint,
  actions,
  map,
  dots,
  theme,
}: SiteHeroProps) {
  // width:100% override (instead of .landing-page's 100vw) avoids a horizontal
  // scrollbar when the hero sits inside a scrolling page. Theme tokens, when
  // provided, override the defaults declared on .landing-page.
  const style: CSSProperties = {
    width: "100%",
    ...(theme?.bg        ? { "--hero-bg": theme.bg } : {}),
    ...(theme?.bgRgb     ? { "--hero-bg-rgb": theme.bgRgb } : {}),
    ...(theme?.panel     ? { "--hero-panel": theme.panel } : {}),
    ...(theme?.accent    ? { "--hero-accent": theme.accent } : {}),
    ...(theme?.accentRgb ? { "--hero-accent-rgb": theme.accentRgb } : {}),
    ...(theme?.text      ? { "--hero-text": theme.text } : {}),
    ...(theme?.glow      ? { "--hero-glow": theme.glow } : {}),
    ...(theme?.mapTint != null ? { "--hero-map-tint": String(theme.mapTint) } : {}),
  } as CSSProperties;

  return (
    <div className="landing-page" style={style}>
      {/* ── LEFT — brand / copy ──────────────────────────── */}
      <div className="lp-left">
        {mandala ?? (
          <HeroMandalaHub className="lp-mandala" color={theme?.accent} innerColor={theme?.glow} />
        )}
        <div className="lp-medallion">
          <div className="lp-copy">
            {(eyebrow || roman) && (
              <p className="lp-eyebrow">
                {roman && <span className="lp-roman">{roman}</span>}
                {eyebrow}
              </p>
            )}
            <h1 className="lp-wordmark">{title}</h1>
            {devanagari && <p className="lp-devanagari">{devanagari}</p>}
            <div className="lp-rule" aria-hidden="true">
              <span className="lp-rule-line" />
              <span className="lp-rule-diamond" />
              <span className="lp-rule-line" />
            </div>
            {tagline && <p className="lp-tagline">{tagline}</p>}
            {sub && <p className="lp-sub">{sub}</p>}
            {actions && <div className="lp-actions">{actions}</div>}
            {hint && <p className="lp-hint">{hint}</p>}
          </div>
        </div>
      </div>

      {/* ── RIGHT — map panel ────────────────────────────── */}
      <div className="lp-right">
        {map && <div className="landing-map">{map}</div>}
        {dots}
      </div>
    </div>
  );
}
