"use client";

import { useMemo, useState } from "react";
import { stories } from "@/data";

const CATEGORIES = ["", "Ritual", "Craft", "Memory", "People", "Philosophy", "Architecture"];

export function GaliyanStories() {
  const [active, setActive] = useState("");
  const filtered = useMemo(
    () => (active ? stories.filter((s) => s.category === active) : stories),
    [active]
  );

  return (
    <>
      <div className="stories-filter" role="group" aria-label="Filter stories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat || "all"}
            type="button"
            className={`filter-btn${active === cat ? " active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat || "All"}
          </button>
        ))}
      </div>
      <div className="stories-scroll" key={active}>
        {filtered.length === 0 ? (
          <p className="empty-state" style={{ color: "var(--dust)", padding: "2rem 5%" }}>
            No stories found.
          </p>
        ) : (
          filtered.map((s) => (
            <article
              key={s._id}
              className="story-card"
              style={
                {
                  ["--g1" as const]: s.gradient.g1,
                  ["--g2" as const]: s.gradient.g2,
                } as React.CSSProperties
              }
            >
              <div className="story-card-bg" />
              <div className="story-card-content">
                <span className="story-tag">{s.tag || `${s.cityName} · ${s.category}`}</span>
                <h3 className="story-title">{s.title}</h3>
                <p className="story-excerpt">{s.excerpt}</p>
                <span className="story-read">Read the story →</span>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
