"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SiteHero, type HeroTheme } from "./site-hero";
import { GoogleVaranasiMap, type VaranasiMapActions } from "./google-varanasi-map";
import { VaranasiDots } from "./varanasi-dots";
import { HridayProductDots } from "./hriday-product-dots";
import { VARANASI_VIEW, type VaranasiSegment } from "@/data/varanasi-places";

interface Props {
  theme: HeroTheme;
  eyebrow?: ReactNode;
  roman?: ReactNode;
  title: ReactNode;
  devanagari?: ReactNode;
  tagline?: ReactNode;
  sub?: ReactNode;
  hint?: ReactNode;
  actions?: ReactNode;
  /** Filter the dots to a single segment (segment pages); omit for all dots. */
  segment?: VaranasiSegment;
  /** Show curated product dots (Sheher Ka Hriday) instead of place dots. */
  productDots?: boolean;
  /** Override the map camera (e.g. focus on the craft cluster). */
  mapCenter?: google.maps.LatLngLiteral;
  mapZoom?: number;
  /** Tapping a dot zooms the map and transitions to that segment page. */
  dotNavigate?: boolean;
}

/**
 * Varanasi hero — the city map with its ideal-point dots projected off the live
 * map (same technique as the home/India hero), so every dot sits exactly on its
 * coordinate. Holds the map instance and shares it with the dot overlay.
 */
export function CityHero({
  theme,
  eyebrow,
  roman,
  title,
  devanagari,
  tagline,
  sub,
  hint,
  actions,
  segment,
  productDots,
  mapCenter,
  mapZoom,
  dotNavigate,
}: Props) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [fading, setFading] = useState(false);
  const mapActionsRef = useRef<VaranasiMapActions | null>(null);
  const router = useRouter();

  // Tap a dot -> zoom the map into it, fade, then route to that segment.
  function handleDotClick(seg: VaranasiSegment, lat: number, lng: number) {
    mapActionsRef.current?.zoomTo(lat, lng);
    setTimeout(() => setFading(true), 1100);
    setTimeout(() => router.push(`/varanasi/${seg}`), 1700);
  }

  return (
    <>
      <SiteHero
        theme={theme}
        eyebrow={eyebrow}
        roman={roman}
        title={title}
        devanagari={devanagari}
        tagline={tagline}
        sub={sub}
        hint={hint}
        actions={actions}
        map={
          <GoogleVaranasiMap
            interactive={false}
            center={mapCenter ?? VARANASI_VIEW.center}
            zoom={mapZoom ?? VARANASI_VIEW.zoom}
            boundaryColor={theme.glow ?? theme.accent}
            onReady={setMap}
            mapActionsRef={mapActionsRef}
          />
        }
        dots={
          productDots
            ? <HridayProductDots map={map} />
            : <VaranasiDots map={map} segment={segment} onDotClick={dotNavigate ? handleDotClick : undefined} />
        }
      />
      {fading && <div className="landing-fade" aria-hidden="true" />}
    </>
  );
}
