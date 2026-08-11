"use client";

import { useEffect, useState } from "react";
import { PLACES, SEG, SEG_LABELS, SEG_KIND, type VaranasiSegment } from "@/data/varanasi-places";

interface Props {
  /** The live Varanasi map — dots are projected off it so they sit exactly on
   *  each coordinate at any size/zoom (same technique as the India map). */
  map: google.maps.Map | null;
  /** If set, only this segment's places are shown (e.g. on a segment page). */
  segment?: VaranasiSegment;
  /** If set, dots are clickable -> triggers the zoom/transition to a segment. */
  onDotClick?: (segment: VaranasiSegment, lat: number, lng: number) => void;
}

type Pt = { x: number; y: number };

export function VaranasiDots({ map, segment, onDotClick }: Props) {
  const [pts, setPts]         = useState<Record<string, Pt>>({});
  const [panelH, setPanelH]   = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Project every place through the map's own projection on any camera change.
  useEffect(() => {
    if (!map) return;

    function recompute() {
      if (!map) return;
      const proj = map.getProjection();
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      if (!proj || !bounds || zoom == null) return;

      const ne = proj.fromLatLngToPoint(bounds.getNorthEast());
      const sw = proj.fromLatLngToPoint(bounds.getSouthWest());
      if (!ne || !sw) return;

      const scale = Math.pow(2, zoom);
      const next: Record<string, Pt> = {};
      for (const p of PLACES) {
        const [lng, lat] = p.coords;
        const wp = proj.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
        if (!wp) continue;
        next[`${p.segment}-${p.name}`] = { x: (wp.x - sw.x) * scale, y: (wp.y - ne.y) * scale };
      }
      setPts(next);
      setPanelH(map.getDiv().clientHeight);
    }

    const l1 = map.addListener("bounds_changed", recompute);
    const l2 = map.addListener("idle", recompute);
    recompute();
    window.addEventListener("resize", recompute);
    return () => {
      l1.remove();
      l2.remove();
      window.removeEventListener("resize", recompute);
    };
  }, [map]);

  if (!map) return null;

  const places = segment ? PLACES.filter((p) => p.segment === segment) : PLACES;

  // Reuses the landing page's proven dot + hover-card classes; the segment
  // colour is applied inline so it overrides the terracotta defaults.
  return (
    <div className="city-dots-layer" aria-label="Varanasi — ideal points">
      {places.map((p, i) => {
        const id = `${p.segment}-${p.name}`;
        const pt = pts[id];
        if (!pt) return null;
        const [lng, lat] = p.coords;
        const color = SEG[p.segment];
        const isHovered = hoveredId === id;
        const cardBelow = pt.y < panelH * 0.28;

        return (
          <div
            key={id}
            className={`gmap-city-dot${isHovered ? " gmap-city-dot--hovered" : ""}`}
            style={{ left: pt.x, top: pt.y, animationDelay: `${1.8 + i * 0.08}s`, cursor: onDotClick ? "pointer" : undefined }}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId((cur) => (cur === id ? null : cur))}
            onClick={onDotClick ? () => onDotClick(p.segment, lat, lng) : undefined}
          >
            {p.featured && (
              <>
                <span className="gmap-dot-ring" style={{ borderColor: `${color}99` }} />
                <span
                  className="gmap-dot-ring gmap-dot-ring--delay"
                  style={{ borderColor: `${color}99` }}
                />
              </>
            )}

            <span
              className="gmap-dot-core"
              style={{
                background: color,
                width: p.featured ? 10 : 7,
                height: p.featured ? 10 : 7,
                boxShadow: `0 0 0 2px ${color}4D, 0 0 10px 4px ${color}73, 0 0 22px 8px ${color}2E`,
              }}
            />

            {/* Persistent label for a few well-separated anchor points */}
            {p.heroLabel && !isHovered && (
              <span className="gmap-dot-label">
                {p.hindi && <span className="gmap-dot-label-hindi">{p.hindi}</span>}
                <span className="gmap-dot-label-temple" style={{ color }}>
                  {p.name}
                </span>
              </span>
            )}

            {/* Hover card — one per segment kind, colour-matched */}
            {isHovered && (
              <div
                className={`city-hover-card${cardBelow ? " city-hover-card--below" : ""}`}
                style={{ width: 200, borderColor: `${color}66` }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 14,
                    right: 14,
                    height: 1,
                    background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                    opacity: 0.7,
                  }}
                />
                {p.hindi && (
                  <p
                    style={{
                      fontFamily: "var(--devanagari)",
                      fontSize: "1.02rem",
                      color: "#FBF6EC",
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {p.hindi}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontSize: "0.82rem",
                    color: "rgba(250,247,243,0.82)",
                    marginBottom: 7,
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.56rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color,
                    marginBottom: 2,
                  }}
                >
                  {SEG_LABELS[p.segment]}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.04em",
                    color: "var(--dust)",
                  }}
                >
                  {SEG_KIND[p.segment]}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
