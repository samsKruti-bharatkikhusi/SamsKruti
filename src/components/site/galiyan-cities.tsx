"use client";

import { useState } from "react";
import { cities, DIMENSION_ORDER } from "@/data";

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function GaliyanCities() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = cities[activeIdx];

  return (
    <>
      <h2 className="section-title seg-title">
        Starting with {active?.name ?? "Varanasi"}.
      </h2>
      <p className="section-body">
        Every city. Four dimensions. One story. SamsKruti enters each city through its culture,
        its craft, its people, and its memory.
      </p>
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
      <div className="city-grid">
        {active &&
          DIMENSION_ORDER.map((key) => {
            const dim = active.dimensions[key];
            return (
              <div
                key={`${active._id}-${key}`}
                className="city-card fade-in"
                style={{ ["--card-accent" as const]: dim.accentColor } as React.CSSProperties}
              >
                <div className="city-card-accent-bar" />
                <p className="city-card-eyebrow">{cap(key)}</p>
                <div className="city-card-rule" />
                <h3 className="city-card-title">{dim.title}</h3>
                <p className="city-card-body">{dim.body}</p>
                <span className="city-card-arrow">→</span>
              </div>
            );
          })}
      </div>
    </>
  );
}
