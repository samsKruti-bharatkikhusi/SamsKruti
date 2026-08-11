"use client";

import { useMemo, useState } from "react";
import { artisans } from "@/data";

const FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "Banarasi Silk Weaving", label: "Silk" },
  { value: "Madhubani Painting", label: "Painting" },
  { value: "Blue Pottery", label: "Pottery" },
  { value: "Zardozi Embroidery", label: "Embroidery" },
  { value: "Patachitra Scroll Painting", label: "Scroll Art" },
  { value: "Sanganeri Block Printing", label: "Block Print" },
];

export function HridayArtisans() {
  const [active, setActive] = useState("");
  const filtered = useMemo(
    () => (active ? artisans.filter((a) => a.craft === active) : artisans),
    [active]
  );

  return (
    <>
      <div className="seg-filter" role="group" aria-label="Filter by craft">
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
            No artisans found.
          </p>
        ) : (
          filtered.map((a) => (
            <article
              key={a._id}
              className="seg-card"
              style={
                {
                  ["--g1" as const]: a.gradient.g1,
                  ["--g2" as const]: a.gradient.g2,
                } as React.CSSProperties
              }
            >
              <div className="seg-card-bg" />
              <div className="seg-card-content">
                <span className="seg-card-category">
                  {a.cityName} · {a.craft}
                </span>
                <h3 className="seg-card-title">{a.name}</h3>
                <p className="seg-card-excerpt">{a.excerpt}</p>
                <span className="seg-card-meta">{a.generation} generation</span>
                <span className="seg-card-read">Read the portrait →</span>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
