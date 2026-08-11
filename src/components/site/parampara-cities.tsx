"use client";

import { useState } from "react";
import { cities, foods } from "@/data";

export function ParamparaCities() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = cities[activeIdx];
  const cityFoods = foods.filter((f) => f.cityName === active?.name);

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
        {cityFoods.length === 0 ? (
          <p className="empty-state" style={{ color: "var(--dust)" }}>
            No food traditions recorded for this city yet.
          </p>
        ) : (
          cityFoods.map((item) => (
            <article key={item._id} className="seg-city-card">
              <span className="seg-city-card-label">{item.category}</span>
              <h4 className="seg-city-card-title">{item.name}</h4>
              <p className="seg-city-card-body">{item.excerpt}</p>
            </article>
          ))
        )}
      </div>
    </>
  );
}
