"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const TOPO_URL    = "/data/india-states.json";
const CLAIMED_URL = "/data/india-north-claimed.json";

// States whose undersized geometry is replaced by CLAIMED_URL
const SKIP_KEYS = new Set(["in-jk", "in-la"]);

// Active and planned districts with [longitude, latitude]
const DISTRICTS: {
  name: string;
  coords: [number, number];
  state: string;
  active: boolean;
  segColors?: string[];
}[] = [
  {
    name: "Varanasi",
    coords: [82.9739, 25.3176],
    state: "uttar-pradesh",
    active: true,
    segColors: ["#3D7050", "#A83828", "#4F76B0"],
  },
  { name: "Lucknow",  coords: [80.9462, 26.8467], state: "uttar-pradesh", active: false },
  { name: "Jaipur",   coords: [75.7873, 26.9124], state: "rajasthan",     active: false },
  { name: "Kolkata",  coords: [88.3639, 22.5726], state: "west-bengal",   active: false },
  { name: "Mumbai",   coords: [72.8777, 19.0760], state: "maharashtra",   active: false },
  { name: "Delhi",    coords: [77.2090, 28.6139], state: "delhi",         active: false },
];

// UP hc-key in this dataset is "in-up" (in-ut = Uttarakhand, not UP)
const ACTIVE_STATE_KEYS = new Set(["in-up"]);

const STATE_STYLE = {
  default: {
    fill: "transparent",
    stroke: "rgba(200,101,42,0.38)",
    strokeWidth: 0.6,
    outline: "none",
  },
  hover: {
    fill: "rgba(200,101,42,0.07)",
    stroke: "rgba(200,101,42,0.65)",
    strokeWidth: 0.7,
    outline: "none",
  },
  pressed: { outline: "none" },
} as const;

const ACTIVE_STYLE = {
  default: {
    fill: "rgba(61,112,80,0.12)",
    stroke: "rgba(61,112,80,0.55)",
    strokeWidth: 0.6,
    outline: "none",
  },
  hover: {
    fill: "rgba(61,112,80,0.18)",
    stroke: "rgba(61,112,80,0.65)",
    strokeWidth: 0.7,
    outline: "none",
  },
  pressed: { outline: "none" },
} as const;

export function IndiaMap({ className }: { className?: string }) {
  return (
    <div className={`india-map-wrap ${className ?? ""}`}>
      {/* Zoom container — transform-origin at Varanasi ~(50%, 44%) */}
      <div className="india-map-zoom">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [82.5, 22],
            scale: 950,
          }}
          width={500}
          height={580}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {/* Solid dark background — prevents bleed-through */}
          <rect width={500} height={580} fill="#0A0807" />

          {/* All states except J&K and Ladakh (replaced below with correct boundaries) */}
          <Geographies geography={TOPO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => !SKIP_KEYS.has(geo.properties["hc-key"] as string))
                .map((geo) => {
                  const key = geo.properties["hc-key"] as string;
                  const isActive = ACTIVE_STATE_KEYS.has(key);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={isActive ? ACTIVE_STYLE : STATE_STYLE}
                    />
                  );
                })
            }
          </Geographies>

          {/* J&K + Ladakh with corrected post-2019 boundaries (includes PoK + Aksai Chin per India's claim) */}
          <Geographies geography={CLAIMED_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={STATE_STYLE}
                />
              ))
            }
          </Geographies>

          {/* Planned city dots */}
          {DISTRICTS.filter((d) => !d.active).map((d) => (
            <Marker key={d.name} coordinates={d.coords}>
              <circle r={2.5} fill="rgba(200,101,42,0.28)" />
            </Marker>
          ))}

          {/* Varanasi — active, pulsing rings + segment dots */}
          {DISTRICTS.filter((d) => d.active).map((d) => (
            <Marker key={d.name} coordinates={d.coords}>
              {/* Outer pulsing rings */}
              <circle className="v-ring v-ring-1" r={14} cx={0} cy={0} />
              <circle className="v-ring v-ring-2" r={14} cx={0} cy={0} />
              <circle className="v-ring v-ring-3" r={14} cx={0} cy={0} />
              {/* Core dot */}
              <circle r={5} fill="#C8652A" className="v-dot" />
              {/* Segment colour satellites */}
              {d.segColors?.map((color, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const cx = Math.cos(angle) * 16;
                const cy = Math.sin(angle) * 16;
                return (
                  <circle
                    key={color}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={color}
                    className="seg-hint"
                    style={{ animationDelay: `${5.5 + i * 0.2}s` }}
                  />
                );
              })}
              {/* Label */}
              <text
                textAnchor="start"
                x={9}
                y={-8}
                className="varanasi-label"
              >
                VARANASI
              </text>
              <text
                textAnchor="start"
                x={9}
                y={2}
                className="varanasi-label-sub"
              >
                Uttar Pradesh
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* "Begin here" tag — fades in after zoom completes */}
      <div className="varanasi-reveal" aria-hidden="true">
        <span className="varanasi-reveal-rule" />
        <span className="varanasi-reveal-text">Begin here</span>
      </div>
    </div>
  );
}
