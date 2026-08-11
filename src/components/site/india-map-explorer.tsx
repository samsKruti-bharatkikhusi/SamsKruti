"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader, GoogleMap, OverlayViewF, OverlayView } from "@react-google-maps/api";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { SAMSKRUTI_DARK } from "./map-style";
import { MAP_CITIES, type MapCity } from "@/data/map-cities";
import {
  PLACES,
  SEG,
  SEG_LABELS,
  SEG_KIND,
  VARANASI_VIEW,
  type VaranasiPlace,
} from "@/data/varanasi-places";

const INDIA_CENTER = { lat: 22.8, lng: 80.5 };
const INDIA_ZOOM = 4.4;
// Narrow screens need a lower zoom for the whole country to fit.
const indiaZoom = () =>
  typeof window !== "undefined" && window.innerWidth < 768 ? 3.7 : INDIA_ZOOM;

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: "greedy",   // scroll to zoom, drag to pan — free exploration
  zoomControl: true,
  keyboardShortcuts: false,
  mapTypeId: "satellite",
  styles: SAMSKRUTI_DARK,
  backgroundColor: "#0A0807",
  minZoom: 4,
  maxZoom: 17,
};

const centerOffset = (w: number, h: number) => ({ x: -(w / 2), y: -(h / 2) });

type Level = "india" | "varanasi";

export function IndiaMapExplorer() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    // Must match every other useJsApiLoader call — the loader is a singleton.
    region: "IN",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const rafFly = useRef<number>(0);
  const [level, setLevel] = useState<Level>("india");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => () => cancelAnimationFrame(rafFly.current), []);

  // ── Boundary (Data layer) ───────────────────────────────
  function clearData(map: google.maps.Map) {
    map.data.forEach((f) => map.data.remove(f));
  }

  function drawIndiaOutline(map: google.maps.Map) {
    fetch("/data/india-states.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        const obj = topo.objects["default"];
        const outline = topojson.mesh(topo, obj as GeometryCollection, (a, b) => a === b);
        map.data.addGeoJson({
          type: "FeatureCollection",
          features: [{ type: "Feature", geometry: outline as GeoJSON.Geometry, properties: {} }],
        });
        map.data.setStyle({
          strokeColor: "#C8652A",
          strokeWeight: 1.6,
          strokeOpacity: 0.6,
          fillOpacity: 0,
          clickable: false,
        });
      })
      .catch(() => { /* outline is optional */ });
  }

  function drawVaranasiOutline(map: google.maps.Map) {
    fetch("/data/varanasi-urban.json")
      .then((r) => r.json())
      .then((geojson: GeoJSON.GeoJsonObject) => {
        map.data.addGeoJson(geojson);
        map.data.setStyle({
          strokeColor: "#E8A23C",
          strokeWeight: 3,
          strokeOpacity: 1,
          fillColor: "#E8A23C",
          fillOpacity: 0.06,
          clickable: false,
        });
      })
      .catch(() => { /* outline is optional */ });
  }

  function onLoad(map: google.maps.Map) {
    mapRef.current = map;
    map.setZoom(indiaZoom());
    map.setCenter(INDIA_CENTER);
    drawIndiaOutline(map);
  }

  // ── Camera fly ──────────────────────────────────────────
  function flyTo(lat: number, lng: number, targetZoom: number, onDone: () => void) {
    const map = mapRef.current;
    if (!map) return;
    cancelAnimationFrame(rafFly.current);
    const z0 = map.getZoom() ?? 5;
    const c0 = map.getCenter();
    const lat0 = c0?.lat() ?? INDIA_CENTER.lat;
    const lng0 = c0?.lng() ?? INDIA_CENTER.lng;
    const DURATION = 1700;
    let ts = 0; // captured from first rAF timestamp (avoids impure now() in render)
    function tick(now: number) {
      const m = mapRef.current;
      if (!m) return;
      if (!ts) ts = now;
      const raw = Math.min((now - ts) / DURATION, 1);
      const t = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      m.setZoom(z0 + (targetZoom - z0) * t);
      m.setCenter({ lat: lat0 + (lat - lat0) * t, lng: lng0 + (lng - lng0) * t });
      if (raw < 1) rafFly.current = requestAnimationFrame(tick);
      else onDone();
    }
    rafFly.current = requestAnimationFrame(tick);
  }

  // ── Level transitions (in-place, no navigation) ─────────
  function enterVaranasi() {
    const map = mapRef.current;
    if (!map) return;
    setHoveredId(null);
    flyTo(VARANASI_VIEW.center.lat, VARANASI_VIEW.center.lng, VARANASI_VIEW.zoom, () => {
      setLevel("varanasi");
      clearData(map);
      drawVaranasiOutline(map);
    });
  }

  function backToIndia() {
    const map = mapRef.current;
    if (!map) return;
    setHoveredId(null);
    setLevel("india");
    clearData(map);
    drawIndiaOutline(map);
    flyTo(INDIA_CENTER.lat, INDIA_CENTER.lng, indiaZoom(), () => {});
  }

  function handleCityClick(city: MapCity) {
    if (city.active) enterVaranasi();
  }

  if (!isLoaded) return null;

  return (
    <div
      className="india-explorer"
      style={{ position: "relative", width: "100%", height: "100svh", background: "#0A0807" }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={MAP_OPTIONS}
        onLoad={onLoad}
      >
        {/* ── India level — Jyotirlinga city dots ── */}
        {level === "india" &&
          MAP_CITIES.map((city) => {
            const isHovered = hoveredId === city.id;
            return (
              <OverlayViewF
                key={city.id}
                position={{ lat: city.lat, lng: city.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={centerOffset}
              >
                <div
                  className={[
                    "emap-pin",
                    city.active ? "gmap-city-dot--active" : "gmap-city-dot--soon",
                    isHovered ? "gmap-city-dot--hovered" : "",
                  ].join(" ")}
                  style={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={() => setHoveredId(city.id)}
                  onMouseLeave={() => setHoveredId((cur) => (cur === city.id ? null : cur))}
                  onClick={() => {
                    // First tap opens the card; once open, a tap enters.
                    if (hoveredId !== city.id) setHoveredId(city.id);
                    else handleCityClick(city);
                  }}
                  role={city.active ? "button" : undefined}
                  tabIndex={city.active ? 0 : undefined}
                  onKeyDown={(e) => e.key === "Enter" && handleCityClick(city)}
                >
                  {city.active && <span className="gmap-dot-ring" />}
                  {city.active && <span className="gmap-dot-ring gmap-dot-ring--delay" />}
                  <span className="gmap-dot-core" />
                  <span className="gmap-dot-label">
                    <span className="gmap-dot-label-hindi">{city.hindi}</span>
                  </span>
                  {isHovered && (
                    <div className={`city-hover-card${city.lat > 27 ? " city-hover-card--below" : ""}`}>
                      <p className="chc-hindi">{city.hindi}</p>
                      <p className="chc-temple">{city.temple}</p>
                      <p className="chc-location">{city.city} · {city.state}</p>
                      {city.active ? (
                        <>
                          {city.tagline && <p className="chc-tagline">{city.tagline}</p>}
                          <button
                            type="button"
                            className="chc-enter chc-enter-btn"
                            onClick={(e) => { e.stopPropagation(); handleCityClick(city); }}
                          >
                            Open the city map →
                          </button>
                        </>
                      ) : (
                        <span className="chc-soon">Coming Soon</span>
                      )}
                    </div>
                  )}
                </div>
              </OverlayViewF>
            );
          })}

        {/* ── Varanasi level — segment-coded ideal points ── */}
        {level === "varanasi" &&
          PLACES.map((p: VaranasiPlace) => {
            const id = `${p.segment}-${p.name}`;
            const isHovered = hoveredId === id;
            const color = SEG[p.segment];
            return (
              <OverlayViewF
                key={id}
                position={{ lat: p.coords[1], lng: p.coords[0] }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={centerOffset}
              >
                <div
                  style={{
                    position: "relative",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: isHovered ? 30 : undefined,
                  }}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId((cur) => (cur === id ? null : cur))}
                  onClick={() => setHoveredId((cur) => (cur === id ? null : id))}
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
                  {p.heroLabel && !isHovered && (
                    <span className="gmap-dot-label">
                      {p.hindi && <span className="gmap-dot-label-hindi">{p.hindi}</span>}
                      <span className="gmap-dot-label-temple" style={{ color }}>{p.name}</span>
                    </span>
                  )}
                  {isHovered && (
                    <div
                      className={`city-hover-card${p.coords[1] > 25.34 ? " city-hover-card--below" : ""}`}
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
                        <p style={{ fontFamily: "var(--devanagari)", fontSize: "1.02rem", color: "#FBF6EC", lineHeight: 1.2, marginBottom: 2 }}>
                          {p.hindi}
                        </p>
                      )}
                      <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.82rem", color: "rgba(250,247,243,0.82)", marginBottom: 7 }}>
                        {p.name}
                      </p>
                      <p style={{ fontFamily: "var(--sans)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: 2 }}>
                        {SEG_LABELS[p.segment]}
                      </p>
                      <p style={{ fontFamily: "var(--sans)", fontSize: "0.62rem", letterSpacing: "0.04em", color: "var(--dust)" }}>
                        {SEG_KIND[p.segment]}
                      </p>
                    </div>
                  )}
                </div>
              </OverlayViewF>
            );
          })}
      </GoogleMap>

      {/* ── Back control — only at the Varanasi level ── */}
      {level === "varanasi" && (
        <button
          type="button"
          onClick={backToIndia}
          style={{
            position: "absolute",
            top: 92,
            left: 28,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            cursor: "pointer",
            background: "rgba(18,8,3,0.82)",
            color: "#E8A23C",
            border: "1px solid rgba(232,162,60,0.4)",
            borderRadius: 3,
            fontFamily: "var(--sans)",
            fontSize: "0.66rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            backdropFilter: "blur(4px)",
          }}
        >
          ← Back to India
        </button>
      )}
    </div>
  );
}
