"use client";

import { useEffect, useState } from "react";
import { MAP_CITIES } from "@/data/map-cities";

interface Props {
  /** The live India map — dots are projected off it so they stay aligned at
   *  any size / zoom (desktop split panel or stacked mobile layout). */
  map: google.maps.Map | null;
  onCityClick: (cityId: string, lat: number, lng: number) => void;
}

type Pt = { x: number; y: number };

export function CityDots({ map, onCityClick }: Props) {
  const [pts, setPts]         = useState<Record<string, Pt>>({});
  const [panelH, setPanelH]   = useState(0);
  // The dot whose card is open. On touch (no hover) the first tap opens it,
  // a second tap (or the "Enter" button) navigates.
  const [activeId, setActiveId] = useState<string | null>(null);

  // Project every city through the map's own projection on any camera change.
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
      for (const c of MAP_CITIES) {
        const wp = proj.fromLatLngToPoint(new google.maps.LatLng(c.lat, c.lng));
        if (!wp) continue;
        next[c.id] = { x: (wp.x - sw.x) * scale, y: (wp.y - ne.y) * scale };
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
    <div className="city-dots-layer" aria-label="Choose a Jyotirlinga city">
      {MAP_CITIES.map((city, i) => {
        const p = pts[city.id];
        if (!p) return null;
        const isActive  = activeId === city.id;
        const cardBelow = p.y < panelH * 0.28;

        return (
          <div
            key={city.id}
            className={[
              "gmap-city-dot",
              city.active ? "gmap-city-dot--active" : "gmap-city-dot--soon",
              isActive    ? "gmap-city-dot--hovered" : "",
            ].join(" ")}
            style={{ left: p.x, top: p.y, animationDelay: `${3.9 + i * 0.1}s` }}
            onMouseEnter={() => setActiveId(city.id)}
            onMouseLeave={() => setActiveId((cur) => (cur === city.id ? null : cur))}
            onClick={() => {
              // First interaction opens the card; once open, a tap enters.
              if (activeId !== city.id) setActiveId(city.id);
              else if (city.active) onCityClick(city.id, city.lat, city.lng);
            }}
            role={city.active ? "button" : undefined}
            tabIndex={city.active ? 0 : undefined}
            onKeyDown={(e) => e.key === "Enter" && city.active && onCityClick(city.id, city.lat, city.lng)}
          >
            {city.active && <span className="gmap-dot-ring" />}
            {city.active && <span className="gmap-dot-ring gmap-dot-ring--delay" />}

            <span className="gmap-dot-core" />

            <span className="gmap-dot-label">
              <span className="gmap-dot-label-hindi">{city.hindi}</span>
            </span>

            {isActive && (
              <div className={`city-hover-card${cardBelow ? " city-hover-card--below" : ""}`}>
                {city.image && (
                  <span className="chc-img">
                    <img src={city.image} alt={city.temple} loading="lazy" />
                  </span>
                )}
                <p className="chc-hindi">{city.hindi}</p>
                <p className="chc-temple">{city.temple}</p>
                <p className="chc-location">{city.city} · {city.state}</p>
                {city.active ? (
                  <>
                    {city.tagline && <p className="chc-tagline">{city.tagline}</p>}
                    <button
                      type="button"
                      className="chc-enter chc-enter-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCityClick(city.id, city.lat, city.lng);
                      }}
                    >
                      Enter the city →
                    </button>
                  </>
                ) : (
                  <span className="chc-soon">Coming Soon</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
