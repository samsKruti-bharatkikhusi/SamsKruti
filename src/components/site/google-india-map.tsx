"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { SAMSKRUTI_DARK } from "./map-style";

const INDIA_CENTER = { lat: 22.8, lng: 80.5 };

export interface MapActions {
  zoomToCity: (lat: number, lng: number) => void;
}

interface Props {
  mapActionsRef?: MutableRefObject<MapActions | null>;
  /** Called once the map is created, so overlays can project off it. */
  onReady?: (map: google.maps.Map) => void;
}

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: "none",
  keyboardShortcuts: false,
  // Satellite imagery. Political borders aren't drawn on satellite tiles, so
  // India's outline comes from the saffron Data-layer overlay below. (Roadmap
  // + region:"IN" renders Google's own claimed border — kept as the tracing
  // reference for the overlay.)
  mapTypeId: "satellite",
  styles: SAMSKRUTI_DARK,
  backgroundColor: "#0A0807",
};

export function GoogleIndiaMap({ mapActionsRef, onReady }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    // India-localised boundary rendering for disputed borders.
    region: "IN",
  });

  const mapRef    = useRef<google.maps.Map | null>(null);
  const rafIn     = useRef<number>(0);
  const rafZoom   = useRef<number>(0);

  function onLoad(map: google.maps.Map) {
    mapRef.current = map;
    onReady?.(map);
    // Resting zoom fits India to the panel: lower on narrow/mobile screens.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const restZoom = isMobile ? 4.1 : 5.0;
    map.setZoom(restZoom - 1.0);
    map.setCenter(INDIA_CENTER);

    // ── Tint + national boundary, both inside the map ────────
    // Drawn as Data-layer features so they zoom/pan WITH the map (no detached
    // overlay). A dark polygon (role:"tint") sits under the boundary line via
    // zIndex, so the border stays bright above the tint while both animate
    // natively with the entrance zoom.
    map.data.setStyle((feature) => {
      if (feature.getProperty("role") === "tint") {
        return {
          fillColor: "#1F0F06",   // --hero-bg
          fillOpacity: 0.1,       // map tint (lower = brighter satellite)
          strokeWeight: 0,
          zIndex: 0,
          clickable: false,
        };
      }
      // National boundary line (Survey of India / datameet, simplified).
      return {
        strokeColor: "#F9A24A",
        strokeWeight: 1.6,
        strokeOpacity: 0.95,
        fillOpacity: 0,
        zIndex: 1,
        clickable: false,
      };
    });

    // Tint covers the whole subcontinent viewport at every zoom level.
    map.data.addGeoJson({
      type: "Feature",
      properties: { role: "tint" },
      geometry: {
        type: "Polygon",
        coordinates: [[[20, -20], [140, -20], [140, 55], [20, 55], [20, -20]]],
      },
    });
    fetch("/data/india-boundary.json")
      .then((r) => r.json())
      .then((geojson: GeoJSON.GeoJsonObject) => map.data.addGeoJson(geojson))
      .catch(() => { /* boundary is optional — fail silently */ });

    // ── Entrance: ease (restZoom−1) → restZoom over 3.8 s ────
    const ENTRANCE_MS = 3800;
    const t0 = performance.now();
    function entrance(now: number) {
      const raw = Math.min((now - t0) / ENTRANCE_MS, 1);
      // ease-in-out cubic — gentle start and finish, no abrupt stop
      const t = raw < 0.5
        ? 4 * raw * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      map.setZoom((restZoom - 1.0) + t);
      if (raw < 1) rafIn.current = requestAnimationFrame(entrance);
    }
    rafIn.current = requestAnimationFrame(entrance);

    // ── Expose zoomToCity ─────────────────────────────────────
    if (mapActionsRef) {
      mapActionsRef.current = {
        zoomToCity(lat, lng) {
          cancelAnimationFrame(rafIn.current);
          const z0   = map.getZoom()    ?? 5;
          const c0   = map.getCenter();
          const lat0 = c0?.lat() ?? INDIA_CENTER.lat;
          const lng0 = c0?.lng() ?? INDIA_CENTER.lng;
          const DURATION = 1900;
          const ts = performance.now();

          function zoomTick(now: number) {
            const raw = Math.min((now - ts) / DURATION, 1);
            // ease-in-out cubic
            const t = raw < 0.5
              ? 4 * raw * raw * raw
              : 1 - Math.pow(-2 * raw + 2, 3) / 2;
            map.setZoom(z0 + (13 - z0) * t);
            map.setCenter({ lat: lat0 + (lat - lat0) * t, lng: lng0 + (lng - lng0) * t });
            if (raw < 1) rafZoom.current = requestAnimationFrame(zoomTick);
          }
          rafZoom.current = requestAnimationFrame(zoomTick);
        },
      };
    }
  }

  useEffect(() => () => {
    cancelAnimationFrame(rafIn.current);
    cancelAnimationFrame(rafZoom.current);
  }, []);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      options={MAP_OPTIONS}
      onLoad={onLoad}
    />
  );
}
