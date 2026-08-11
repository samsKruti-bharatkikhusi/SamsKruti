"use client";

import { useEffect, useState } from "react";
import { HRIDAY_PRODUCTS } from "@/data/hriday-shop";

// Indigo accent (Sheher Ka Hriday).
const ACCENT = "#4F76B0";

type Pt = { x: number; y: number };

// All five focused crafts carry a location.
const MAPPED = HRIDAY_PRODUCTS;

/**
 * Product dots for the Sheher Ka Hriday hero map — each curated craft plotted
 * at its lane, projected off the live map. Hover -> a product card (like the
 * home/India map's city cards).
 */
export function HridayProductDots({ map }: { map: google.maps.Map | null }) {
  const [pts, setPts]       = useState<Record<string, Pt>>({});
  const [panelH, setPanelH] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

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
      for (const p of MAPPED) {
        const [lng, lat] = p.coords;
        const wp = proj.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
        if (!wp) continue;
        next[p.name] = { x: (wp.x - sw.x) * scale, y: (wp.y - ne.y) * scale };
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

  return (
    <div className="city-dots-layer" aria-label="Varanasi crafts on the map">
      {MAPPED.map((p, i) => {
        const pt = pts[p.name];
        if (!pt) return null;
        const isHovered = hovered === p.name;
        const cardBelow = pt.y < panelH * 0.28;

        return (
          <div
            key={p.name}
            className={`gmap-city-dot${isHovered ? " gmap-city-dot--hovered" : ""}`}
            style={{ left: pt.x, top: pt.y, animationDelay: `${1.6 + i * 0.07}s` }}
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered((cur) => (cur === p.name ? null : cur))}
          >
            <span className="gmap-dot-ring" style={{ borderColor: `${ACCENT}99` }} />
            <span
              className="gmap-dot-core"
              style={{
                background: ACCENT,
                width: 9,
                height: 9,
                boxShadow: `0 0 0 2px ${ACCENT}4D, 0 0 10px 4px ${ACCENT}73, 0 0 22px 8px ${ACCENT}2E`,
              }}
            />

            {isHovered && (
              <div
                className={`city-hover-card${cardBelow ? " city-hover-card--below" : ""}`}
                style={{ width: 214, borderColor: `${ACCENT}66` }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 14,
                    right: 14,
                    height: 1,
                    background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
                    opacity: 0.75,
                  }}
                />
                <div
                  style={{
                    height: 88,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ maxWidth: "82%", maxHeight: "78px", objectFit: "contain" }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.54rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    marginBottom: 4,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{p.category}</span>
                  {p.gi && <span>GI</span>}
                </p>
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: "1.15rem",
                    color: "#FBF6EC",
                    lineHeight: 1.15,
                    marginBottom: 5,
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    color: "rgba(250,247,243,0.8)",
                    marginBottom: 7,
                  }}
                >
                  {p.story}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.56rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(134,168,220,0.95)",
                    marginBottom: 3,
                  }}
                >
                  {p.maker}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.03em",
                    color: "var(--dust)",
                  }}
                >
                  {p.price}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
