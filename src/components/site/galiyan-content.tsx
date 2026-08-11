"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GaliyanCities } from "@/components/site/galiyan-cities";
import { GaliyanStories } from "@/components/site/galiyan-stories";
import { VaranasiItinerary } from "@/components/site/varanasi-itinerary";

type Tab = "cities" | "itinerary" | "stories";

function GaliyanContentInner() {
  const params = useSearchParams();
  const tab = (params.get("tab") ?? "cities") as Tab;

  if (tab === "itinerary") {
    return (
      <section className="itin-section">
        <div className="section-inner">
          <p className="eyebrow">Itinerary</p>
          <div className="eyebrow-rule" />
          <h2 className="section-title">
            Four days in <em>Varanasi</em>.
          </h2>
          <p className="section-body">
            What to eat, where to go, and what to do — ordered not by monument but by how the
            city actually lives. For the traveller who wants to understand, not just visit.
          </p>
          <VaranasiItinerary />
        </div>
      </section>
    );
  }

  if (tab === "stories") {
    return (
      <section className="stories-section">
        <div className="section-inner stories-header">
          <p className="eyebrow">From the Field</p>
          <div className="eyebrow-rule" />
          <h2 className="section-title">
            Stories that <em>stay</em>.
          </h2>
          <p className="section-body">
            Slow, specific, and alive — dispatches from the lanes, the ghats, and the rooms where
            ordinary life is the story.
          </p>
          <GaliyanStories />
        </div>
        <div className="stories-scroll-hint" aria-hidden="true">
          <span className="scroll-hint-line" />
          <span className="scroll-hint-text">Scroll to explore</span>
          <span className="scroll-hint-line" />
        </div>
      </section>
    );
  }

  return (
    <section className="city-section">
      <div className="section-inner">
        <p className="eyebrow">The City Framework</p>
        <div className="eyebrow-rule" />
        <GaliyanCities />
      </div>
    </section>
  );
}

export function GaliyanContent() {
  return (
    <Suspense>
      <GaliyanContentInner />
    </Suspense>
  );
}
