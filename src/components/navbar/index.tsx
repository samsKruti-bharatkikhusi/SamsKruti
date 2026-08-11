"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { NavSealHub, NavSealGaliyan, NavSealParampara, NavSealHriday, SearchIcon, MapIcon } from "@/components/site/seals";
import type { SegmentSlug } from "@/lib/segments";

type Variant = "hub" | "landing" | "maps" | SegmentSlug;

type NavLink = {
  href: string;
  label: string;
  segment?: boolean;
  noScroll?: boolean;
  soon?: boolean;
};

const HUB_LINKS: NavLink[] = [
  { href: "/varanasi/hriday",    label: "Sheher Ka Hriday",    segment: true },
  { href: "/varanasi/galiyan",   label: "Sheher Ki Galiyan",  segment: true },
  { href: "/varanasi/parampara", label: "Sheher Ka Swaad",  segment: true },
];

const HOME_LINK: NavLink = { href: "/", label: "Home" };

const LANDING_LINKS: NavLink[] = [
  { href: "/varanasi",   label: "Varanasi" },
  // Other cities are hidden until their pages are ready — re-add as they launch:
  // { href: "#kedarnath",  label: "Kedarnath",  soon: true },
  // { href: "#somnath",    label: "Somnath",    soon: true },
  // { href: "#dwarka",     label: "Dwarka",     soon: true },
  // { href: "#ujjain",     label: "Ujjain",     soon: true },
  // { href: "#rameswaram", label: "Rameswaram", soon: true },
];

const SEGMENT_ANCHORS: Record<
  SegmentSlug,
  {
    primary:    { href: string; label: string; noScroll?: boolean };
    secondary:  { href: string; label: string; noScroll?: boolean };
    tertiary?:  { href: string; label: string; noScroll?: boolean };
  }
> = {
  galiyan: {
    primary:   { href: "/varanasi/galiyan?tab=cities",    label: "Cities",    noScroll: true },
    secondary: { href: "/varanasi/galiyan?tab=itinerary", label: "Itinerary", noScroll: true },
    tertiary:  { href: "/varanasi/galiyan?tab=stories",   label: "Stories",   noScroll: true },
  },
  parampara: {
    primary:   { href: "#traditions", label: "Traditions" },
    secondary: { href: "#cities",     label: "By City" },
  },
  hriday: {
    primary:   { href: "#artisans", label: "Artisans" },
    secondary: { href: "#crafts",   label: "By Craft" },
  },
};

function segmentLinks(active: SegmentSlug): NavLink[] {
  const others: Array<{ slug: SegmentSlug; label: string }> = [
    { slug: "galiyan",   label: "Sheher Ki Galiyan" },
    { slug: "parampara", label: "Sheher Ka Swaad" },
    { slug: "hriday",    label: "Sheher Ka Hriday" },
  ];
  const { primary, secondary, tertiary } = SEGMENT_ANCHORS[active];
  return [
    HOME_LINK,
    { href: "/varanasi", label: "Varanasi" },
    { href: primary.href,   label: primary.label,   noScroll: primary.noScroll },
    { href: secondary.href, label: secondary.label, noScroll: secondary.noScroll },
    ...(tertiary
      ? [{ href: tertiary.href, label: tertiary.label, noScroll: tertiary.noScroll }]
      : []),
    ...others
      .filter((o) => o.slug !== active)
      .map((o) => ({ href: `/varanasi/${o.slug}`, label: o.label, segment: true })),
  ];
}

const NAME_BY_VARIANT: Record<Variant, string> = {
  landing:   "SamsKruti",
  hub:       "SamsKruti",
  maps:      "SamsKruti",
  galiyan:   "Sheher Ki Galiyan",
  parampara: "Sheher Ka Swaad",
  hriday:    "Sheher Ka Hriday",
};

// secondary line under the logo — brand tagline at the top level, the city on
// the hub, and the parent breadcrumb inside a segment.
const SUBTITLE_BY_VARIANT: Record<Variant, string> = {
  landing:   "Living Culture of India",
  hub:       "Varanasi",
  maps:      "Living Culture of India",
  galiyan:   "SamsKruti · Varanasi",
  parampara: "SamsKruti · Varanasi",
  hriday:    "SamsKruti · Varanasi",
};

export function Navbar({
  variant = "hub",
  coverNav = false,
}: {
  variant?: Variant;
  coverNav?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu   = useCallback(() => setOpen(false), []);
  const openSearch  = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  const links =
    variant === "landing"  ? LANDING_LINKS :
    variant === "maps"     ? [HOME_LINK, ...LANDING_LINKS] :
    variant === "hub"      ? [HOME_LINK, ...HUB_LINKS] :
    segmentLinks(variant);

  let SealIcon: ReactNode;
  switch (variant) {
    case "galiyan":   SealIcon = <NavSealGaliyan />;  break;
    case "parampara": SealIcon = <NavSealParampara />; break;
    case "hriday":    SealIcon = <NavSealHriday />;   break;
    default:          SealIcon = <NavSealHub />;
  }

  return (
    <>
      <nav
        className={`site-nav${open ? " nav-open" : ""}${variant !== "hub" ? " seg-nav" : ""}${coverNav ? " nav-cover" : ""}`}
      >
        <Link href="/" className="nav-logo">
          {SealIcon}
          <span className="nav-logo-text">
            <span className="nav-logo-title">{NAME_BY_VARIANT[variant]}</span>
            <span className="nav-logo-sub">{SUBTITLE_BY_VARIANT[variant]}</span>
          </span>
        </Link>
        <ul className="nav-links">
          {links.map((l) => {
            const isHome = l.href === "/" && l.label === "Home";
            return (
              <li key={l.href + l.label}>
                {l.soon ? (
                  <span className="nav-link-soon">{l.label}</span>
                ) : (
                  <Link
                    href={l.href}
                    scroll={l.noScroll ? false : undefined}
                    className={
                      isHome      ? "nav-home-link"     :
                      l.segment   ? "nav-segment-link"  :
                      undefined
                    }
                    onClick={closeMenu}
                  >
                    {isHome ? "Home" : l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="nav-right">
          <Link href="/maps" className="nav-icon-btn" aria-label="Maps" title="Maps" onClick={closeMenu}>
            <MapIcon />
          </Link>
          <button className="nav-search-btn nav-icon-btn" aria-label="Search" onClick={openSearch}>
            <SearchIcon />
          </button>
          <button
            className="hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`search-overlay${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="search-inner">
        <form
          className="search-form"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            className="search-input"
            placeholder="Search cities, dishes, artisans…"
            autoComplete="off"
            aria-label="Search"
          />
          <button type="submit" className="search-submit" aria-label="Submit search">
            <SearchIcon width={18} height={18} />
          </button>
        </form>
        <div className="search-results" aria-live="polite">
          <p className="search-status">Search coming soon.</p>
        </div>
        <button className="search-close" onClick={onClose} aria-label="Close search">
          ✕
        </button>
      </div>
    </div>
  );
}
