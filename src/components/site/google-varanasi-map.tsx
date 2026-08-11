"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { SAMSKRUTI_DARK } from "./map-style";

export interface VaranasiMapActions {
  zoomTo: (lat: number, lng: number) => void;
}

const VARANASI_CENTER = { lat: 25.372, lng: 82.927 };
// Full administrative district outline (not just the built-up urban core).
const BOUNDARY_URL = "/data/varanasi-district.json";

const BASE_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  keyboardShortcuts: false,
  mapTypeId: "satellite",
  styles: SAMSKRUTI_DARK,
  backgroundColor: "#0A0807",
};

interface Props {
  className?: string;
  /** Map centre. Defaults to the city centre. */
  center?: google.maps.LatLngLiteral;
  /** Initial zoom. */
  zoom?: number;
  /**
   * When false, the map is locked (no pan/zoom) so an overlay of statically
   * projected dots stays aligned. Defaults to true.
   */
  interactive?: boolean;
  /** Draw the Varanasi district boundary on the map. Defaults to true. */
  showBoundary?: boolean;
  /** Boundary stroke colour. Defaults to the saffron hero accent. */
  boundaryColor?: string;
  /** Called once the map is created, so overlays can project off it. */
  onReady?: (map: google.maps.Map) => void;
  /** Exposes a zoomTo(lat,lng) action for the dot → segment transition. */
  mapActionsRef?: MutableRefObject<VaranasiMapActions | null>;
}

export function GoogleVaranasiMap({
  className = "",
  center = VARANASI_CENTER,
  zoom = 13,
  interactive = true,
  showBoundary = true,
  boundaryColor = "#E8A23C",
  onReady,
  mapActionsRef,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    // Must match every other useJsApiLoader call — the loader is a singleton.
    region: "IN",
  });

  const rafZoom = useRef<number>(0);
  useEffect(() => () => cancelAnimationFrame(rafZoom.current), []);

  if (!isLoaded) return null;

  const options: google.maps.MapOptions = {
    ...BASE_OPTIONS,
    center,
    zoom,
    gestureHandling: interactive ? "cooperative" : "none",
  };

  // ── Draw the district outline via the Data layer (same approach as the
  //    India map: load GeoJSON, stroke the boundary, leave the fill faint). ──
  function onLoad(map: google.maps.Map) {
    onReady?.(map);

    if (mapActionsRef) {
      mapActionsRef.current = {
        zoomTo(lat, lng) {
          cancelAnimationFrame(rafZoom.current);
          const z0 = map.getZoom() ?? 13;
          const c0 = map.getCenter();
          const lat0 = c0?.lat() ?? lat;
          const lng0 = c0?.lng() ?? lng;
          const target = 16;
          const DURATION = 1500;
          const ts = performance.now();
          function tick(now: number) {
            const raw = Math.min((now - ts) / DURATION, 1);
            const t = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
            map.setZoom(z0 + (target - z0) * t);
            map.setCenter({ lat: lat0 + (lat - lat0) * t, lng: lng0 + (lng - lng0) * t });
            if (raw < 1) rafZoom.current = requestAnimationFrame(tick);
          }
          rafZoom.current = requestAnimationFrame(tick);
        },
      };
    }

    if (!showBoundary) return;
    fetch(BOUNDARY_URL)
      .then((r) => r.json())
      .then((geojson: GeoJSON.GeoJsonObject) => {
        map.data.addGeoJson(geojson);
        map.data.setStyle({
          strokeColor: boundaryColor,
          strokeWeight: 3,
          strokeOpacity: 1,
          fillColor: boundaryColor,
          fillOpacity: 0.07,
          clickable: false,
        });
      })
      .catch(() => { /* boundary overlay is optional — fail silently */ });
  }

  return (
    <div className={`gmap-varanasi-wrap ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={options}
        onLoad={onLoad}
      />
    </div>
  );
}
