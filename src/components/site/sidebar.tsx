"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { SearchOverlay } from "@/components/navbar";
import { NavSealHub, SearchIcon, MapIcon } from "@/components/site/seals";
import { MAP_CITIES } from "@/data/map-cities";
import { SEGMENTS, type SegmentSlug } from "@/lib/segments";
import type { HeroTheme } from "@/components/site/site-hero";

// The three Varanasi segments map onto their own routes.
const SEGMENT_HREF: Record<SegmentSlug, string> = {
  galiyan:   "/varanasi/galiyan",
  parampara: "/varanasi/parampara",
  hriday:    "/varanasi/hriday",
};

export function Sidebar({ theme }: { theme?: HeroTheme }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Map the theme onto the sidebar's --side-* tokens (structure unchanged).
  const scopeStyle = {
    ...(theme?.panel     ? { "--side-bg": theme.panel } : {}),
    ...(theme?.accent    ? { "--side-accent": theme.accent } : {}),
    ...(theme?.accentRgb ? { "--side-accent-rgb": theme.accentRgb } : {}),
    ...(theme?.glow      ? { "--side-glow": theme.glow } : {}),
    ...(theme?.text      ? { "--side-text": theme.text } : {}),
  } as CSSProperties;
  // Collapsible sections — both open by default.
  const [chapterOpen, setChapterOpen]   = useState(true);
  const [varanasiOpen, setVaranasiOpen] = useState(true);

  const close       = useCallback(() => setOpen(false), []);
  const openSearch  = useCallback(() => { setSearchOpen(true); setOpen(false); }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { close(); closeSearch(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, closeSearch]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, searchOpen]);

  return (
    <div className="side-scope" style={scopeStyle}>
      {/* Menu toggle — opens the drawer. Closing is by tapping outside / Esc. */}
      <button
        className={`side-toggle${open ? " is-open" : ""}`}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-sidebar"
        onClick={() => setOpen(true)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Backdrop — tap anywhere outside the drawer to close */}
      <div
        className={`side-backdrop${open ? " open" : ""}`}
        aria-hidden="true"
        onClick={close}
      />

      {/* Drawer */}
      <aside
        id="site-sidebar"
        className={`sidebar${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <Link href="/" className="side-brand" onClick={close}>
          <span className="side-brand-seal"><NavSealHub /></span>
          <span className="side-brand-text">
            <span className="side-brand-title">SamsKruti</span>
            <span className="side-brand-sub">Living Culture of India</span>
          </span>
        </Link>

        <nav className="side-nav" aria-label="Chapters">
          {/* ── Chapter 1 (collapsible, open by default) ── */}
          <section className="side-chapter">
            <button
              type="button"
              className={`side-chapter-head${chapterOpen ? " is-open" : ""}`}
              aria-expanded={chapterOpen}
              onClick={() => setChapterOpen((v) => !v)}
            >
              <span className="side-chapter-titles">
                <span className="side-chapter-kicker">Chapter 1</span>
                <span className="side-chapter-title">Dwadasha Jyotirlinga</span>
                <span className="side-chapter-deva">द्वादश ज्योतिर्लिंग</span>
              </span>
              <span className="side-chev" aria-hidden="true" />
            </button>

            <div className={`side-collapse${chapterOpen ? " open" : ""}`}>
              <div className="side-collapse-inner">
                <ul className="side-cities">
                {MAP_CITIES.map((city) => {
                  // Upcoming cities: listed to show the road ahead, but quiet
                  // and not clickable.
                  if (!city.active) {
                    return (
                      <li key={city.id} className="side-city is-soon" aria-disabled="true">
                        <span className="side-city-en">{city.city}</span>
                        <span className="side-city-temple">{city.templeHi}</span>
                      </li>
                    );
                  }

                  // Active city (Varanasi): name links to the city page, the
                  // chevron collapses/expands its three segments + the itinerary
                  // (all part of Varanasi, so they hide together when collapsed).
                  return (
                    <li key={city.id} className="side-city is-active">
                      <div className={`side-city-head${varanasiOpen ? " is-open" : ""}`}>
                        <Link href={`/${city.id}`} className="side-city-link" onClick={close}>
                          <span className="side-city-en">{city.city}</span>
                          <span className="side-city-temple">{city.templeHi}</span>
                        </Link>
                        <button
                          type="button"
                          className="side-city-toggle"
                          aria-expanded={varanasiOpen}
                          aria-label={`${varanasiOpen ? "Collapse" : "Expand"} ${city.city}`}
                          onClick={() => setVaranasiOpen((v) => !v)}
                        >
                          <span className="side-chev" aria-hidden="true" />
                        </button>
                      </div>

                      <div className={`side-collapse${varanasiOpen ? " open" : ""}`}>
                        <div className="side-collapse-inner">
                          <ul className="side-segments">
                            {SEGMENTS.map((s) => (
                              <li key={s.slug}>
                                <Link href={SEGMENT_HREF[s.slug]} className="side-segment" onClick={close}>
                                  <span className="side-segment-name">{s.name}</span>
                                  <span className="side-segment-city">{city.hindi}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={`/${city.id}/itinerary`}
                            className="side-city-link side-city-plan"
                            onClick={close}
                          >
                            <span className="side-city-en">Itinerary</span>
                            <span className="side-city-temple">{city.hindi}</span>
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Chapter 2 (placeholder — coming soon) ── */}
          <section className="side-chapter is-soon">
            <div className="side-chapter-head" aria-disabled="true">
              <span className="side-chapter-titles">
                <span className="side-chapter-kicker">Chapter 2</span>
                <span className="side-chapter-title">Coming soon</span>
              </span>
            </div>
          </section>
        </nav>

        <div className="side-actions">
          <button className="side-action" onClick={openSearch} aria-label="Search">
            <SearchIcon width={18} height={18} />
            <span>Search</span>
          </button>
          <Link href="/maps" className="side-action" onClick={close} aria-label="Maps">
            <MapIcon width={18} height={18} />
            <span>Map</span>
          </Link>
        </div>
      </aside>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
