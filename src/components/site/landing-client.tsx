"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleIndiaMap, type MapActions } from "./google-india-map";
import { CityDots } from "./city-dots";
import { SiteHero } from "./site-hero";

export function LandingClient() {
  const router = useRouter();
  const mapActionsRef = useRef<MapActions | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [fading, setFading] = useState(false);

  function handleCityClick(cityId: string, lat: number, lng: number) {
    mapActionsRef.current?.zoomToCity(lat, lng);
    setTimeout(() => setFading(true), 1200);
    setTimeout(() => router.push(`/${cityId}`), 1900);
  }

  return (
    <>
      <SiteHero
        title={<>Sams<em>Kruti</em></>}
        devanagari="सम्स-क्रूति"
        tagline="Culture as a living creation"
        sub="Not preserved. Practiced. Continued."
        hint={
          <>
            <span className="lp-hint-arrow">→</span>
            Select a city on the map
          </>
        }
        map={<GoogleIndiaMap mapActionsRef={mapActionsRef} onReady={setMap} />}
        dots={<CityDots map={map} onCityClick={handleCityClick} />}
      />

      {fading && <div className="landing-fade" aria-hidden="true" />}
    </>
  );
}
