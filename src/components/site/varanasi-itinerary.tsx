"use client";

import { useState } from "react";
import { varanasiItinerary } from "@/data";
import type { ItineraryStop } from "@/data";

function Stop({ stop, isLast }: { stop: ItineraryStop; isLast: boolean }) {
  return (
    <div className={`itin-stop${stop.isClosing ? " itin-stop-closing" : ""}`}>
      <div className="itin-stop-spine">
        <div className={`itin-stop-dot${stop.isClosing ? " itin-stop-dot-gold" : ""}`} />
        {!isLast && <div className="itin-stop-line" />}
      </div>
      <div className="itin-stop-body">
        <span className="itin-stop-time">{stop.time}</span>
        <h4 className={`itin-stop-name${stop.isClosing ? " itin-stop-name-gold" : ""}`}>
          {stop.name}
        </h4>
        <p className="itin-stop-desc">{stop.desc}</p>
        <blockquote className="itin-stop-story">{stop.story}</blockquote>
        <span className="itin-stop-duration">◷ {stop.duration}</span>
      </div>
    </div>
  );
}

export function VaranasiItinerary() {
  const [activeDay, setActiveDay] = useState(0);
  const day = varanasiItinerary.days[activeDay];

  return (
    <div className="itin-root">
      <div className="itin-intro-block">
        <p className="itin-intro-text">{varanasiItinerary.intro}</p>
        <div className="itin-stats-row">
          <div className="itin-stat">
            <span className="itin-stat-num">{varanasiItinerary.stats.days}</span>
            <span className="itin-stat-label">Days</span>
          </div>
          <div className="itin-stat">
            <span className="itin-stat-num">{varanasiItinerary.stats.stops}</span>
            <span className="itin-stat-label">Stops</span>
          </div>
          <div className="itin-stat">
            <span className="itin-stat-num">{varanasiItinerary.stats.pricePerPerson}</span>
            <span className="itin-stat-label">Per Person</span>
          </div>
        </div>
      </div>

      <div className="itin-day-tabs" role="tablist" aria-label="Select a day">
        {varanasiItinerary.days.map((d, i) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={i === activeDay}
            className={`itin-day-tab${i === activeDay ? " active" : ""}`}
            style={
              i === activeDay
                ? ({ "--day-accent": d.accentColor } as React.CSSProperties)
                : undefined
            }
            onClick={() => setActiveDay(i)}
          >
            <span className="itin-tab-numeral">{d.hindi}</span>
            <span className="itin-tab-english">Day {d.day}</span>
          </button>
        ))}
      </div>

      {day && (
        <div className="itin-day-panel" key={day.day}>
          <div
            className="itin-day-header"
            style={{ "--day-accent": day.accentColor } as React.CSSProperties}
          >
            <div className="itin-day-header-left">
              <div className="itin-day-number">0{day.day}</div>
              <span className="itin-day-theme-label">Day {day.day}</span>
              <h3 className="itin-day-theme">{day.theme}</h3>
              <p className="itin-day-tagline">{day.tagline}</p>
            </div>
            <div className="itin-day-header-accent-bar" />
          </div>

          <div className="itin-stops-list">
            {day.stops.map((stop, i) => (
              <Stop key={i} stop={stop} isLast={i === day.stops.length - 1} />
            ))}
          </div>
        </div>
      )}

      <div className="itin-ops-section">
        <p className="eyebrow">Operational Notes</p>
        <div className="eyebrow-rule" />
        <div className="itin-ops-grid">
          {varanasiItinerary.operationalNotes.map((note, i) => (
            <div key={i} className="itin-ops-item">
              <span className="itin-ops-icon" aria-hidden="true">{note.icon}</span>
              <span className="itin-ops-title">{note.title}</span>
              <p className="itin-ops-body">{note.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
