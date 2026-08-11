"use client";

import { useMemo, useState } from "react";
import { foods } from "@/data";

const FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "Ritual Food", label: "Ritual Food" },
  { value: "Street Invention", label: "Street Food" },
  { value: "Ancestral Dish", label: "Ancestral" },
  { value: "Sweet Tradition", label: "Sweet" },
  { value: "Rajasthani Heritage", label: "Heritage" },
  { value: "Dawn Feast", label: "Dawn Feast" },
];

export function ParamparaFoods() {
  const [active, setActive] = useState("");
  const filtered = useMemo(
    () => (active ? foods.filter((f) => f.category === active) : foods),
    [active]
  );

  return (
    <>
      <div className="seg-filter" role="group" aria-label="Filter by category">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            className={`filter-btn${active === f.value ? " active" : ""}`}
            onClick={() => setActive(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="seg-cards-scroll" key={active} style={{ marginTop: "1.5rem" }}>
        {filtered.length === 0 ? (
          <p className="empty-state" style={{ color: "var(--dust)", padding: "2rem 5%" }}>
            No traditions found.
          </p>
        ) : (
          filtered.map((item) => (
            <article
              key={item._id}
              className="seg-card"
              style={
                {
                  ["--g1" as const]: item.gradient.g1,
                  ["--g2" as const]: item.gradient.g2,
                } as React.CSSProperties
              }
            >
              <div className="seg-card-bg" />
              <div className="seg-card-content">
                <span className="seg-card-category">
                  {item.cityName} · {item.category}
                </span>
                <h3 className="seg-card-title">{item.name}</h3>
                <p className="seg-card-excerpt">{item.excerpt}</p>
                <span className="seg-card-read">Read more →</span>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
