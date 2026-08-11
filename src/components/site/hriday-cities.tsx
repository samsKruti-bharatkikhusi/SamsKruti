"use client";

import { useState } from "react";
import { artisans, cities } from "@/data";

export function HridayCities() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = cities[activeIdx];
  const cityArtisans = artisans.filter((a) => a.cityName === active?.name);

  return (
    <>
      <div className="city-tabs" role="tablist" aria-label="Select a city">
        {cities.map((c, i) => (
          <button
            key={c._id}
            type="button"
            role="tab"
            aria-selected={i === activeIdx}
            className={`city-tab${i === activeIdx ? " active" : ""}`}
            onClick={() => setActiveIdx(i)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="seg-city-grid" key={active?._id}>
        {cityArtisans.length === 0 ? (
          <p className="empty-state" style={{ color: "var(--dust)" }}>
            No artisans recorded for this city yet.
          </p>
        ) : (
          cityArtisans.map((a) => (
            <article key={a._id} className="seg-city-card">
              <span className="seg-city-card-label">{a.craft}</span>
              <h4 className="seg-city-card-title">{a.name}</h4>
              <p className="seg-city-card-body">{a.excerpt}</p>
            </article>
          ))
        )}
      </div>
    </>
  );
}
