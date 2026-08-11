"use client";

import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { PLACES, SEG, SEG_LABELS, type VaranasiSegment as Segment } from "@/data/varanasi-places";

const DISTRICT_URL = "/data/varanasi-district.json";

// Approximate Ganga river centreline through Varanasi district
const GANGA: [number, number][] = [
  [83.05,  25.19],
  [83.04,  25.235],
  [83.025, 25.268],
  [83.012, 25.281],  // Assi Ghat area
  [83.010, 25.296],
  [83.010, 25.308],  // Dashashwamedh
  [83.009, 25.322],  // Manikarnika
  [83.000, 25.350],
  [82.985, 25.398],
  [82.968, 25.448],
  [82.952, 25.500],
  [82.935, 25.555],
];

interface Props {
  /** "full" = large hub display; "mini" = sidebar; "city" = landing-page city-centre lens */
  variant?: "full" | "mini" | "city";
  /** If set, only markers of this segment are highlighted; others dim */
  activeSegment?: Segment;
  className?: string;
}

const PROJ: Record<"full" | "mini" | "city", {
  center: [number, number]; scale: number; w: number; h: number;
}> = {
  full: { center: [82.92,  25.375], scale:  52000, w: 540, h: 560 },
  mini: { center: [82.92,  25.375], scale:  38000, w: 340, h: 380 },
  // City-centre lens: zoomed into Assi-Ghat ↔ Sarnath corridor
  city: { center: [82.995, 25.320], scale: 145000, w: 420, h: 420 },
};

export function VaranasiDistrictMap({
  variant = "full",
  activeSegment,
  className = "",
}: Props) {
  const isMini = variant === "mini";
  const isCity = variant === "city";
  const { center, scale, w, h } = PROJ[variant];

  return (
    <div className={`vmap-wrap vmap-${variant} ${className}`}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center, scale }}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Solid dark background */}
        <rect width={w} height={h} fill="#050504" />

        {/* District boundary */}
        <Geographies geography={DISTRICT_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "transparent",
                    stroke: isCity ? "rgba(200,101,42,0.6)" : "rgba(200,101,42,0.5)",
                    strokeWidth: isMini ? 0.8 : isCity ? 1.0 : 1.2,
                    outline: "none",
                  },
                  hover:   { fill: "rgba(255,255,255,0.02)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Ganga river */}
        <Line
          coordinates={GANGA}
          stroke={isCity ? "rgba(79,118,176,0.7)" : "rgba(79,118,176,0.55)"}
          strokeWidth={isMini ? 1.8 : isCity ? 3.5 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Location markers */}
        {PLACES.map((p) => {
          const color = SEG[p.segment];
          const dimmed = activeSegment && p.segment !== activeSegment;
          const opacity = dimmed ? 0.18 : 1;
          const r = p.featured
            ? (isMini ? 3 : isCity ? 5.5 : 4.5)
            : (isMini ? 2 : isCity ? 3.5 : 3);

          return (
            <Marker key={`${p.segment}-${p.name}`} coordinates={p.coords}>
              {/* Halo on featured markers */}
              {p.featured && !isMini && (
                <circle
                  r={isCity ? 13 : 10}
                  fill={color}
                  opacity={dimmed ? 0.04 : isCity ? 0.15 : 0.12}
                  className="vmap-halo"
                />
              )}
              <circle
                r={r}
                fill={color}
                opacity={opacity}
                className="vmap-dot"
              />
              {/* Label on full and city variants, featured only */}
              {!isMini && p.featured && !dimmed && (
                <text
                  x={7}
                  y={-7}
                  className="vmap-label"
                  style={{
                    fill: color,
                    fontSize: isCity ? "7px" : "5.5px",
                    fontFamily: "var(--sans)",
                    letterSpacing: "0.6px",
                  }}
                >
                  {p.name}
                </text>
              )}
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Legend — only on full variant */}
      {!isMini && !isCity && (
        <div className="vmap-legend">
          {(Object.keys(SEG) as Segment[]).map((seg) => (
            <div
              key={seg}
              className="vmap-legend-item"
              style={{ opacity: activeSegment && activeSegment !== seg ? 0.3 : 1 }}
            >
              <span className="vmap-legend-dot" style={{ background: SEG[seg] }} />
              <span className="vmap-legend-label">{SEG_LABELS[seg]}</span>
            </div>
          ))}
          <div className="vmap-legend-item">
            <span className="vmap-legend-river" />
            <span className="vmap-legend-label">River Ganga</span>
          </div>
        </div>
      )}
    </div>
  );
}
